import React, { useEffect, useState } from "react";

import { useHistory } from "react-router-dom";

import { Table, Form, Button, Popup } from "semantic-ui-react";

import DamlLedger, { useLedger } from "@daml/react";
import Ledger from "@daml/ledger";

import { WellKnownPartiesProvider, PartyDetails } from "@daml/hub-react";

import { InvestorInvitation } from "@daml.js/da-marketplace/lib/Marketplace/Investor";
import { IssuerInvitation } from "@daml.js/da-marketplace/lib/Marketplace/Issuer";
import { BrokerInvitation } from "@daml.js/da-marketplace/lib/Marketplace/Broker";
import { ExchangeInvitation } from "@daml.js/da-marketplace/lib/Marketplace/Exchange";
import { CustodianInvitation } from "@daml.js/da-marketplace/lib/Marketplace/Custodian";
import { CCPInvitation } from "@daml.js/da-marketplace/lib/Marketplace/CentralCounterparty";

import { MarketRole } from "@daml.js/da-marketplace/lib/Marketplace/Utils";

import { useOperator, useDablParties } from "../components/common/common";
import { wrapDamlTuple } from "../components/common/damlTypes";
import { halfSecondPromise } from "../components/common/utils";

import Credentials from "../Credentials";

import { httpBaseUrl, deploymentMode, DeploymentMode } from "../config";
import { padStart } from "lodash";

import deployTrigger, {
  TRIGGER_HASH,
  MarketplaceTrigger,
  checkForExistingTrigger,
} from "../../src/automation";

interface IPartyLoginData extends PartyDetails {
  role: string;
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
  ASSIGNING_ROLE = "Assigning role",
  ASSIGNING_ROLE_FAILED = "Assigning role failed",
  DONE = "DONE",
  READY_TO_LOGIN = "ready to log in",
  ONBOARDING_INVESTOR = "onboarding investor",
  ONBOARDING_ISSUER = "onboarding issuer",
  ONBOARDING_BROKER = "onboarding broker",
  ONBOARDING_EXCHANGE = "onboarding exchange",
  ONBOARDING_CUSTODIAN = "onboarding custodian",
  ONBOARDING_CCP = "onboarding CCP",
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

  const [currentPartyId, setCurrentPartyId] = useState<string | undefined>(
    undefined
  );

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
              onLoginStart={onLoginStart}
              onLoginComplete={onLoginComplete}
              currentPartyId={currentPartyId}
            />
          ))}
        </Table.Body>
      </Table>
      <Button
        className="right floated ghost dark"
        disabled={partyLoginData.size === 0 || !!currentPartyId}
        onClick={() => loginNextParty(Array.from(partyLoginData.keys())[0])}
      >
        Go!
      </Button>
    </div>
  );

  async function onLoginStart(
    data: IPartyLoginData
  ): Promise<IPartyLoginData | undefined> {
    const { ledgerId, party, token } = data;
    onLogin({ ledgerId, party, token });
    return data;
  }

  function onLoginComplete() {
    onLogin(undefined);

    if (currentPartyId) {
      const keyArray = Array.from(partyLoginData.keys());
      const nextPartyId = keyArray[keyArray.indexOf(currentPartyId) + 1];
      console.log("logout and login next party");
      loginNextParty(nextPartyId);
    }
  }

  function loginNextParty(nextPartyId: string) {
    const newOnboardingParty = partyLoginData.get(nextPartyId);
    if (!!newOnboardingParty) {
      console.log("NEW PARTY LOGIN FLOW:", newOnboardingParty.name);
      onLoginStart(newOnboardingParty).finally(() =>
        setCurrentPartyId(nextPartyId)
      );
    } else {
      console.log("ALL DONE");
      return;
    }
  }

  function handleNewPartyLoginData(data: IPartyLoginData) {
    let newData = new Map(partyLoginData);
    newData.set(data.party, data);
    //console.log("new party data for:", data.name);

    setPartyLoginData(newData);
  }
};

const LoginPartyRow = (props: {
  party: PartyDetails;
  currentPartyId?: string;
  onLoginStart: (data: IPartyLoginData) => void;
  onLoginComplete: () => void;
  updateAllPartiesLoginData: (data: IPartyLoginData) => void;
}) => {
  const {
    party,
    currentPartyId,
    updateAllPartiesLoginData,
    onLoginStart,
    onLoginComplete,
  } = props;

  const [rowLoginData, setRowLoginData] = useState<IPartyLoginData>({
    ...party,
    role: "",
    name: party.partyName,
    location: "NYC",
    deployMatchingEngine: true,
  });

  const hasSelectedRole = rowLoginData.role !== "";

  useEffect(() => {
    if (hasSelectedRole) {
      updateAllPartiesLoginData(rowLoginData);
    }
  }, [rowLoginData]);

  useEffect(() => {
    if (party.party === currentPartyId) {
      // console.log("starting login for ", partyLoggingIn?.name);
      console.log("ONBOARDING PARTY: ", party.partyName);
      // onLoginComplete();
      // onLoginStart(rowLoginData);
    }
  }, [currentPartyId]);

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
          deploymentMode != DeploymentMode.PROD_DABL &&
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
        {currentPartyId && party.party === currentPartyId && (
          <DamlLedger
            reconnectThreshold={0}
            token={rowLoginData.token}
            party={rowLoginData.party}
            httpBaseUrl={httpBaseUrl}
          >
            <WellKnownPartiesProvider>
              <SinglePartyOnboard
                data={rowLoginData}
                onLoginComplete={onLoginComplete}
              />
            </WellKnownPartiesProvider>
          </DamlLedger>
        )}
      </Table.Cell>
    </Table.Row>
  );
};

const SinglePartyOnboard = (props: {
  data: IPartyLoginData;
  onLoginComplete: (data: IPartyLoginData) => void;
}) => {
  const { data, onLoginComplete } = props;
  const operator = useOperator();

  const [loginStatus, setLoginStatus] = useState<loginStatusEnum>(
    loginStatusEnum.LOGGING_IN
  );
  const ledger = useLedger();
  const publicParty = useDablParties().parties.publicParty;
  useEffect(() => {
    onboardParty()
      .finally(() => hangleLoginComplete(true))
      .catch(() => hangleLoginComplete(false));
  },[]);

  return (
    <div>
      <p className="dark">{loginStatus}</p>
    </div>
  );

  function hangleLoginComplete(success: boolean) {
    if (success) {
      console.log("setting login done ", data.name);

      setLoginStatus(loginStatusEnum.DONE);
    } else {
      console.log("login failed for ", data.name);

      setLoginStatus(loginStatusEnum.LOGIN_FAILED);
    }
    onLoginComplete(data);
  }

  function onboardParty(): Promise<void> {
    if (data.role === MarketRole.InvestorRole) {
      setLoginStatus(loginStatusEnum.ONBOARDING_INVESTOR);
      onboardInvestor(operator, ledger, data);
    } else if (data.role === MarketRole.IssuerRole) {
      setLoginStatus(loginStatusEnum.ONBOARDING_ISSUER);
      return onboardIssuer(operator, ledger, data);
    } else if (data.role === MarketRole.BrokerRole) {
      setLoginStatus(loginStatusEnum.ONBOARDING_BROKER);
      return onboardBroker(operator, ledger, data, publicParty);
    } else if (data.role === MarketRole.ExchangeRole) {
      setLoginStatus(loginStatusEnum.ONBOARDING_EXCHANGE);
      return onboardExchange(operator, ledger, data, publicParty);
    }

    return onboardCustodian(operator, ledger, data, publicParty);

    // switch (data.role) {
    //   case MarketRole.InvestorRole:
    //     setLoginStatus(loginStatusEnum.ONBOARDING_INVESTOR);
    //     onboardInvestor(operator, ledger, data);

    //   case MarketRole.IssuerRole:
    //     setLoginStatus(loginStatusEnum.ONBOARDING_ISSUER);
    //     return onboardIssuer(operator, ledger, data);

    //   case MarketRole.BrokerRole:
    //     setLoginStatus(loginStatusEnum.ONBOARDING_BROKER);
    //     return onboardBroker(operator, ledger, data, publicParty);

    //   case MarketRole.ExchangeRole:
    //     setLoginStatus(loginStatusEnum.ONBOARDING_EXCHANGE);
    //     return onboardExchange(operator, ledger, data, publicParty);

    //   case MarketRole.CustodianRole:
    //     setLoginStatus(loginStatusEnum.ONBOARDING_CUSTODIAN);
    //     return onboardCustodian(operator, ledger, data, publicParty);

    //   default:
    //     setLoginStatus(loginStatusEnum.LOGIN_FAILED);
    //     return undefined;
    //}
  }
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
