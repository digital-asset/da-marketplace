import React, { useEffect, useState } from "react";

import DamlLedger from "@daml/react";
import { WellKnownPartiesProvider } from "@daml/hub-react";

import { DablPartiesInput, PartyDetails } from "@daml/hub-react";

import { useHistory } from "react-router-dom";

import { MarketRole } from "@daml.js/da-marketplace/lib/Marketplace/Utils";
import { useLedger, useParty } from "@daml/react";
import { useOperator } from "../components/common/common";

import { Table, Form, Button, DropdownItemProps } from "semantic-ui-react";
import Credentials, { computeCredentials } from "../Credentials";
import InvestorProfile, {
  Profile,
  createField,
} from "../components/common/Profile";
import { wrapDamlTuple, unwrapDamlTuple } from "../components/common/damlTypes";
import {
  Investor as InvestorTemplate,
  InvestorInvitation,
} from "@daml.js/da-marketplace/lib/Marketplace/Investor";
import RoleCaptionEnum from "./RoleSelectScreen";
import { UserSession } from "@daml.js/da-marketplace/lib/Marketplace/Onboarding";
import { httpBaseUrl } from "../config";

import { roleRoute } from "../components/common/utils";

import { useContractQuery } from "../websocket/queryStream";
import { IconCheck } from "../icons/Icons";
import { Operator } from "@daml.js/da-marketplace/lib/Marketplace/Operator";

interface IPartyLoginData extends PartyDetails {
  role: string;
  name: string;
  location: string;
  title?: string;
  issuerId?: string;
  loginStatus: loginStatusEnum;
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
  NONE = "none",
  READY_TO_LOGIN = "ready to log in",
}

const QuickSetup = (props: {
  parties: PartyDetails[];
  onLogin: (credentials?: Credentials) => void;
  onRequestClose: () => void;
}) => {
  const { parties, onLogin, onRequestClose } = props;

  const history = useHistory();

  const [partyLoginData, setPartyLoginData] = useState<
    Map<string, IPartyLoginData>
  >(new Map());

  return (
    <div className="quick-setup">
      <Button
        icon="left arrow"
        className="ghost dark"
        onClick={() => onRequestClose()}
      />
      <p className="login-details dark">
        Select the roles you wish to onboard each party as:{" "}
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
              party={party}
              key={party.party}
              updateAllPartiesLoginData={handleNewPartyLoginData}
            />
          ))}
        </Table.Body>
      </Table>
      <Button onClick={() => handleLogin()}>Go!</Button>
    </div>
  );

  // sets credentials
  function loginParty(data: IPartyLoginData) {
    return new Promise(() => {
      const { ledgerId, party, token } = data;
      onLogin({ ledgerId, party, token });
    });
  }

  // clears credentials
  function logoutParty() {
    return new Promise(() => {
      onLogin(undefined);
    });
  }

  function onboardParty(data: IPartyLoginData) {
    console.log("f2");
    return new Promise((resolve, reject) => {
      history.push(roleRoute(data.role as MarketRole));
    });
  }

  function handleLogin() {
    return partyLoginData.forEach((data) => {
      handleLoginStatusChange(data.party, loginStatusEnum.LOGGING_IN);

      loginParty(data).then((_) => {
        return (
          <DamlLedger
            reconnectThreshold={0}
            token={data.token}
            party={data.party}
            httpBaseUrl={httpBaseUrl}
          >
            <WellKnownPartiesProvider>
              <SinglePartyOnboard data={data} />
            </WellKnownPartiesProvider>
          </DamlLedger>
        );
        // handleStatusChange(data.party, loginStatusEnum.ASSIGNING_ROLE);
        // onboardParty(data)
        //   .then((_) => null)
        //   .catch((_) =>
        //     handleStatusChange(
        //       data.party,
        //       loginStatusEnum.ASSIGNING_ROLE_FAILED
        //     )
        //   );
      })
      .catch((_) =>
        handleLoginStatusChange(data.party, loginStatusEnum.LOGIN_FAILED)
      )
    });
  }

  function handleLoginStatusChange(partyId: string, status: loginStatusEnum) {
    let newMap = new Map(partyLoginData)
    const entry = newMap.get(partyId)
    if (entry) {
      newMap.set(partyId, {
        ...entry,
        loginStatus: status
      })
      setPartyLoginData(newMap)
    }
  }


  // function handlePartyOnboarding() {
  //   return new Promise((resolve, reject) => {
  //     history.push(roleRoute(data.role as MarketRole));
  //   });
  // }

  function handleNewPartyLoginData(data: IPartyLoginData) {
    let newData = new Map(partyLoginData);
    newData.set(data.party, data);
    setPartyLoginData(newData);
    console.log(partyLoginData);
  }
};



const acceptInvite = async (props: { data: IPartyLoginData }) => {
  const operator = useOperator();
  const ledger = useLedger();

  let acceptInvite: any;
  const key = wrapDamlTuple([operator, props.data.party]);

  switch (props.data.role) {
    case MarketRole.InvestorRole:
      const args = {
        name: props.data.name,
        location: props.data.location,
        isPublic: true,
      };
      await ledger
        .exerciseByKey(InvestorInvitation.InvestorInvitation_Accept, key, args)
        .catch((err) => console.error(err));

      break;
    // case MarketRole.IssuerRole:

    //   break;
    // case MarketRole.BrokerRole:

    //   break;
    // case MarketRole.ExchangeRole:

    //   break;
    // case MarketRole.CustodianRole:
    //   break;
    // case MarketRole.CCPRole:
    //   break;
    // default:
  }

  acceptInvite();

  return null;
};

const LoginPartyRow = (props: {
  party: PartyDetails;
  updateAllPartiesLoginData: (data: IPartyLoginData) => void;
}) => {
  const { party, updateAllPartiesLoginData } = props;

  const [
    currentPartyLoginData,
    setCurrentPartyLoginData,
  ] = useState<IPartyLoginData>({
    ...party,
    role: "",
    name: party.partyName,
    location: "NYC",
    loginStatus: loginStatusEnum.NONE
  });

  const hasSelectedRole = currentPartyLoginData.role !== "";

  useEffect(() => {
    if (hasSelectedRole) {
      updatePartyLoginLoginStatus(loginStatusEnum.READY_TO_LOGIN);
    }
    updateAllPartiesLoginData(currentPartyLoginData);
  }, [currentPartyLoginData]);

  return (
    <Table.Row>
      <Table.Cell>{party.partyName}</Table.Cell>
      <Table.Cell>
        <Form.Select
          placeholder="Select..."
          onChange={(_, data: any) => updatePartyLoginRole(data.value)}
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
          onChange={(e) => updatePartyLoginName(e.currentTarget.value)}
        />
      </Table.Cell>
      <Table.Cell>
        <Form.Input
          value={currentPartyLoginData.location}
          placeholder="location"
          disabled={!hasSelectedRole}
          onChange={(e) => updatePartyLoginLocation(e.currentTarget.value)}
        />
      </Table.Cell>
      <Table.Cell>{currentPartyLoginData.loginStatus}</Table.Cell>
    </Table.Row>
  );

  function updatePartyLoginName(name: string) {
    setCurrentPartyLoginData({ ...currentPartyLoginData, name: name });
  }
  function updatePartyLoginLocation(location: string) {
    setCurrentPartyLoginData({ ...currentPartyLoginData, location: location });
  }
  function updatePartyLoginRole(role: string) {
    setCurrentPartyLoginData({ ...currentPartyLoginData, role: role });
  }
  function updatePartyLoginLoginStatus(status: loginStatusEnum) {
    setCurrentPartyLoginData({ ...currentPartyLoginData, role: status });
  }
};

export default QuickSetup;
