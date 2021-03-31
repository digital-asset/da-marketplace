import React, { useEffect, useState } from "react"
import { Form, Button, Grid, Loader, Table } from "semantic-ui-react"
import { useHistory } from "react-router-dom"

import DamlLedger, { useLedger, useParty } from "@daml/react"

import Ledger from "@daml/ledger"

import { PartyDetails, WellKnownPartiesProvider } from "@daml/hub-react"
import { retrieveParties } from "../Parties"

import { BrokerInvitation } from "@daml.js/da-marketplace/lib/Marketplace/Broker"
import { CustodianInvitation } from "@daml.js/da-marketplace/lib/Marketplace/Custodian"
import { ExchangeInvitation } from "@daml.js/da-marketplace/lib/Marketplace/Exchange"
import { InvestorInvitation } from "@daml.js/da-marketplace/lib/Marketplace/Investor"
import { IssuerInvitation } from "@daml.js/da-marketplace/lib/Marketplace/Issuer"
import { CCPInvitation } from "@daml.js/da-marketplace/lib/Marketplace/CentralCounterparty"
import { RegisteredCustodian } from "@daml.js/da-marketplace/lib/Marketplace/Registry"
import { MarketRole } from "@daml.js/da-marketplace/lib/Marketplace/Utils"

import { UserSession } from "@daml.js/da-marketplace/lib/Marketplace/Onboarding"
import { User } from "@daml.js/da-marketplace/lib/Marketplace/Onboarding"

import { RegistryLookupProvider, useRegistryLookup } from "./common/RegistryLookup"
import { halfSecondPromise } from "./common/utils"
import { roleLabel } from "./common/utils"

import QueryStreamProvider, {
    useContractQuery,
    useLoading,
    AS_PUBLIC,
} from "../websocket/queryStream"

import { useDablParties, useOperator } from "../components/common/common"

import Credentials, { retrieveCredentials } from "../Credentials"

import { httpBaseUrl, deploymentMode, DeploymentMode } from "../config"

import deployTrigger, { TRIGGER_HASH, MarketplaceTrigger } from "../../src/automation"

interface IPartyLoginData extends PartyDetails {
    role: MarketRole
    name: string
    location: string
    title?: string
    issuerId?: string
    deployMatchingEngine?: boolean
    inviteCustodian?: string
}

const PUBLIC_PARTY_NAME = "Public"

const QuickSetup = (props: { onLogin: (credentials?: Credentials) => void }) => {
    const { onLogin } = props

    const history = useHistory()

    const [credentials, setCredentials] = useState<Credentials | undefined>()
    const [parties, setParties] = useState<PartyDetails[]>([])
    const [publicParty, setPublicParty] = useState<PartyDetails>()
    const [selectedParty, setSelectedParty] = useState<PartyDetails>()
    const [selectedRole, setSelectedRole] = useState<MarketRole>()
    const [successMessage, setSuccessMessage] = useState<string>()

    useEffect(() => {
        const parties = retrieveParties()
        if (parties) {
            setParties(parties)
            setPublicParty(parties.find(p => p.partyName === PUBLIC_PARTY_NAME))
        }
    }, [])

    const partyOptions =
        parties.map(party => {
            return { text: party.partyName, value: party.party }
        }) || []

    const roleOptions = MarketRole.keys.map(role => {
        return { text: role, value: role }
    })

    const partySelect = (
        <Form.Select
            label={<p className='dark input-label'>Party</p>}
            value={
                selectedParty ? partyOptions.find(p => selectedParty.party === p.value)?.value : ""
            }
            placeholder='Select...'
            onChange={(_, data: any) => handleChangeParty(data.value)}
            options={partyOptions}
        />
    )

    const roleSelect = (
        <Form.Select
            disabled={!selectedParty}
            value={selectedRole ? roleOptions.find(p => selectedRole === p.value)?.value : ""}
            label={<p className='dark input-label'>Role</p>}
            placeholder='Select...'
            onChange={(_, data: any) => setSelectedRole(data.value)}
            options={roleOptions}
        />
    )

    return (
        <div className='quick-setup'>
            <Button
                icon='left arrow'
                className='back-button ghost dark'
                onClick={() => history.push("/")}
            />
            <div className='quick-setup-tiles'>
                <div className='assign-role-tile'>
                    <p className='login-details dark'>Assign a Role</p>
                    <Grid>
                        <Grid.Row>
                            <Grid.Column width={8}>{partySelect}</Grid.Column>
                            <Grid.Column width={8}>{roleSelect}</Grid.Column>
                        </Grid.Row>
                    </Grid>
                    {credentials && selectedRole && selectedParty ? (
                        <DamlLedger
                            reconnectThreshold={0}
                            token={credentials.token}
                            party={credentials.party}
                            httpBaseUrl={httpBaseUrl}>
                            <WellKnownPartiesProvider>
                                <QueryStreamProvider>
                                    <RegistryLookupProvider>
                                        <RoleSetup
                                            selectedParty={selectedParty}
                                            selectedRole={selectedRole}
                                            clearPartyRoleSelect={clearPartyRoleSelect}
                                        />
                                    </RegistryLookupProvider>
                                </QueryStreamProvider>
                            </WellKnownPartiesProvider>
                        </DamlLedger>
                    ) : (
                        <Button
                            fluid
                            icon='right arrow'
                            labelPosition='right'
                            disabled={!selectedParty || !selectedRole}
                            className='ghost dark submit-button'
                            onClick={() => submitCredentials()}
                            content={<p className='dark bold'>Next</p>}
                        />
                    )}
                    {!!successMessage && <p className='dark'>{successMessage}</p>}
                </div>
                {publicParty ? (
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
                )}
            </div>
        </div>
    )

    async function submitCredentials() {
        if (!selectedParty) {
            return
        }

        const { ledgerId, party, token } = selectedParty

        onLogin({ ledgerId, party, token })

        const creds = await confirmCredentials(token)

        if (creds) {
            setCredentials(creds)
        } else {
            clearPartyRoleSelect("Error: invalid credentials")
        }
    }

    function handleChangeParty(newPartyId?: string) {
        const newParty = parties.find(p => p.party === newPartyId)
        if (!newParty) {
            return
        }
        setSelectedParty(newParty)
        setSelectedRole(undefined)
        setCredentials(undefined)
        setSuccessMessage(undefined)
        onLogin(undefined)
    }

    function clearPartyRoleSelect(message?: string) {
        setSuccessMessage(message)
        setSelectedParty(undefined)
        setSelectedRole(undefined)
        setCredentials(undefined)
    }

    async function confirmCredentials(token: string): Promise<Credentials | undefined> {
        let attempts = 0
        const MAX_ATTEMPTS = 3

        while (attempts < MAX_ATTEMPTS) {
            const creds = retrieveCredentials()
            if (creds && creds.token === token) {
                return creds
            } else {
                await halfSecondPromise()
                attempts += 1
            }
        }
        return undefined
    }
}

const PartyRegistry = (props: { parties: PartyDetails[] }) => {
    const { parties } = props

    const registry = useRegistryLookup()

    const [registryData, setRegistryData] = useState<Map<string, string[]>>(new Map())

    useEffect(() => {
        if (parties.length > 0) {
            let partyRegistryMap = new Map<string, string[]>()

            parties.forEach(p => {
                let roles = []

                if (!!registry.investorMap.get(p.party)) {
                    roles.push("Investor")
                }
                if (!!registry.issuerMap.get(p.party)) {
                    roles.push("Issuer")
                }
                if (!!registry.brokerMap.get(p.party)) {
                    roles.push("Broker")
                }
                if (!!registry.custodianMap.get(p.party)) {
                    roles.push("Custodian")
                }
                if (!!registry.exchangeMap.get(p.party)) {
                    roles.push("Exchange")
                }
                if (!!registry.ccpMap.get(p.party)) {
                    roles.push("CCP")
                }
                if (roles.length > 0) {
                    partyRegistryMap.set(p.party, roles)
                }
            })

            setRegistryData(partyRegistryMap)
        }
    }, [registry, parties])

    return (
        <div className='party-registry-tile'>
            <p className='login-details dark'>Market Setup</p>

            <Table className='party-registry-table' fixed>
                <Table.Header>
                    <Table.HeaderCell>Party</Table.HeaderCell>
                    <Table.HeaderCell>Role</Table.HeaderCell>
                </Table.Header>
                <Table.Body>
                    {parties.map((p, index) => (
                        <RegistryTableRow
                            index={index}
                            party={p}
                            roles={registryData.get(p.party) || []}
                        />
                    ))}
                </Table.Body>
            </Table>
        </div>
    )
}

const RegistryTableRow = (props: { index: number; party: PartyDetails; roles: string[] }) => {
    const { index, party, roles } = props
    const rowClassname = index % 2 === 0 ? "odd-row" : ""
    const partyName = <p className='bold'>{party.partyName}</p>

    if (roles.length === 0) {
        return (
            <Table.Row className={rowClassname}>
                <Table.Cell colSpan={3}>{partyName}</Table.Cell>
            </Table.Row>
        )
    }

    return (
        <>
            {roles.map((role, roleIndex) => (
                <Table.Row className={rowClassname}>
                    <Table.Cell>{roleIndex == 0 ? partyName : ""}</Table.Cell>
                    <Table.Cell>{role}</Table.Cell>
                </Table.Row>
            ))}
        </>
    )
}

const RoleSetup = (props: {
    selectedParty: PartyDetails
    selectedRole: MarketRole
    clearPartyRoleSelect: (message: string) => void
}) => {
    const { selectedParty, selectedRole, clearPartyRoleSelect } = props

    const user = useParty()
    const ledger = useLedger()
    const wsLoading = useLoading()
    const operator = useOperator()
    const registry = useRegistryLookup()

    const { loading, error } = useDablParties()

    const userSessions = useContractQuery(UserSession)
    const userContracts = useContractQuery(User)

    const [currentRole, setCurrentRole] = useState<MarketRole>()

    useEffect(() => {
        const createUserSession = async () => {
            const role = selectedRole
            await ledger.create(UserSession, { user, role, operator })
        }
        if (!wsLoading && !loading && userSessions.length === 0 && userContracts.length === 0) {
            createUserSession()
        }
    }, [loading, wsLoading])

    useEffect(() => {
        const role = userContracts[0]?.contractData?.currentRole
        if (role != selectedRole) {
            const changeRole = async () => {
                const key = { _1: operator, _2: user }
                const args = { newRole: selectedRole }

                await ledger
                    .exerciseByKey(User.User_RequestRoleChange, key, args)
                    .then(_ => setCurrentRole(selectedRole))
            }

            changeRole()
        } else {
            setCurrentRole(role)
        }
    }, [userContracts, selectedRole])

    if (loading || wsLoading) {
        return (
            <Loader active indeterminate inverted size='small'>
                <p className='dark'>Loading contracts and parties...</p>
            </Loader>
        )
    }

    if (error) {
        return <p className='dark login-details'>Error: {error}</p>
    }

    if (findRegisteredParty()) {
        return (
            <p className='dark login-details'>
                {selectedParty.partyName} is already assigned the role of {roleLabel(selectedRole)}.
            </p>
        )
    } else if (currentRole) {
        if (currentRole === selectedRole) {
            return (
                <InviteAccept
                    party={selectedParty}
                    role={selectedRole}
                    clearPartyRoleSelect={clearPartyRoleSelect}
                />
            )
        }
    }

    return (
        <Loader active indeterminate inverted size='small'>
            <p className='dark login-details'>Loading role contract...</p>
        </Loader>
    )

    function findRegisteredParty() {
        const party = selectedParty.party
        switch (selectedRole) {
            case MarketRole.InvestorRole:
                return !!registry.investorMap.get(party)

            case MarketRole.IssuerRole:
                return !!registry.issuerMap.get(party)

            case MarketRole.BrokerRole:
                return !!registry.brokerMap.get(party)

            case MarketRole.ExchangeRole:
                return !!registry.exchangeMap.get(party)

            case MarketRole.CustodianRole:
                return !!registry.custodianMap.get(party)

            case MarketRole.CCPRole:
                return !!registry.ccpMap.get(party)

            default:
                return false
        }
    }
}

const InviteAccept = (props: {
    party: PartyDetails
    role: MarketRole
    clearPartyRoleSelect: (message: string) => void
}) => {
    const { party, role, clearPartyRoleSelect } = props

    const ledger = useLedger()
    const publicParty = useDablParties().parties.publicParty
    const operator = useDablParties().parties.userAdminParty

    const custodianInvites = useContractQuery(CustodianInvitation)
    const issuerInvites = useContractQuery(IssuerInvitation)
    const investorInvites = useContractQuery(InvestorInvitation)
    const exchangeInvites = useContractQuery(ExchangeInvitation)
    const brokerInvites = useContractQuery(BrokerInvitation)
    const ccpInvites = useContractQuery(CCPInvitation)

    const [loginStatus, setLoginStatus] = useState<string>()
    const [partyLoggingIn, setPartyLoggingIn] = useState<boolean>(false)

    const [partyLoginData, setPartyLoginData] = useState<IPartyLoginData>({
        ...party,
        role: role,
        name: party.partyName,
        location: "NYC",
        deployMatchingEngine: true,
    })

    const custodianOptions = useContractQuery(RegisteredCustodian, AS_PUBLIC).map(d => {
        return {
            text: `${d.contractData.name}`,
            value: d.contractData.custodian,
        }
    })

    if (partyLoginData.role === MarketRole.CCPRole && custodianOptions.length === 0) {
        return <p className='dark login-status'>You must onboard a custodian before the CCP.</p>
    }

    if (partyLoggingIn) {
        return (
            <p className='dark login-status'>
                {loginStatus &&
                    (loginStatus === "done" ? (
                        loginStatus
                    ) : (
                        <Loader active indeterminate inverted size='small'>
                            {loginStatus}
                        </Loader>
                    ))}
            </p>
        )
    }

    return (
        <>
            <p className='dark login-details'>Please fill in some information about this role:</p>
            <Grid>
                <Grid.Row>
                    <Grid.Column width={8}>
                        <Form.Input
                            label={<p className='input-label dark'>Name</p>}
                            value={partyLoginData.name}
                            onChange={e =>
                                setPartyLoginData({
                                    ...partyLoginData,
                                    name: e.currentTarget.value,
                                })
                            }
                        />
                    </Grid.Column>
                    <Grid.Column width={8}>
                        <Form.Input
                            label={<p className='input-label dark'>Location</p>}
                            value={partyLoginData.location}
                            onChange={e =>
                                setPartyLoginData({
                                    ...partyLoginData,
                                    location: e.currentTarget.value,
                                })
                            }
                        />
                    </Grid.Column>
                </Grid.Row>

                {partyLoginData.role === MarketRole.IssuerRole && (
                    <Grid.Row>
                        <Grid.Column width={8}>
                            <Form.Input
                                label={<p className='input-label dark'>Title</p>}
                                value={partyLoginData.title}
                                placeholder='title'
                                onChange={e =>
                                    setPartyLoginData({
                                        ...partyLoginData,
                                        title: e.currentTarget.value,
                                    })
                                }
                            />
                        </Grid.Column>
                        <Grid.Column width={8}>
                            <Form.Input
                                label={<p className='input-label dark'>Issuer Id</p>}
                                value={partyLoginData.issuerId}
                                placeholder='Issuer Id'
                                onChange={e =>
                                    setPartyLoginData({
                                        ...partyLoginData,
                                        issuerId: e.currentTarget.value,
                                    })
                                }
                            />
                        </Grid.Column>
                    </Grid.Row>
                )}
                {partyLoginData.role === MarketRole.ExchangeRole && (
                    <Grid.Row>
                        <Grid.Column width={16}>
                            <Form.Checkbox
                                defaultChecked
                                label={
                                    <label>
                                        <p className='dark'>
                                            Deploy matching engine {<br />} (uncheck if you plan to
                                            use the Exberry Integration)
                                        </p>
                                    </label>
                                }
                                onChange={event =>
                                    setPartyLoginData({
                                        ...partyLoginData,
                                        deployMatchingEngine: !partyLoginData.deployMatchingEngine,
                                    })
                                }
                            />
                        </Grid.Column>
                    </Grid.Row>
                )}
                {partyLoginData.role === MarketRole.CCPRole && (
                    <Grid.Row>
                        <Grid.Column width={8}>
                            <Form.Select
                                label={
                                    <p className='input-label dark'>
                                        Margin/Clearing Account Custodian
                                    </p>
                                }
                                multiple={false}
                                disabled={custodianOptions.length === 0}
                                placeholder='Select...'
                                options={custodianOptions}
                                onChange={(_, data: any) =>
                                    setPartyLoginData({
                                        ...partyLoginData,
                                        inviteCustodian: data.value,
                                    })
                                }
                            />
                        </Grid.Column>
                    </Grid.Row>
                )}
            </Grid>
            <Button
                fluid
                icon='right arrow'
                labelPosition='right'
                disabled={!partyLoginData}
                className='ghost dark submit-button'
                onClick={() => setupRole()}
                content={<p className='dark bold'>Submit role</p>}
            />
        </>
    )

    function getRoleInvitation(role: MarketRole) {
        let attempts = 0
        const MAX_ATTEMPTS = 3

        while (attempts < MAX_ATTEMPTS) {
            if (role === MarketRole.InvestorRole) {
                return !!investorInvites[0]
            } else if (role === MarketRole.IssuerRole) {
                return !!issuerInvites[0]
            } else if (role === MarketRole.BrokerRole) {
                return !!brokerInvites[0]
            } else if (role === MarketRole.ExchangeRole) {
                return !!exchangeInvites[0]
            } else if (role === MarketRole.CustodianRole) {
                return !!custodianInvites[0]
            } else if (role === MarketRole.CCPRole) {
                return !!ccpInvites[0]
            } else {
                attempts += 1
            }
        }
        return false
    }

    async function handleSetLoginStatus(status: string) {
        await halfSecondPromise()
        setLoginStatus(status)
    }

    async function setupRole() {
        setPartyLoggingIn(true)

        if (!getRoleInvitation(role)) {
            handleSetLoginStatus(`Error: could not find ${roleLabel(role)}Invitation contract`)
            setPartyLoggingIn(false)
        } else {
            handleSetLoginStatus(`Onboarding ${roleLabel(role)}...`)

            onboardParty(role, partyLoginData, ledger, publicParty, operator)
                .then(_ => {
                    clearPartyRoleSelect(`Success!`)
                })
                .catch(_ => {
                    handleSetLoginStatus(`Error: could not onboard ${roleLabel(role)}`)
                })
        }
    }
}

async function onboardParty(
    role: MarketRole,
    data: IPartyLoginData,
    ledger: Ledger,
    publicParty: string,
    operator: string
) {
    const key = { _1: operator, _2: data.party }
    let args = {
        name: data.name,
        location: data.location,
    }

    switch (role) {
        case MarketRole.BrokerRole:
            if (deploymentMode == DeploymentMode.PROD_DABL && TRIGGER_HASH && data.token) {
                deployTrigger(
                    TRIGGER_HASH,
                    MarketplaceTrigger.BrokerTrigger,
                    data.token,
                    publicParty
                )
            }

            await ledger
                .exerciseByKey(BrokerInvitation.BrokerInvitation_Accept, key, args)
                .catch(err => console.error(err))
            break

        case MarketRole.ExchangeRole:
            if (deploymentMode == DeploymentMode.PROD_DABL && TRIGGER_HASH && data.token) {
                deployTrigger(
                    TRIGGER_HASH,
                    MarketplaceTrigger.ExchangeTrigger,
                    data.token,
                    publicParty
                )
                if (!!data.deployMatchingEngine) {
                    deployTrigger(
                        TRIGGER_HASH,
                        MarketplaceTrigger.MatchingEngine,
                        data.token,
                        publicParty
                    )
                }
            }

            await ledger
                .exerciseByKey(ExchangeInvitation.ExchangeInvitation_Accept, key, args)
                .catch(err => console.error(err))
            break

        case MarketRole.CustodianRole:
            if (deploymentMode == DeploymentMode.PROD_DABL && TRIGGER_HASH && data.token) {
                deployTrigger(
                    TRIGGER_HASH,
                    MarketplaceTrigger.CustodianTrigger,
                    data.token,
                    publicParty
                )
            }

            await ledger
                .exerciseByKey(CustodianInvitation.CustodianInvitation_Accept, key, args)
                .catch(err => console.error(err))
            break

        case MarketRole.InvestorRole:
            await ledger
                .exerciseByKey(InvestorInvitation.InvestorInvitation_Accept, key, {
                    ...args,
                    isPublic: true,
                })
                .catch(err => console.error(err))
            break

        case MarketRole.IssuerRole:
            await ledger
                .exerciseByKey(IssuerInvitation.IssuerInvitation_Accept, key, {
                    ...args,
                    title: data.title || "",
                    issuerID: data.issuerId || "",
                })
                .catch(err => console.error(err))
            break
        case MarketRole.CCPRole:
            if (deploymentMode == DeploymentMode.PROD_DABL && TRIGGER_HASH && data.token) {
                deployTrigger(TRIGGER_HASH, MarketplaceTrigger.CCPTrigger, data.token, publicParty)
            }
            if (!data.inviteCustodian) {
                throw new Error("You must select a default custodian!")
            }

            await ledger
                .exerciseByKey(CCPInvitation.CCPInvitation_Accept, key, {
                    ...args,
                    custodian: data.inviteCustodian,
                })
                .catch(err => console.error(err))
    }
}

export default QuickSetup
