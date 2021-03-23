import React, { useEffect, useState } from "react";

import { Table, Form, Button, Popup } from "semantic-ui-react";

import DamlLedger, { useLedger, useParty } from "@daml/react";
import Ledger from "@daml/ledger";

import { WellKnownPartiesProvider, PartyDetails } from "@daml/hub-react";
import { useWellKnownParties } from "@daml/hub-react/lib";

import { InvestorInvitation } from "@daml.js/da-marketplace/lib/Marketplace/Investor";
import { IssuerInvitation } from "@daml.js/da-marketplace/lib/Marketplace/Issuer";
import { BrokerInvitation } from "@daml.js/da-marketplace/lib/Marketplace/Broker";
import { ExchangeInvitation } from "@daml.js/da-marketplace/lib/Marketplace/Exchange";
import { CustodianInvitation } from "@daml.js/da-marketplace/lib/Marketplace/Custodian";
import { UserSession } from "@daml.js/da-marketplace/lib/Marketplace/Onboarding";

import { MarketRole } from "@daml.js/da-marketplace/lib/Marketplace/Utils";
import QueryStreamProvider, {
  useContractQuery,
  AS_PUBLIC,
  usePartyToken,
  QueryStreamContext,
  useSetPartyToken,
} from "../websocket/queryStream";

import { useOperator, useDablParties } from "../components/common/common";

import Credentials, { retrieveCredentials } from "../Credentials";

import { httpBaseUrl, deploymentMode, DeploymentMode } from "../config";

import deployTrigger, {
  TRIGGER_HASH,
  MarketplaceTrigger,
} from "../../src/automation";
import { halfSecondPromise } from "./common/utils";

interface IPartyLoginData extends PartyDetails {
  role?: MarketRole;
  name: string;
  location: string;
  title?: string;
  issuerId?: string;
  deployMatchingEngine?: boolean;
}

const MARKETROLES = [
  "CustodianRole",
  "IssuerRole",
  "ExchangeRole",
  "InvestorRole",
  "BrokerRole",
];

enum loginStatusEnum {
  LOGGING_IN = "Logging in",
  LOGIN_FAILED = "Log in failed",
  LOGIN_FAILED_NO_CREDS = "Log in failed: no creds",
  LOGIN_FAILED_NO_ROLE = "Log in failed: no role",
  LOGIN_FAILED_NO_USERSESSION = "Log in failed: no user session",
  ASSIGNING_ROLE = "Assigning role",
  ASSIGNING_ROLE_FAILED = "Assigning role failed",
  DONE = "DONE",
  READY_TO_LOGIN = "ready to log in",
  ONBOARDING = "onboarding",
  ONBOARDING_ISSUER = "onboarding issuer",
  ONBOARDING_BROKER = "onboarding broker",
  ONBOARDING_EXCHANGE = "onboarding exchange",
  ONBOARDING_CUSTODIAN = "onboarding custodian",
  ONBOARDING_CCP = "onboarding CCP",
  WAITING_FOR_OPERATOR_INVITE = "waiting for operator invite",
}

const QuickSetup = (props: {
  parties: PartyDetails[];
  onLogin: (credentials?: Credentials) => void;
  onRequestClose: () => void;
}) => {
  const { parties, onLogin, onRequestClose } = props;

  const [partyLoginData, setPartyLoginData] = useState<
    Map<string, IPartyLoginData>
  >(new Map());

  const [loginStatus, setLoginStatus] = useState<Map<string, loginStatusEnum>>(
    new Map()
  );

  // const setPartyToken = useSetPartyToken();
  const queryStreamPartyToken = usePartyToken();

  const publicParty = useDablParties().parties.publicParty;
  const operator = useDablParties().parties.userAdminParty;

  const userSessions = useContractQuery(UserSession);
  const custodianInvites = useContractQuery(CustodianInvitation);
  const issuerInvites = useContractQuery(IssuerInvitation);
  const investorInvites = useContractQuery(InvestorInvitation);
  const exchangeInvites = useContractQuery(ExchangeInvitation);
  const brokerInvites = useContractQuery(BrokerInvitation);

  return (
    <div className="quick-setup">
      <Button
        icon="left arrow"
        className="ghost dark"
        onClick={() => onRequestClose()}
      />
      <p className="login-details dark">Quick Setup</p>
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell className="hint-cell">
              Party
              <Popup
                basic
                size="tiny"
                content="CCP must be manually onboarded after you've onboarded a default
                  custodian"
                trigger={<Button size="tiny" icon="info" />}
              />
            </Table.HeaderCell>
            <Table.HeaderCell>Role</Table.HeaderCell>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Location</Table.HeaderCell>
            <Table.HeaderCell>Other</Table.HeaderCell>
            <Table.HeaderCell>Status</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {parties.map((party) => (
            <LoginPartyRow
              key={party.party}
              party={party}
              updateAllPartiesLoginData={handleNewPartyLoginData}
              loginStatus={loginStatus.get(party.party)}
            />
          ))}
        </Table.Body>
      </Table>
      <Button
        className="go ghost dark"
        disabled={partyLoginData.size === 0}
        onClick={() => loginParty(getNextParty())}
      >
        Go!
      </Button>
    </div>
  );

  async function loginParty(partyData?: IPartyLoginData) {
    if (!partyData) {
      throw Error("No party data");
      return;
    }
    console.log(partyData);
    const { ledgerId, party, token, role } = partyData;

    if (!role) {
      throw Error("no role");
      return;
    }

    handleNewLoginStatus(party, loginStatusEnum.LOGGING_IN);

    onLogin({ ledgerId, party, token });
    // if (!setPartyToken) {
    //   throw Error("cant set party token");
    //   return;
    // }

    // setPartyToken(token);

    await confirmCredentials(3, token)
      .then(async () => {
        const newLedger = new Ledger({ token, httpBaseUrl });

        // await createUserSession(newLedger, party, operator, role)
        //   .then(async (resp) => {
        //     console.log("got user session", resp);

        //     await onboardParty(newLedger, partyData, role, 30)
        //       .then(() => handleNewLoginStatus(party, loginStatusEnum.DONE))

        //       .catch((err) => {
        //         console.log(err);
        //         handleNewLoginStatus(party, loginStatusEnum.LOGIN_FAILED);
        //       });
        //   })
        //   .catch((err) => {
        //     console.log(err);
        //     handleNewLoginStatus( party, loginStatusEnum.LOGIN_FAILED_NO_USERSESSION);
        //   })
        //   .finally(() => onLoginComplete(party))
      })
      .catch((err) => {
        console.log(err);
        handleNewLoginStatus(party, loginStatusEnum.LOGIN_FAILED_NO_CREDS);
      })
      .finally(() => onLoginComplete(party));
  }

  function onLoginComplete(partyId: string) {
    console.log("logout");
    handleNewLoginStatus(partyId, loginStatusEnum.DONE);

    const nextParty = getNextParty(partyId);
    if (nextParty) {
      loginParty(nextParty);
    } else {
      console.log("DONE");
    }
  }

  function getNextParty(partyId?: string): IPartyLoginData | undefined {
    const partyIds: string[] = Array.from(partyLoginData.keys());
    if (partyId) {
      const nextPartyId = partyIds[partyIds.indexOf(partyId) + 1];
      return partyLoginData.get(nextPartyId);
    }
    return partyLoginData.get(partyIds[0]);
  }

  async function confirmCredentials(
    retries: number,
    token: string
  ): Promise<Credentials> {
    const creds = await retrieveCredentials();

    if (creds && creds.token === token && token === queryStreamPartyToken) {
      console.log("got new creds");
      return creds;
    }

    if (retries > 0) {
      console.log("waiting for creds");
      await halfSecondPromise();
      return confirmCredentials(retries - 1, token);
    }

    throw new Error("Could not find credentials");
  }

  function handleNewLoginStatus(partyId: string, newStatus: loginStatusEnum) {
    let newMap = new Map(loginStatus);
    newMap.set(partyId, newStatus);
    setLoginStatus(newMap);
  }

  function handleNewPartyLoginData(data: IPartyLoginData) {
    let newData = new Map(partyLoginData);
    newData.set(data.party, data);
    setPartyLoginData(newData);
  }

  async function createUserSession(
    ledger: Ledger,
    user: string,
    operator: string,
    role: MarketRole
  ) {
    const currentUserSession = userSessions.find(
      (c) => c.contractData.user === user
    );

    if (currentUserSession) {
      console.log("found old user session ");
      return currentUserSession;
    }

    console.log("creating user session ");
    return await ledger.create(UserSession, { user, role, operator });
  }

  async function onboardParty(
    ledger: Ledger,
    data: IPartyLoginData,
    role: MarketRole,
    retries: number
  ): Promise<void> {
    handleNewLoginStatus(data.party, loginStatusEnum.ONBOARDING);
    switch (role) {
      case MarketRole.InvestorRole:
        console.log("invites", investorInvites);
        if (!!investorInvites[0]) {
          console.log("got invite, onboarding investor");
          return await onboardInvestor(operator, ledger, data);
        } else {
          break;
        }
      case MarketRole.IssuerRole:
        if (!!issuerInvites[0]) {
          console.log("got invite, onboarding issuer issuer");
          return await onboardIssuer(operator, ledger, data);
        } else {
          break;
        }
      case MarketRole.BrokerRole:
        if (!!brokerInvites[0]) {
          console.log("got invite, onboarding broker b");
          return await onboardBroker(operator, ledger, data, publicParty);
        } else {
          break;
        }
      case MarketRole.ExchangeRole:
        if (!!exchangeInvites[0]) {
          console.log("got invite, onboarding exchange");
          return await onboardExchange(operator, ledger, data, publicParty);
        } else {
          break;
        }
      case MarketRole.CustodianRole:
        if (!!custodianInvites[0]) {
          console.log("got invite, onboarding custodian");
          return await onboardCustodian(operator, ledger, data, publicParty);
        } else {
          break;
        }
    }

    if (retries > 0) {
      console.log("retrying");

      await halfSecondPromise();
      return onboardParty(ledger, data, role, retries - 1);
    } else {
      throw Error("Could not onboard party");
    }
  }
};

const LoginPartyRow = (props: {
  party: PartyDetails;
  loginStatus?: loginStatusEnum;
  updateAllPartiesLoginData: (data: IPartyLoginData) => void;
}) => {
  const { party, loginStatus, updateAllPartiesLoginData } = props;

  const [rowLoginData, setRowLoginData] = useState<IPartyLoginData>({
    ...party,
    role: undefined,
    name: party.partyName,
    location: "NYC",
    deployMatchingEngine: true,
  });

  const hasSelectedRole = !!rowLoginData.role;

  useEffect(() => {
    if (hasSelectedRole) {
      updateAllPartiesLoginData(rowLoginData);
    }
  }, [rowLoginData]);

  return (
    <Table.Row>
      <Table.Cell>
        <p className="dark">{party.partyName}</p>
      </Table.Cell>
      <Table.Cell>
        <Form.Select
          placeholder="Select..."
          onChange={(_, data: any) =>
            setRowLoginData({
              ...rowLoginData,
              role: data.value,
            })
          }
          options={MARKETROLES.map((role) => {
            return { text: role, value: role };
          })}
        />
      </Table.Cell>
      <Table.Cell>
        <Form.Input
          value={rowLoginData.name}
          placeholder="name"
          disabled={!hasSelectedRole}
          onChange={(e) =>
            setRowLoginData({
              ...rowLoginData,
              name: e.currentTarget.value,
            })
          }
        />
      </Table.Cell>
      <Table.Cell>
        <Form.Input
          value={rowLoginData.location}
          placeholder="location"
          disabled={!hasSelectedRole}
          onChange={(e) =>
            setRowLoginData({
              ...rowLoginData,
              location: e.currentTarget.value,
            })
          }
        />
      </Table.Cell>
      <Table.Cell>
        {rowLoginData.role === MarketRole.IssuerRole ? (
          <Form.Input
            value={rowLoginData.issuerId}
            placeholder="issuer Id"
            disabled={!hasSelectedRole}
            onChange={(e) =>
              setRowLoginData({
                ...rowLoginData,
                issuerId: e.currentTarget.value,
              })
            }
          />
        ) : (
          deploymentMode === DeploymentMode.PROD_DABL &&
          rowLoginData.role === MarketRole.ExchangeRole && (
            <Form.Checkbox
              className="red"
              defaultChecked
              label={
                <label>
                  <p className="dark p2">
                    Deploy matching engine {<br />} (uncheck if you plan to use
                    the Exberry Integration)
                  </p>
                </label>
              }
              onChange={(event) =>
                setRowLoginData({
                  ...rowLoginData,
                  deployMatchingEngine: !rowLoginData.deployMatchingEngine,
                })
              }
            />
          )
        )}
      </Table.Cell>
      <Table.Cell>
        <p className="dark p2">{loginStatus ? loginStatus : "none"}</p>
      </Table.Cell>
    </Table.Row>
  );
};

async function onboardInvestor(
  operator: string,
  ledger: Ledger,
  data: IPartyLoginData
) {
  const key = { _1: operator, _2: data.party };
  const args = {
    name: data.name,
    location: data.location,
    isPublic: true,
  };
  console.log("onboarding investor ", data.name);

  await ledger
    .exerciseByKey(InvestorInvitation.InvestorInvitation_Accept, key, args)
    .catch((err) => console.error(err));
}

async function onboardIssuer(
  operator: string,
  ledger: Ledger,
  data: IPartyLoginData
) {
  const key = { _1: operator, _2: data.party };
  const args = {
    name: data.name,
    location: data.location,
    title: data.title || "NONE",
    issuerID: data.issuerId || "NONE",
  };

  console.log("onboarding issuer ", data.name);

  await ledger
    .exerciseByKey(IssuerInvitation.IssuerInvitation_Accept, key, args)
    .catch((err) => console.error(err));
}

async function onboardBroker(
  operator: string,
  ledger: Ledger,
  data: IPartyLoginData,
  publicParty: string
) {
  console.log("onboarding boker ", data.name);

  if (
    deploymentMode == DeploymentMode.PROD_DABL &&
    TRIGGER_HASH &&
    data.token
  ) {
    deployTrigger(
      TRIGGER_HASH,
      MarketplaceTrigger.BrokerTrigger,
      data.token,
      publicParty
    );
  }
  const key = { _1: operator, _2: data.party };
  const args = {
    name: data.name,
    location: data.location,
  };

  await ledger
    .exerciseByKey(BrokerInvitation.BrokerInvitation_Accept, key, args)
    .catch((err) => console.error(err));
}

async function onboardExchange(
  operator: string,
  ledger: Ledger,
  data: IPartyLoginData,
  publicParty: string
) {
  console.log("onboarding exchange ", data.name);

  if (
    deploymentMode == DeploymentMode.PROD_DABL &&
    TRIGGER_HASH &&
    data.token
  ) {
    deployTrigger(
      TRIGGER_HASH,
      MarketplaceTrigger.ExchangeTrigger,
      data.token,
      publicParty
    );
    if (!!data.deployMatchingEngine) {
      deployTrigger(
        TRIGGER_HASH,
        MarketplaceTrigger.MatchingEngine,
        data.token,
        publicParty
      );
    }
  }
  const key = { _1: operator, _2: data.party };
  const args = {
    name: data.name,
    location: data.location,
  };

  await ledger
    .exerciseByKey(ExchangeInvitation.ExchangeInvitation_Accept, key, args)
    .catch((err) => console.error(err));
}

async function onboardCustodian(
  operator: string,
  ledger: Ledger,
  data: IPartyLoginData,
  publicParty: string
) {
  console.log("onboarding custodian ", data.name);

  if (
    deploymentMode == DeploymentMode.PROD_DABL &&
    TRIGGER_HASH &&
    data.token
  ) {
    deployTrigger(
      TRIGGER_HASH,
      MarketplaceTrigger.CustodianTrigger,
      data.token,
      publicParty
    );
  }
  const key = { _1: operator, _2: data.party };
  const args = {
    name: data.name,
    location: data.location,
  };

  await ledger
    .exerciseByKey(CustodianInvitation.CustodianInvitation_Accept, key, args)
    .catch((err) => console.error(err));
}

export default QuickSetup;
