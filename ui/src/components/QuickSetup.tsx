import React, { useEffect, useState } from "react"
import { Form, Button, Grid, Loader, Table } from "semantic-ui-react"
import { useHistory } from "react-router-dom"

import DamlLedger, { useLedger, useParty } from "@daml/react"

import Ledger from "@daml/ledger"
import { useWellKnownParties } from "@daml/hub-react/lib"

import { PartyDetails, WellKnownPartiesProvider } from "@daml/hub-react"
import { retrieveParties } from "../Parties"

import { BrokerInvitation } from "@daml.js/da-marketplace/lib/Marketplace/Broker"
import { CustodianInvitation } from "@daml.js/da-marketplace/lib/Marketplace/Custodian"
import { ExchangeInvitation } from "@daml.js/da-marketplace/lib/Marketplace/Exchange"
import { InvestorInvitation } from "@daml.js/da-marketplace/lib/Marketplace/Investor"
import { IssuerInvitation } from "@daml.js/da-marketplace/lib/Marketplace/Issuer"
import { MarketRole } from "@daml.js/da-marketplace/lib/Marketplace/Utils"
import { UserSession } from "@daml.js/da-marketplace/lib/Marketplace/Onboarding"
import { RegistryLookupProvider, RegistryLookup } from "./common/RegistryLookup"
import { IconInformation } from "../icons/Icons"
import {
    RegisteredExchange,
    RegisteredCustodian,
    RegisteredBroker,
    RegisteredIssuer,
    RegisteredInvestor,
    RegisteredCCP,
} from "@daml.js/da-marketplace/lib/Marketplace/Registry"

import { User } from "@daml.js/da-marketplace/lib/Marketplace/Onboarding"

import { halfSecondPromise } from "./common/utils"
import { roleLabel } from "./common/utils"

import QueryStreamProvider, {
    useContractQuery,
    usePartyLoading,
    useLoading,
} from "../websocket/queryStream"

import { useDablParties, useOperator } from "../components/common/common"

import Credentials, { retrieveCredentials } from "../Credentials"

import { httpBaseUrl, deploymentMode, DeploymentMode } from "../config"

import deployTrigger, { TRIGGER_HASH, MarketplaceTrigger } from "../../src/automation"
import { useRegistryLookup } from "./common/RegistryLookup"

interface IPartyLoginData extends PartyDetails {
    roles: MarketRole[]
    name: string
    location: string
    title?: string
    issuerId?: string
    deployMatchingEngine?: boolean
}

// get everything from the operator to see who has signed in
const MARKETROLES = ["CustodianRole", "IssuerRole", "ExchangeRole", "InvestorRole", "BrokerRole"]

const QuickSetup = (props: { onLogin: (credentials?: Credentials) => void }) => {
    const { onLogin } = props
    const history = useHistory()

    const [parties, setParties] = useState<PartyDetails[]>()
    const [loggedInPartyData, setLoggedInPartyData] = useState<IPartyLoginData[]>([])
    const [selectedParty, setSelectedParty] = useState<PartyDetails>()
    const [selectedRole, setSelectedRole] = useState<MarketRole>()
    const [credentials, setCredentials] = useState<Credentials | undefined>()

    useEffect(() => {
        const parties = retrieveParties()
        if (parties) {
            setParties(parties)
        }
    }, [])

    const partyOptions =
        parties?.map(party => {
            return { text: party.partyName, value: party.party }
        }) || []

    const roleOptions = MARKETROLES.map(role => {
        return { text: role, value: role }
    })

    const partySelect = (
        <Form.Select
            label={<p className='dark'>Party</p>}
            value={
                selectedParty ? partyOptions.find(p => selectedParty.party === p.value)?.value : ""
            }
            placeholder='Select...'
            onChange={(_, data: any) =>
                handleChangeParty(parties?.find(p => p.party === data.value))
            }
            options={partyOptions}
        />
    )

    const roleSelect = (
        <Form.Select
            disabled={!selectedParty}
            value={selectedRole ? roleOptions.find(p => selectedRole === p.value)?.value : ""}
            label={<p className='dark'>Role</p>}
            placeholder='Select...'
            onChange={(_, data: any) => setSelectedRole(data.value)}
            options={roleOptions}
        />
    )

    return (
        <div className='quick-setup'>
            <div className='quick-setup-tile'>
                <Button
                    icon='left arrow'
                    className='back-button ghost dark'
                    onClick={() => history.push("/")}
                />
                <div className='quick-setup-body'>
                    <div className='select-form'>
                        <p className='login-details dark'>Quick Setup</p>
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
                                                loggedInPartyData={loggedInPartyData}
                                                saveLoggedInParty={handleNewLoggedInParty}
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
                                className='ghost dark go-button'
                                onClick={() => submitCredentials()}
                                content={<p className='dark bold'>Go</p>}
                            />
                        )}
                    </div>

                    <LoggedInPartiesTable data={loggedInPartyData} />
                </div>
            </div>
        </div>
    )

    async function submitCredentials() {
        if (!selectedParty) {
            return
        }

        const { ledgerId, party, token } = selectedParty

        onLogin({ ledgerId, party, token })

        const creds = await confirmCredentials(3, token)

        if (creds) {
            console.log("confirmed credentials, showing DamlLedger")
            setCredentials(creds)
        }
    }

    async function handleChangeParty(newParty?: PartyDetails) {
        if (!newParty) {
            return
        }
        setSelectedParty(newParty)
        setSelectedRole(undefined)
        onLogin(undefined)
        setCredentials(undefined)
    }

    function clearPartyRoleSelect() {
        console.log("clearing roles")
        setSelectedParty(undefined)
        setSelectedRole(undefined)
        setCredentials(undefined)
    }

    async function confirmCredentials(retries: number, token: string): Promise<Credentials> {
        const creds = retrieveCredentials()

        if (creds && creds.token === token) {
            return creds
        }

        if (retries > 0) {
            await halfSecondPromise()
            return confirmCredentials(retries - 1, token)
        }

        throw new Error("Could not find credentials")
    }

    function handleNewLoggedInParty(data: IPartyLoginData) {
        const currentData = loggedInPartyData.find(d => d.party === data.party)

        if (currentData) {
            let newLoggedInPartyData = loggedInPartyData
            newLoggedInPartyData.splice(loggedInPartyData.indexOf(currentData), 1, data)
            setLoggedInPartyData(newLoggedInPartyData)
        } else {
            setLoggedInPartyData([...loggedInPartyData, data])
        }
    }
}

const LoggedInPartiesTable = (props: { data?: IPartyLoginData[] }) => {
    const { data } = props

    return (
        <div className='logged-in-parties-table-tile'>
            <Table basic className='logged-in-parties-table'>
                <Table.Header>
                    <Table.Row>
                        <Table.Cell>Party</Table.Cell>
                        <Table.Cell>Role</Table.Cell>
                        <Table.Cell>Name</Table.Cell>
                        <Table.Cell>Location</Table.Cell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {!data || data.length == 0 ? (
                        <Table.Row>
                            <Table.Cell colspan={4} textAlign='center'>
                                <i>Start logging in parties to view registry data.</i>
                            </Table.Cell>
                        </Table.Row>
                    ) : (
                        data.map(p => (
                            <Table.Row>
                                <Table.Cell>{p.name}</Table.Cell>
                                <Table.Cell>{p.roles.map(r => roleLabel(r)).join(", ")}</Table.Cell>
                                <Table.Cell>{p.name}</Table.Cell>
                                <Table.Cell>{p.location}</Table.Cell>
                            </Table.Row>
                        ))
                    )}
                </Table.Body>
            </Table>
        </div>
    )
}

const RoleSetup = (props: {
    selectedParty: PartyDetails
    selectedRole: MarketRole
    loggedInPartyData: IPartyLoginData[]
    saveLoggedInParty: (data: IPartyLoginData) => void
    clearPartyRoleSelect: () => void
}) => {
    const user = useParty()
    const ledger = useLedger()
    const wsLoading = useLoading()

    const userSessions = useContractQuery(UserSession)
    const userContracts = useContractQuery(User)
    const [currentRoleChanged, setCurrentRoleChanged] = useState(false)
    const registry = useRegistryLookup()

    const currentRole = userContracts[0]?.contractData?.currentRole

    const { loading, error } = useDablParties()

    const operator = useOperator()

    const {
        selectedParty,
        selectedRole,
        saveLoggedInParty,
        loggedInPartyData,
        clearPartyRoleSelect,
    } = props

    console.log("websocket loading", wsLoading)
    console.log("parties loading", loading)

    useEffect(() => {
        if (!wsLoading && !loading && userSessions.length === 0) {
            console.log("creating user session")
            handleCreateUserSession()
        }
    }, [loading, wsLoading])

    async function handleCreateUserSession() {
        console.log("waiting.. ")
        await halfSecondPromise
        if (userSessions.length === 0) {
            createUserSession(ledger, user, selectedRole, operator)
        } else {
            console.log("Nevermind. ")
        }
    }

    useEffect(() => {
        if (!!currentRole) {
            console.log("current role changed", currentRole)
        }
    }, [currentRole])

    if (loading || wsLoading) {
        return <p className='dark'>Loading contracts and parties...</p>
    }

    if (error) {
        return <p className='dark'>{error}</p>
    }

    if (currentRole) {
        if (currentRole === selectedRole) {
            const registeredPartyRole = checkRegistry()
            if (registeredPartyRole) {
                return (
                    <p className='dark'>
                        {selectedParty.partyName} is already assigned the role of{" "}
                        {roleLabel(selectedRole)}.
                    </p>
                )
            }
            return (
                <InviteAccept
                    party={selectedParty}
                    role={selectedRole}
                    saveLoggedInParty={saveLoggedInParty}
                    clearPartyRoleSelect={clearPartyRoleSelect}
                />
            )
        } else if (!currentRoleChanged) {
            return (
                <AddRole
                    role={selectedRole}
                    loggedInPartyData={loggedInPartyData}
                    saveLoggedInParty={saveLoggedInParty}
                    clearPartyRoleSelect={clearPartyRoleSelect}
                    setCurrentRoleChanged={setCurrentRoleChanged}
                />
            )
        }
    }

    return <p className='dark'>Loading current role...</p>

    function checkRegistry() {
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

            default:
                return false
        }
    }
}

const AddRole = (props: {
    role: MarketRole
    clearPartyRoleSelect: () => void
    loggedInPartyData: IPartyLoginData[]
    saveLoggedInParty: (data: IPartyLoginData) => void
    setCurrentRoleChanged: (bool: boolean) => void
}) => {
    const {
        role,
        loggedInPartyData,
        saveLoggedInParty,
        clearPartyRoleSelect,
        setCurrentRoleChanged,
    } = props

    // const [currentData, setCurrentData] = useState(loggedInPartyData.find(d => d.party === user))
    // const [showAddData, setShowAddData] = useState(false)

    const ledger = useLedger()
    const user = useParty()

    const { parties } = useDablParties()

    const operator = parties.userAdminParty
    const publicParty = parties.userAdminParty

    const args = { newRole: role }
    const currentData = loggedInPartyData.find(d => d.party === user)

    const assignRole = async () => {
        const key = { _1: operator, _2: user }
        await ledger
            .exerciseByKey(User.User_RequestRoleChange, key, args)
            .then(_ => {
                setCurrentRoleChanged(true)
                if (!!currentData) {
                    const newLoginData: IPartyLoginData = {
                        ...currentData,
                        roles: [...currentData.roles, role],
                    }
                    onboardParty(role, newLoginData, ledger, publicParty, operator)
                        .then(_ => {
                            saveLoggedInParty(newLoginData)
                            clearPartyRoleSelect()
                        })
                        .catch(err => {
                            console.log("EERROORRR onboarding")
                            console.log(err)
                        })
                }
            })
            .catch(err => console.log(err))
    }

    // function handleClick() {
    //     if (role === MarketRole.IssuerRole && (!currentData?.issuerId || !currentData?.title)) {
    //         setShowAddData(true)
    //     }
    //     if (role === MarketRole.ExchangeRole && deploymentMode === DeploymentMode.PROD_DABL) {
    //         setShowAddData(true)
    //     } else {
    //         assignRole()
    //     }
    // }

    return (
        <div className='change-role'>
            {/* {showAddData ? (
                <>
                    <p className='dark'>
                        Wait! This role needs a bit more information to be onboarded.
                    </p>
                    {role === MarketRole.IssuerRole ? (
                        <Grid>
                            <Grid.Row>
                                <Grid.Column width={8}>
                                    <Form.Input
                                        label={<p className='dark'>Title</p>}
                                        value={currentData?.title}
                                        placeholder='title'
                                        onChange={e => currentData &&
                                            setCurrentData({
                                                ...currentData,
                                                title: e.currentTarget.value,
                                            })
                                        }
                                    />
                                </Grid.Column>
                                <Grid.Column width={8}>
                                    <Form.Input
                                        label={<p className='dark'>Issuer Id</p>}
                                        value={currentData?.issuerId}
                                        placeholder='issuer Id'
                                        onChange={e => currentData &&
                                            setCurrentData({
                                                ...currentData,
                                                issuerId: e.currentTarget.value,
                                            })
                                        }
                                    />
                                </Grid.Column>
                            </Grid.Row>
                            <Button
                                disabled={!currentData?.issuerId || !currentData?.title}
                                onClick={() => assignRole()}>
                                assign role
                            </Button>
                        </Grid>
                    ) : (
                        deploymentMode === DeploymentMode.PROD_DABL &&
                        role === MarketRole.ExchangeRole && (
                            <>
                                <Form.Checkbox
                                    defaultChecked
                                    label={
                                        <label>
                                            <p className='dark p2'>
                                                Deploy matching engine {<br />} (uncheck if you plan
                                                to use the Exberry Integration)
                                            </p>
                                        </label>
                                    }
                                    onChange={event => currentData &&
                                        setCurrentData({
                                            ...currentData,
                                            deployMatchingEngine: !currentData?.deployMatchingEngine,
                                        })
                                    }
                                />
                                <Button onClick={() => assignRole()}>assign role</Button>
                            </>
                        )
                    )}
                </>
            ) : ( */}
                <>
                    <p className='dark login-details'>
                        You have already assigned a role to {currentData?.name}, would you like to
                        assign an additional role?
                    </p>
                    <div className='confirm-action-buttons'>
                        <Button className='ghost dark' onClick={() => assignRole()}>
                            Yes, add {roleLabel(role)} role
                        </Button>
                        <Button className='ghost dark' onClick={() => clearPartyRoleSelect()}>
                            No, dont add this role
                        </Button>
                    </div>
                </>
            {/* )} */}
        </div>
    )
}

const InviteAccept = (props: {
    party: PartyDetails
    role: MarketRole
    saveLoggedInParty: (data: IPartyLoginData) => void
    clearPartyRoleSelect: () => void
}) => {
    const { party, role, saveLoggedInParty, clearPartyRoleSelect } = props

    const ledger = useLedger()
    const wsPartyLoading = usePartyLoading()
    const publicParty = useDablParties().parties.publicParty
    const operator = useDablParties().parties.userAdminParty

    const custodianInvites = useContractQuery(CustodianInvitation)
    const issuerInvites = useContractQuery(IssuerInvitation)
    const investorInvites = useContractQuery(InvestorInvitation)
    const exchangeInvites = useContractQuery(ExchangeInvitation)
    const brokerInvites = useContractQuery(BrokerInvitation)

    const [loginStatus, setLoginStatus] = useState<string>()
    const [partyLoggingIn, setPartyLoggingIn] = useState<boolean>(false)

    const [partyLoginData, setPartyLoginData] = useState<IPartyLoginData>({
        ...party,
        roles: [role],
        name: party.partyName,
        location: "NYC",
        deployMatchingEngine: true,
    })

    console.log("ws party loading:", wsPartyLoading)

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
                            label={<p className='dark'>Name</p>}
                            value={partyLoginData.name}
                            placeholder='name'
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
                            label={<p className='dark'>Location</p>}
                            value={partyLoginData.location}
                            placeholder='location'
                            onChange={e =>
                                setPartyLoginData({
                                    ...partyLoginData,
                                    location: e.currentTarget.value,
                                })
                            }
                        />
                    </Grid.Column>
                </Grid.Row>

                {getCurrentRole(partyLoginData) === MarketRole.IssuerRole ? (
                    <Grid.Row>
                        <Grid.Column width={8}>
                            <Form.Input
                                label={<p className='dark'>Title</p>}
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
                                label={<p className='dark'>Issuer Id</p>}
                                value={partyLoginData.issuerId}
                                placeholder='issuer Id'
                                onChange={e =>
                                    setPartyLoginData({
                                        ...partyLoginData,
                                        issuerId: e.currentTarget.value,
                                    })
                                }
                            />
                        </Grid.Column>
                    </Grid.Row>
                ) : (
                    deploymentMode === DeploymentMode.PROD_DABL &&
                    getCurrentRole(partyLoginData) === MarketRole.ExchangeRole && (
                        <Grid.Row>
                            <Grid.Column width={8}>
                                <Form.Checkbox
                                    defaultChecked
                                    label={
                                        <label>
                                            <p className='dark p2'>
                                                Deploy matching engine {<br />} (uncheck if you plan
                                                to use the Exberry Integration)
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
                    )
                )}
            </Grid>
            <Button
                fluid
                icon='right arrow'
                labelPosition='right'
                disabled={!partyLoginData}
                className='ghost dark go-button'
                onClick={() => loginParty()}
                content={<p className='dark bold'>Log in</p>}
            />
        </>
    )

    function getRoleInvitation(role: MarketRole, retries: number) {
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
        } else {
            if (retries > 0) {
                console.log("retrying role invite")
                getRoleInvitation(role, retries - 1)
            }
            return false
        }
    }

    async function handleSetLoginStatus(status: string) {
        console.log(status)
        await halfSecondPromise()
        setLoginStatus(status)
    }

    // the last role in the list is the current role
    function getCurrentRole(data: IPartyLoginData) {
        return data.roles.reverse()[0]
    }

    async function loginParty() {
        setPartyLoggingIn(true)

        const roleInvite = getRoleInvitation(role, 3)

        if (!roleInvite) {
            console.log("no invite")
            handleSetLoginStatus("error no invite")
            setPartyLoggingIn(false)
        } else {
            handleSetLoginStatus(`onboarding ${role}`)

            onboardParty(role, partyLoginData, ledger, publicParty, operator)
                .then(_ => {
                    saveLoggedInParty(partyLoginData)
                    handleSetLoginStatus("done")
                    clearPartyRoleSelect()
                })
                .catch(err => {
                    console.log(err)
                    handleSetLoginStatus("login failed")
                })
        }
    }
}

async function onboardParty(
    role: MarketRole,
    partyLoginData: IPartyLoginData,
    ledger: Ledger,
    publicParty: string,
    operator: string
) {
    console.log("onboarding ", role)
    switch (role) {
        case MarketRole.InvestorRole:
            onboardInvestor(operator, ledger, partyLoginData)
            break

        case MarketRole.IssuerRole:
            onboardIssuer(operator, ledger, partyLoginData)
            break

        case MarketRole.BrokerRole:
            onboardBroker(operator, ledger, partyLoginData, publicParty)
            break

        case MarketRole.ExchangeRole:
            onboardExchange(operator, ledger, partyLoginData, publicParty)
            break

        case MarketRole.CustodianRole:
            onboardCustodian(operator, ledger, partyLoginData, publicParty)
            break
    }
}

async function createUserSession(ledger: Ledger, user: string, role: MarketRole, operator: string) {
    return await ledger
        .create(UserSession, { user, role, operator })
        .then(async () => {
            console.log("successfully crearted user session")
        })
        .catch(_ => {
            console.log("failed to create user session")
        })
}

async function onboardInvestor(operator: string, ledger: Ledger, data: IPartyLoginData) {
    const key = { _1: operator, _2: data.party }
    const args = {
        name: data.name,
        location: data.location,
        isPublic: true,
    }
    console.log("onboarding investor ", data.name)

    await ledger
        .exerciseByKey(InvestorInvitation.InvestorInvitation_Accept, key, args)
        .catch(err => console.error(err))
}

async function onboardIssuer(operator: string, ledger: Ledger, data: IPartyLoginData) {

    const key = { _1: operator, _2: data.party }
    const args = {
        name: data.name,
        location: data.location,
        title: data.title || 'title',
        issuerID: data.issuerId || 'id',
    }

    console.log("onboarding issuer ", data.name)

    await ledger
        .exerciseByKey(IssuerInvitation.IssuerInvitation_Accept, key, args)
        .catch(err => console.error(err))
}

async function onboardBroker(
    operator: string,
    ledger: Ledger,
    data: IPartyLoginData,
    publicParty: string
) {
    console.log("onboarding boker ", data.name)

    if (deploymentMode == DeploymentMode.PROD_DABL && TRIGGER_HASH && data.token) {
        deployTrigger(TRIGGER_HASH, MarketplaceTrigger.BrokerTrigger, data.token, publicParty)
    }
    const key = { _1: operator, _2: data.party }
    const args = {
        name: data.name,
        location: data.location,
    }

    await ledger
        .exerciseByKey(BrokerInvitation.BrokerInvitation_Accept, key, args)
        .catch(err => console.error(err))
}

async function onboardExchange(
    operator: string,
    ledger: Ledger,
    data: IPartyLoginData,
    publicParty: string
) {
    console.log("onboarding exchange ", data.name)

    if (deploymentMode == DeploymentMode.PROD_DABL && TRIGGER_HASH && data.token) {
        deployTrigger(TRIGGER_HASH, MarketplaceTrigger.ExchangeTrigger, data.token, publicParty)
        if (!!data.deployMatchingEngine) {
            deployTrigger(TRIGGER_HASH, MarketplaceTrigger.MatchingEngine, data.token, publicParty)
        }
    }
    const key = { _1: operator, _2: data.party }
    const args = {
        name: data.name,
        location: data.location,
    }

    await ledger
        .exerciseByKey(ExchangeInvitation.ExchangeInvitation_Accept, key, args)
        .catch(err => console.error(err))
}

async function onboardCustodian(
    operator: string,
    ledger: Ledger,
    data: IPartyLoginData,
    publicParty: string
) {
    console.log("onboarding custodian ", data.name)

    if (deploymentMode == DeploymentMode.PROD_DABL && TRIGGER_HASH && data.token) {
        deployTrigger(TRIGGER_HASH, MarketplaceTrigger.CustodianTrigger, data.token, publicParty)
    }
    const key = { _1: operator, _2: data.party }
    const args = {
        name: data.name,
        location: data.location,
    }

    await ledger
        .exerciseByKey(CustodianInvitation.CustodianInvitation_Accept, key, args)
        .catch(err => console.error(err))
}

export default QuickSetup
