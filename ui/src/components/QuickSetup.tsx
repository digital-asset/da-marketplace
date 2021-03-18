import React, { useEffect, useState } from "react";

import { useHistory } from "react-router-dom";

import { Table, Form, Button } from "semantic-ui-react";

import DamlLedger, { useLedger } from "@daml/react";
import Ledger from "@daml/ledger";

import { WellKnownPartiesProvider, PartyDetails } from "@daml/hub-react";

import { InvestorInvitation } from "@daml.js/da-marketplace/lib/Marketplace/Investor";
import { IssuerInvitation } from "@daml.js/da-marketplace/lib/Marketplace/Issuer";
import { BrokerInvitation } from "@daml.js/da-marketplace/lib/Marketplace/Broker";
import { ExchangeInvitation } from "@daml.js/da-marketplace/lib/Marketplace/Exchange";
import { CustodianInvitation } from "@daml.js/da-marketplace/lib/Marketplace/Custodian";
import { CCPInvitation } from '@daml.js/da-marketplace/lib/Marketplace/CentralCounterparty'


import { MarketRole } from "@daml.js/da-marketplace/lib/Marketplace/Utils";

import { useOperator } from "../components/common/common";
import { wrapDamlTuple } from "../components/common/damlTypes";
import { halfSecondPromise } from "../components/common/utils";

import Credentials from "../Credentials";

import { httpBaseUrl } from "../config";
import { padStart } from "lodash";

import deployTrigger, { TRIGGER_HASH, MarketplaceTrigger, checkForExistingTrigger } from '../../src/automation'

interface IPartyLoginData extends PartyDetails {
  role: string;
  name: string;
  location: string;
  title?: string;
  issuerId?: string;
}

const MARKETROLES = [
  "CustodianRole",
  "IssuerRole",
  "ExchangeRole",
  "InvestorRole",
  "BrokerRole",
  "CCPRole",
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
  console.log(TRIGGER_HASH)
  // checkForExistingTrigger(TRIGGER_HASH)
  const [partyLoginData, setPartyLoginData] = useState<
    Map<string, IPartyLoginData>
  >(new Map());

  const partyLoginDataIterator = partyLoginData.entries();
  const loginRetries = 3;

  const [partyLoggingIn, setPartyLoggingIn] = useState<
    IPartyLoginData | undefined
  >(undefined);

  return (
    <div className="quick-setup">
      <Button
        icon="left arrow"
        className="ghost dark"
        onClick={() => onRequestClose()}
      />
      <p className="login-details dark">
        Select the roles you wish to onboard each party as:
      </p>
      <Table fixed>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell width={8}>Party</Table.HeaderCell>
            <Table.HeaderCell width={8}>Role</Table.HeaderCell>
            <Table.HeaderCell width={8}>Name</Table.HeaderCell>
            <Table.HeaderCell width={8}>Location</Table.HeaderCell>
            {/* <Table.HeaderCell width={8}>Title</Table.HeaderCell>
            <Table.HeaderCell width={8}>Id</Table.HeaderCell> */}

            <Table.HeaderCell width={10}>Status</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {parties.map((party) => (
            <LoginPartyRow
              key={party.party}
              party={party}
              updateAllPartiesLoginData={handleNewPartyLoginData}
              onLoginStart={() => onLoginStart(3)}
              onLoginComplete={() => onLoginComplete()}
              partyLoggingIn={partyLoggingIn}
            />
          ))}
        </Table.Body>
      </Table>
      <Button
        disabled={partyLoginData.size === 0 || !!partyLoggingIn}
        onClick={() => loginNextParty()}
      >
        Go!
      </Button>
    </div>
  );

  async function onLoginStart(
    retries: number
  ): Promise<IPartyLoginData | undefined> {
    if (partyLoggingIn) {
      const { ledgerId, party, token } = partyLoggingIn;
      onLogin({ ledgerId, party, token });
      return partyLoggingIn;
    } else {
      if (retries > 0) {
        await halfSecondPromise();
        return onLoginStart(retries - 1);
      }
    }
  }

  function onLoginComplete() {
    return new Promise(() => {
      onLogin(undefined);
    }).finally(() => loginNextParty());
  }

  function loginNextParty() {
    return new Promise(() => {
      const newValue = partyLoginDataIterator.next().value as [
        string,
        IPartyLoginData
      ];
      setPartyLoggingIn(newValue[1]);
    });
  }

  function handleNewPartyLoginData(data: IPartyLoginData) {
    let newData = new Map(partyLoginData);
    newData.set(data.party, data);
    setPartyLoginData(newData);
  }
};

const LoginPartyRow = (props: {
  party: PartyDetails;
  partyLoggingIn?: IPartyLoginData;
  onLoginStart: () => void;
  onLoginComplete: () => void;
  updateAllPartiesLoginData: (data: IPartyLoginData) => void;
}) => {
  const {
    party,
    partyLoggingIn,
    updateAllPartiesLoginData,
    onLoginStart,
    onLoginComplete,
  } = props;

  const [
    currentPartyLoginData,
    setCurrentPartyLoginData,
  ] = useState<IPartyLoginData>({
    ...party,
    role: "",
    name: party.partyName,
    location: "NYC",
  });

  const hasSelectedRole = currentPartyLoginData.role !== "";
  const isLoggingIn = party.party === partyLoggingIn?.party;

  useEffect(() => {
    if (hasSelectedRole) {
      updateAllPartiesLoginData(currentPartyLoginData);
    }
  }, [currentPartyLoginData]);

  useEffect(() => {
    if (isLoggingIn) {
      onLoginStart();
    }
  }, [partyLoggingIn]);

  return (
    <Table.Row>
      <Table.Cell>{party.partyName}</Table.Cell>
      <Table.Cell>
        <Form.Select
          placeholder="Select..."
          onChange={(_, data: any) =>
            setCurrentPartyLoginData({
              ...currentPartyLoginData,
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
          value={currentPartyLoginData.name}
          placeholder="name"
          disabled={!hasSelectedRole}
          onChange={(e) =>
            setCurrentPartyLoginData({
              ...currentPartyLoginData,
              name: e.currentTarget.value,
            })
          }
        />
      </Table.Cell>
      <Table.Cell>
        <Form.Input
          value={currentPartyLoginData.location}
          placeholder="location"
          disabled={!hasSelectedRole}
          onChange={(e) =>
            setCurrentPartyLoginData({
              ...currentPartyLoginData,
              location: e.currentTarget.value,
            })
          }
        />
      </Table.Cell>
      <Table.Cell>
        {isLoggingIn && partyLoggingIn && (
          <DamlLedger
            reconnectThreshold={0}
            token={partyLoggingIn.token}
            party={partyLoggingIn.party}
            httpBaseUrl={httpBaseUrl}
          >
            <WellKnownPartiesProvider>
              <SinglePartyOnboard
                data={partyLoggingIn}
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
  onLoginComplete: () => void;
}) => {
  const { data, onLoginComplete } = props;
  const operator = useOperator();

  const [loginStatus, setLoginStatus] = useState<loginStatusEnum>(
    loginStatusEnum.LOGGING_IN
  );
  const ledger = useLedger();
  const hi =  onboardParty()
  if (!!onboardParty) {
    hangleLoginComplete(true)
  } else {
    hangleLoginComplete(false)
  }
  // onboardParty()
  //   .then(() => hangleLoginComplete(true))
  //   .catch(() => hangleLoginComplete(false));

  return <div>{loginStatus}</div>;

  function hangleLoginComplete(success: boolean) {
    if (success) {
      setLoginStatus(loginStatusEnum.DONE);
    } else {
      setLoginStatus(loginStatusEnum.LOGIN_FAILED);
    }
    onLoginComplete();
  }

  function onboardParty() {
    switch (data.role) {
      case MarketRole.InvestorRole:
        setLoginStatus(loginStatusEnum.ONBOARDING_INVESTOR);
        return onboardInvestor(operator, ledger, data);

      case MarketRole.IssuerRole:
        setLoginStatus(loginStatusEnum.ONBOARDING_ISSUER);
        return onboardIssuer(operator, ledger, data);
      case MarketRole.BrokerRole:
        setLoginStatus(loginStatusEnum.ONBOARDING_BROKER);
        return onboardBroker(operator, ledger, data);

      case MarketRole.ExchangeRole:
        setLoginStatus(loginStatusEnum.ONBOARDING_EXCHANGE);
        return onboardExchange(operator, ledger, data);

      // case MarketRole.CustodianRole:
      //   setLoginStatus(loginStatusEnum.ONBOARDING_CUSTODIAN);
      //   return onboardCustodian(operator, ledger, data);

      // case MarketRole.CCPRole:
      //   setLoginStatus(loginStatusEnum.ONBOARDING_CCP);
      //   return onboardCCP(operator, ledger, data);
    }
  }
};

async function onboardInvestor(
  operator: string,
  ledger: Ledger,
  data: IPartyLoginData
) {
  const key = wrapDamlTuple([operator, data.party]);

  const args = {
    name: data.name,
    location: data.location,
    isPublic: true,
  };
  await ledger
    .exerciseByKey(InvestorInvitation.InvestorInvitation_Accept, key, args)
    .catch((err) => console.error(err));
}

async function onboardIssuer(
  operator: string,
  ledger: Ledger,
  data: IPartyLoginData
) {
  const key = wrapDamlTuple([operator, data.party]);
  const args = {
    name: data.name,
    location: data.location,
    title: data.title || "NONE",
    issuerID: data.issuerId || "NONE",
  };
  await ledger
    .exerciseByKey(IssuerInvitation.IssuerInvitation_Accept, key, args)
    .catch((err) => console.error(err));
}

async function onboardBroker(
  operator: string,
  ledger: Ledger,
  data: IPartyLoginData
) {
  //   if (deploymentMode == DeploymentMode.PROD_DABL && TRIGGER_HASH && token) {
  //     deployTrigger(TRIGGER_HASH, MarketplaceTrigger.BrokerTrigger, token, publicParty);
  // }
  const key = wrapDamlTuple([operator, data.party]);
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
  data: IPartyLoginData
) {
  //   if (deploymentMode == DeploymentMode.PROD_DABL && TRIGGER_HASH && token) {
  //     deployTrigger(TRIGGER_HASH, MarketplaceTrigger.ExchangeTrigger, token, publicParty);
  //     if (deployMatchingEngine) {
  //         deployTrigger(TRIGGER_HASH, MarketplaceTrigger.MatchingEngine, token, publicParty);
  //     }
  // }
  const key = wrapDamlTuple([operator, data.party]);
  const args = {
    name: data.name,
    location: data.location,
  };
  await ledger
    .exerciseByKey(ExchangeInvitation.ExchangeInvitation_Accept, key, args)
    .catch((err) => console.error(err));
}

// async function onboardCustodian(
//   operator: string,
//   ledger: Ledger,
//   data: IPartyLoginData
// ) {
//   //   if (deploymentMode == DeploymentMode.PROD_DABL && TRIGGER_HASH && token) {
//   //     deployTrigger(TRIGGER_HASH, MarketplaceTrigger.CustodianTrigger, token, publicParty);
//   // }
//   const key = wrapDamlTuple([operator, data.party]);
//   const args = {
//     name: data.name,
//     location: data.location,
//   };
//   await ledger
//     .exerciseByKey(CustodianInvitation.CustodianInvitation_Accept, key, args)
//     .catch((err) => console.error(err));
// }

// async function onboardCCP(
//   operator: string,
//   ledger: Ledger,
//   data: IPartyLoginData
// ) {
//   //   if (deploymentMode == DeploymentMode.PROD_DABL && TRIGGER_HASH && token) {
//   //     deployTrigger(TRIGGER_HASH, MarketplaceTrigger.CCPTrigger, token, publicParty);
//   // }
//   // if (inviteCustodian === '') {
//   //     throw new Error('You must select a default custodian!');
//   // }
//   const key = wrapDamlTuple([operator, data.party]);
//   const args = {
//     name: data.name,
//     location: data.location,
//     custodian: inviteCustodian,
//   };
//   await ledger
//     .exerciseByKey(CCPInvitation.CCPInvitation_Accept, key, args)
//     .catch((err) => console.error(err));
// }
export default QuickSetup;
