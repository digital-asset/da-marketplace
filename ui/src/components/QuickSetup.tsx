import React, { useEffect, useState } from "react";

import { Form, Button, Grid, Loader } from "semantic-ui-react";

import Ledger from "@daml/ledger";

import { PartyDetails } from "@daml/hub-react";

import { InvestorInvitation } from "@daml.js/da-marketplace/lib/Marketplace/Investor";
import { IssuerInvitation } from "@daml.js/da-marketplace/lib/Marketplace/Issuer";
import { BrokerInvitation } from "@daml.js/da-marketplace/lib/Marketplace/Broker";
import { ExchangeInvitation } from "@daml.js/da-marketplace/lib/Marketplace/Exchange";
import { CustodianInvitation } from "@daml.js/da-marketplace/lib/Marketplace/Custodian";
import { UserSession } from "@daml.js/da-marketplace/lib/Marketplace/Onboarding";

import { MarketRole } from "@daml.js/da-marketplace/lib/Marketplace/Utils";
import QueryStreamProvider, {
  useContractQuery,
} from "../websocket/queryStream";

import { useDablParties } from "../components/common/common";

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

const QuickSetup = (props: {
  parties: PartyDetails[];
  onLogin: (credentials?: Credentials) => void;
  onRequestClose: () => void;
}) => {
  const { parties, onLogin, onRequestClose } = props;
  const [loggedInRoles, setLoggedInRoles] = useState<IPartyLoginData[]>([]);
  const [selectedParty, setSelectedParty] = useState<PartyDetails>();
  const [selectedRole, setSelectedRole] = useState<MarketRole>();
  const partyOptions = parties.map((party) => {
    return { text: party.partyName, value: party.party };
  });

  const roleOptions = MARKETROLES.map((role) => {
    return { text: role, value: role };
  });

  console.log(loggedInRoles)

  return (
    <div className="quick-setup">
      <Button
        icon="left arrow"
        className="back-button ghost dark"
        onClick={() => onRequestClose()}
      />
      <p className="login-details dark">Quick Setup</p>
      <Grid>
        <Grid.Row>
          <Grid.Column width={8}>
            <Form.Select
              label={
                <p className="dark">
                  Party
                  {/* <Popup
                        basic
                        size="tiny"
                        content="CCP must be manually onboarded after you've onboarded a default
              custodian"
                        trigger={<Button size="tiny" icon="info" />}
                      /> */}
                </p>
              }
              value={
                selectedParty
                  ? partyOptions.find((p) => selectedParty.party === p.value)
                      ?.value
                  : ""
              }
              placeholder="Select..."
              onChange={(_, data: any) =>
                handleChangeParty(parties.find((p) => p.party === data.value))
              }
              options={partyOptions}
            />
          </Grid.Column>
          <Grid.Column width={8}>
            <Form.Select
              value={
                selectedRole
                  ? roleOptions.find((p) => selectedRole === p.value)?.value
                  : ""
              }
              label={<p className="dark">Role</p>}
              placeholder="Select..."
              onChange={(_, data: any) => setSelectedRole(data.value)}
              options={roleOptions}
            />
          </Grid.Column>
        </Grid.Row>
      </Grid>
      <Button
       diabled={!selectedParty && !selectedRole}>
        
      </Button>
      {selectedParty && selectedRole && (
        <QueryStreamProvider setToken={selectedParty.token}>
          <SetupForm
            selectedParty={selectedParty}
            selectedRole={selectedRole}
            onLogin={onLogin}
            clearPartyRoleSelect={clearPartyRoleSelect}
            saveLoggedInRole={handleNewLoggedInRole}
          />
        </QueryStreamProvider>
      )}
    </div>
  );

  function handleChangeParty(newParty?: PartyDetails) {
    if (!!selectedParty && !!selectedRole) {
      setSelectedRole(undefined)
    }
    setSelectedParty(newParty)
  }

  function handleNewLoggedInRole(data: IPartyLoginData) {
    setLoggedInRoles([...loggedInRoles, data])
  }

  function clearPartyRoleSelect() {
    setSelectedParty(undefined);
    setSelectedRole(undefined);
  }
};

const SetupForm = (props: {
  selectedParty: PartyDetails;
  selectedRole: MarketRole;
  onLogin: (credentials?: Credentials) => void;
  clearPartyRoleSelect: () => void;
  saveLoggedInRole: (data: IPartyLoginData) => void
}) => {
  const { selectedParty, selectedRole, onLogin, clearPartyRoleSelect, saveLoggedInRole} = props;

  const [loginStatus, setLoginStatus] = useState<string>();

  const [partyLoginData, setPartyLoginData] = useState<IPartyLoginData>();
  const [partyLoggingIn, setPartyLoggingIn] = useState<boolean>(false);

  const publicParty = useDablParties().parties.publicParty;
  const operator = useDablParties().parties.userAdminParty;

  const userSessions = useContractQuery(UserSession);
  const custodianInvites = useContractQuery(CustodianInvitation);
  const issuerInvites = useContractQuery(IssuerInvitation);
  const investorInvites = useContractQuery(InvestorInvitation);
  const exchangeInvites = useContractQuery(ExchangeInvitation);
  const brokerInvites = useContractQuery(BrokerInvitation);

  useEffect(() => {
    setPartyLoginData({
      ...selectedParty,
      role: selectedRole,
      name: selectedParty.partyName,
      location: "NYC",
      deployMatchingEngine: true,
    });
  }, [selectedParty, selectedRole]);

  const hasSelectedRole = !!partyLoginData?.role;

  if (!partyLoginData) {
    return null;
  }

  if (partyLoggingIn) {
    return (
      <p className="dark login-status">
        <Loader active indeterminate inverted size="small">{loginStatus ? loginStatus : 'Loading..'}</Loader>
      </p>
    );
  }

  return (
    <>
      <p className="dark login-details">
        Please fill in some information about this role:
      </p>
      <Grid>
        <Grid.Row>
          <Grid.Column width={8}>
            <Form.Input
              label={<p className="dark">Name</p>}
              value={partyLoginData.name}
              placeholder="name"
              disabled={!hasSelectedRole}
              onChange={(e) =>
                setPartyLoginData({
                  ...partyLoginData,
                  name: e.currentTarget.value,
                })
              }
            />
          </Grid.Column>
          <Grid.Column width={8}>
            <Form.Input
              label={<p className="dark">Location</p>}
              value={partyLoginData.location}
              placeholder="location"
              disabled={!hasSelectedRole}
              onChange={(e) =>
                setPartyLoginData({
                  ...partyLoginData,
                  location: e.currentTarget.value,
                })
              }
            />
          </Grid.Column>
        </Grid.Row>

        <Grid.Row>
          {partyLoginData.role === MarketRole.IssuerRole ? (
            <Grid.Column width={8}>
              <Form.Input
                label={<p className="dark">Issuer Id</p>}
                value={partyLoginData.issuerId}
                placeholder="issuer Id"
                disabled={!hasSelectedRole}
                onChange={(e) =>
                  setPartyLoginData({
                    ...partyLoginData,
                    issuerId: e.currentTarget.value,
                  })
                }
              />
            </Grid.Column>
          ) : (
            deploymentMode === DeploymentMode.PROD_DABL &&
            partyLoginData.role === MarketRole.ExchangeRole && (
              <Grid.Column width={8}>
                <Form.Checkbox
                  className="red"
                  defaultChecked
                  label={
                    <p className="dark p2">
                      Deploy matching engine {<br />} (uncheck if you plan to
                      use the Exberry Integration)
                    </p>
                  }
                  onChange={(event) =>
                    setPartyLoginData({
                      ...partyLoginData,
                      deployMatchingEngine: !partyLoginData.deployMatchingEngine,
                    })
                  }
                />
              </Grid.Column>
            )
          )}
        </Grid.Row>
      </Grid>
      <Button
        className="go ghost dark"
        disabled={!partyLoginData}
        onClick={() => loginParty()}
      >
        Go!
      </Button>
    </>
  );

  async function handleSetLoginStatus(status: string) {
    await halfSecondPromise();
    setLoginStatus(status);
  }

  async function confirmCredentials(
    retries: number,
    token: string
  ): Promise<Credentials> {
    handleSetLoginStatus("confirming party credentials");
    const creds = await retrieveCredentials();

    if (creds && creds.token === token) {
      console.log("got new creds");
      await halfSecondPromise();
      return creds;
    }

    if (retries > 0) {
      console.log("waiting for creds");
      await halfSecondPromise();
      return confirmCredentials(retries - 1, token);
    }

    throw new Error("Could not find credentials");
  }

  async function createUserSession(
    ledger: Ledger,
    user: string,
    operator: string,
    role: MarketRole
  ) {
    if (userSessions.length > 1) {
      console.log("found old user session ");
      return;
    }

    console.log("creating user session ");
    return await ledger.create(UserSession, { user, role, operator });
  }

  async function loginParty() {
    if (!partyLoginData) {
      return undefined;
    }

    const { ledgerId, party, token, role } = partyLoginData;

    if (!role) {
      return undefined;
    }
    setPartyLoggingIn(true);
    handleSetLoginStatus("logging in");

    onLogin({ ledgerId, party, token });

    confirmCredentials(3, token)
      .then(async () => {
        const newLedger = new Ledger({ token, httpBaseUrl });
        handleSetLoginStatus("creating ledger context");

        await createUserSession(newLedger, party, operator, role)
          .then(async (resp) => {
            handleSetLoginStatus("creating user session");

            console.log("got user session", resp);

            await onboardParty(newLedger, partyLoginData, role, 10)
              .then(() => {
                saveLoggedInRole(partyLoginData)
                handleSetLoginStatus("done")
              })

              .catch((err) => {
                console.log(err);
                handleSetLoginStatus("login failed");
              });
          })
          .catch((err) => {
            console.log(err);
            handleSetLoginStatus("login failed, couldnt find user session");
          });
      })
      .catch((err) => {
        console.log(err);
        handleSetLoginStatus("login failed, coulnt get credentials");
      })
      .finally(() => onLoginComplete(party));
  }

  function onLoginComplete(partyId: string) {
    console.log("logout");
    handleSetLoginStatus("done");
    setPartyLoginData(undefined);
    clearPartyRoleSelect();
    setPartyLoggingIn(false);
  }

  async function onboardParty(
    ledger: Ledger,
    data: IPartyLoginData,
    role: MarketRole,
    retries: number
  ): Promise<void> {
    handleSetLoginStatus(`onboarding ${data.role}`);
    switch (role) {
      case MarketRole.InvestorRole:
        if (!!investorInvites[0]) {
          handleSetLoginStatus("recieved invite, onboarding investor");

          console.log("got invite, onboarding investor");
          return await onboardInvestor(operator, ledger, data);
        } else {
          break;
        }
      case MarketRole.IssuerRole:
        if (!!issuerInvites[0]) {
          handleSetLoginStatus("recieved invite, onboarding issuer");

          console.log("got invite, onboarding issuer issuer");
          return await onboardIssuer(operator, ledger, data);
        } else {
          break;
        }
      case MarketRole.BrokerRole:
        if (!!brokerInvites[0]) {
          handleSetLoginStatus("recieved invite, onboarding broker");

          console.log("got invite, onboarding broker b");
          return await onboardBroker(operator, ledger, data, publicParty);
        } else {
          break;
        }
      case MarketRole.ExchangeRole:
        if (!!exchangeInvites[0]) {
          handleSetLoginStatus("recieved invite, onboarding exchange");

          console.log("got invite, onboarding exchange");
          return await onboardExchange(operator, ledger, data, publicParty);
        } else {
          break;
        }
      case MarketRole.CustodianRole:
        if (!!custodianInvites[0]) {
          handleSetLoginStatus("recieved invite, onboarding custodian");

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
      onLogin()
      throw Error("Could not onboard party");
    }
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
