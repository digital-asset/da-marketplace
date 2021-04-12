import React, { useEffect, useState } from 'react';
import { Form, Button, Grid, Loader, Table } from 'semantic-ui-react';
import { useHistory } from 'react-router-dom';

import DamlLedger, { useLedger, useParty } from '@daml/react';

import Ledger from '@daml/ledger';

import { PartyDetails, WellKnownPartiesProvider } from '@daml/hub-react';
import { retrieveParties } from '../../Parties';
import { useUserState } from '../../context/UserContext';
import { DeploymentMode, deploymentMode, ledgerId, dablHostname } from '../../config';

import Credentials, { retrieveCredentials, computeCredentials } from '../../Credentials';
import { quickSetuploginUser, useUserDispatch } from '../../context/UserContext';
import {
    ServiceKind,
    ServiceRequest,
    ServiceRequestTemplates,
    useCustomerServices,
    useProviderServices,
  } from '../../context/ServicesContext';

const QuickSetup = (props: { onLogin: (credentials: Credentials) => void }) => {
  const { onLogin } = props;

  const history = useHistory();
  const userDispatch = useUserDispatch();

  const [credentials, setCredentials] = useState<Credentials | undefined>();
  const [parties, setParties] = useState<PartyDetails[]>([]);
  const [selectedParty, setSelectedParty] = useState<PartyDetails>();
  const [successMessage, setSuccessMessage] = useState<string>();
  const [username, setUsername] = useState('');

  const user = useUserState();

  useEffect(() => {
    const parties = retrieveParties();
    if (parties) {
      setParties(parties);
    }
  }, []);

  const partyOptions =
    parties.map(party => {
      return { text: party.partyName, value: party.party };
    }) || [];

  let partySelect = (
    <Form.Select
      label={<p className="dark input-label">Party</p>}
      value={selectedParty ? partyOptions.find(p => selectedParty.party === p.value)?.value : ''}
      placeholder="Select..."
      onChange={(_, data: any) => handleChangeParty(data.value)}
      options={partyOptions}
    />
  );

  if (deploymentMode != DeploymentMode.PROD_DABL) {
    partySelect = (
      <Form.Input
        required
        placeholder="Username"
        value={username}
        onChange={e => setUsername(e.currentTarget.value)}
      />
    );
  }

  return (
    <div className="quick-setup">
      <Button
        icon="left arrow"
        className="back-button ghost dark"
        onClick={() => history.push('/')}
      />
      <div className="quick-setup-tiles">
        <div className="assign-role-tile">
          <p className="login-details dark">Assign a Role</p>
          <Grid>
            <Grid.Row>
              <Grid.Column width={8}>{partySelect}</Grid.Column>
            </Grid.Row>
          </Grid>
          {credentials && (deploymentMode === DeploymentMode.PROD_DABL ? selectedParty : username) ? (
            <ServiceSetup
              clearPartyRoleSelect={clearPartyRoleSelect}
            />
          ) : (
            <Button
              fluid
              icon="right arrow"
              labelPosition="right"
              disabled={deploymentMode === DeploymentMode.PROD_DABL ? !selectedParty : !username}
              className="ghost dark submit-button"
              onClick={() => submitCredentials()}
              content={<p className="dark bold">Next</p>}
            />
          )}
          {!!successMessage && <p className="dark">{successMessage}</p>}
        </div>
        {/* {publicParty ? (
                    <DamlLedger
                        reconnectThreshold={0}
                        token={publicParty.token}
                        party={publicParty.party}
                        httpBaseUrl={httpBaseUrl}>
                        <WellKnownPartiesProvider>
                            <QueryStreamProvider>
                                <RegistryLookupProvider>
                                    <PartyRegistry parties={parties} />
                                </RegistryLookupProvider>
                            </QueryStreamProvider>
                        </WellKnownPartiesProvider>
                    </DamlLedger>
                ) : (
                    <Loader active indeterminate inverted size='small'>
                        <p>Loading registry table...</p>
                    </Loader>
                )} */}
      </div>
    </div>
  );

  async function submitCredentials() {
    let creds;
    if (deploymentMode === DeploymentMode.PROD_DABL) {
      if (!selectedParty) {
        return;
      }
      const { ledgerId, party, token } = selectedParty;
      quickSetuploginUser(userDispatch, { token, party, ledgerId });
      creds = await confirmCredentials(token);
    } else {
      const credentials = computeCredentials(username);
      quickSetuploginUser(userDispatch, credentials);
      creds = await confirmCredentials(credentials.token);
    }

    if (creds) {
      setCredentials(creds);
    } else {
      clearPartyRoleSelect('Error: invalid credentials');
    }
  }

  function handleChangeParty(newPartyId?: string) {
    const newParty = parties.find(p => p.party === newPartyId);
    if (!newParty) {
      return;
    }
    setSelectedParty(newParty);
    setCredentials(undefined);
    setSuccessMessage(undefined);
  }

  function clearPartyRoleSelect(message?: string) {
    setSuccessMessage(message);
    setSelectedParty(undefined);
    setCredentials(undefined);
  }

  async function confirmCredentials(token: string): Promise<Credentials | undefined> {
    let attempts = 0;
    const MAX_ATTEMPTS = 3;

    while (attempts < MAX_ATTEMPTS) {
      const creds = retrieveCredentials();
      if (creds && creds.token === token) {
        console.log(creds)
        return creds;
      } else {
        attempts += 1;
      }
    }
    return undefined;
  }
};

// const PartyRegistry = (props: { parties: PartyDetails[] }) => {
//     const { parties } = props

//     const registry = useRegistryLookup()

//     const [registryData, setRegistryData] = useState<Map<string, string[]>>(new Map())

//     useEffect(() => {
//         if (parties.length > 0) {
//             let partyRegistryMap = new Map<string, string[]>()

//             parties.forEach(p => {
//                 let roles = []

//                 if (!!registry.investorMap.get(p.party)) {
//                     roles.push("Investor")
//                 }
//                 if (!!registry.issuerMap.get(p.party)) {
//                     roles.push("Issuer")
//                 }
//                 if (!!registry.brokerMap.get(p.party)) {
//                     roles.push("Broker")
//                 }
//                 if (!!registry.custodianMap.get(p.party)) {
//                     roles.push("Custodian")
//                 }
//                 if (!!registry.exchangeMap.get(p.party)) {
//                     roles.push("Exchange")
//                 }
//                 if (!!registry.ccpMap.get(p.party)) {
//                     roles.push("CCP")
//                 }
//                 if (roles.length > 0) {
//                     partyRegistryMap.set(p.party, roles)
//                 }
//             })

//             setRegistryData(partyRegistryMap)
//         }
//     }, [registry, parties])

//     return (
//         <div className='party-registry-tile'>
//             <p className='login-details dark'>Market Setup</p>

//             <Table className='party-registry-table' fixed>
//                 <Table.Header>
//                     <Table.HeaderCell>Party</Table.HeaderCell>
//                     <Table.HeaderCell>Role</Table.HeaderCell>
//                 </Table.Header>
//                 <Table.Body>
//                     {parties.map((p, index) => (
//                         <RegistryTableRow
//                             index={index}
//                             party={p}
//                             roles={registryData.get(p.party) || []}
//                         />
//                     ))}
//                 </Table.Body>
//             </Table>
//         </div>
//     )
// }

// const RegistryTableRow = (props: { index: number; party: PartyDetails; roles: string[] }) => {
//     const { index, party, roles } = props
//     const rowClassname = index % 2 === 0 ? "odd-row" : ""
//     const partyName = <p className='bold'>{party.partyName}</p>

//     if (roles.length === 0) {
//         return (
//             <Table.Row className={rowClassname}>
//                 <Table.Cell colSpan={3}>{partyName}</Table.Cell>
//             </Table.Row>
//         )
//     }

//     return (
//         <>
//             {roles.map((role, roleIndex) => (
//                 <Table.Row className={rowClassname}>
//                     <Table.Cell>{roleIndex == 0 ? partyName : ""}</Table.Cell>
//                     <Table.Cell>{role}</Table.Cell>
//                 </Table.Row>
//             ))}
//         </>
//     )
// }

const ServiceSetup = (props: {
  clearPartyRoleSelect: (message: string) => void;
}) => {
  const { clearPartyRoleSelect } = props;

  const [currentService, setCurrentService] = useState();
  const [status, setStatus] = useState<string>();
  const party = useParty();
  const providers = useProviderServices(party);
  const customers = useCustomerServices(party)
  console.log(providers)
  const user = useUserState();

  const services = [
    'Custody',
    'Listing',
    'Distribution',
    'Trading',
    'Distributor Service',
  ];

  useEffect(() => {
    // create Operator.Service if it does not yet exist
  }, []);

  return (
    <div>
      <p className='dark'>Signed in as user: {user.name}</p>
      <Form.Select
        label={<p className="input-label dark">Pick a service</p>}
        multiple={false}
        placeholder="Select..."
        options={services.map(r => {
          return { text: r, value: r };
        })}
        onChange={(_, data: any) => setCurrentService(data.value)}
      />
      <Button
        disabled={!currentService}
        onClick={() => offerService(currentService)}
      >
        offer service
      </Button>
      {status}
    </div>
  );

  function offerService(selectedService?: string) {
    if (!selectedService) {
      setStatus('no service selected');
      return;
    }

    //given a role and provider party, exercise choice on Operator.Service contract
  }
};

export default QuickSetup;
