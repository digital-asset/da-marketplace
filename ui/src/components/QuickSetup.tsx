import React, { useEffect, useState } from "react";

import { DablPartiesInput, PartyDetails } from "@daml/hub-react";

import { MarketRole } from "@daml.js/da-marketplace/lib/Marketplace/Utils";

import { Table, Form, TableRow, DropdownItemProps } from "semantic-ui-react";
import Credentials, { computeCredentials } from '../Credentials'

import RoleCaptionEnum from "./RoleSelectScreen";

type IPartyLoginData = {
  party: PartyDetails;
  selectedRole: string;
};

const MARKETROLES = [
  "Custodian",
  "Issuer",
  "Exchange",
  "Investor",
  "Broker",
  "CCP",
];

const QuickSetup = (props: {
    parties: PartyDetails[],
    onLogin: (credentials: Credentials) => void;
}) => {
  const { parties, onLogin } = props;

  const [partyLoginData, setPartyLoginData] = useState(new Map());

  useEffect(() => {
    const newMap: Map<string, IPartyLoginData> = parties.reduce(
      (accum, party) => accum.set(party.party, { party: party, role: "" }),
      new Map()
    );
    setPartyLoginData(newMap);
    console.log('created map', newMap)
  }, [parties]);

  const options: DropdownItemProps[] = MARKETROLES.map((role) => {
    return { text: role, value: role };
  });
  return (
    <Table>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Party</Table.HeaderCell>
          <Table.HeaderCell>Role</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {props.parties.map(party => (
          <Table.Row>
            <Table.Cell>{party.partyName}</Table.Cell>
            <Table.Cell>
              <Form.Select
                onChange={(_, data: any) =>
                  updatePartyLoginData(data.value, party.party)
                }
                options={options}
              />
            </Table.Cell>
            <Table.Cell>
                
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );

  function updatePartyLoginData(role: string, partyId: string) {
    const newMap = new Map(partyLoginData);
    const newEntry = partyLoginData.get(partyId);
    newMap.set(partyId, {
      party: newEntry.party,
      role: role
    });
    setPartyLoginData(newMap);
    console.log('updated map', newMap)
    console.log(newMap);
  }
};

export default QuickSetup;
