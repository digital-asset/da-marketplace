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

import { MarketRole } from "@daml.js/da-marketplace/lib/Marketplace/Utils"

import { UserSession } from "@daml.js/da-marketplace/lib/Marketplace/Onboarding"
import { User } from "@daml.js/da-marketplace/lib/Marketplace/Onboarding"

import { RegistryLookupProvider, useRegistryLookup } from "./common/RegistryLookup"
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

interface IPartyLoginData extends PartyDetails {
    role: MarketRole
    name: string
    location: string
    title?: string
    issuerId?: string
    deployMatchingEngine?: boolean
}

const MARKETROLES = ["CustodianRole", "IssuerRole", "ExchangeRole", "InvestorRole", "BrokerRole"]

const QuickSetup = (props: { onLogin: (credentials?: Credentials) => void }) => {
    const { onLogin } = props

    const history = useHistory()

    const [credentials, setCredentials] = useState<Credentials | undefined>()
    const [parties, setParties] = useState<PartyDetails[]>()
    const [selectedParty, setSelectedParty] = useState<PartyDetails>()
    const [selectedRole, setSelectedRole] = useState<MarketRole>()
    const [successMessage, setSuccessMessage] = useState<string>()

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
            label={<p className='dark select-label'>Party</p>}
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
            label={<p className='dark select-label'>Role</p>}
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
                        content={<p className='dark bold'>Go!</p>}
                    />
                )}
                {!!successMessage && <p className='dark'>{successMessage}</p>}
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
            setCredentials(creds)
        } else {
            clearPartyRoleSelect("Error: invalid credentials")
        }
    }

    async function handleChangeParty(newParty?: PartyDetails) {
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

    async function confirmCredentials(
        retries: number,
        token: string
    ): Promise<Credentials | undefined> {
        const creds = retrieveCredentials()

        if (creds && creds.token === token) {
            return creds
        }

        if (retries > 0) {
            await halfSecondPromise()
            return confirmCredentials(retries - 1, token)
        }

        return undefined
    }
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
        if (!wsLoading && !loading && userSessions.length === 0 && userContracts.length === 0) {
            createUserSession(ledger, user, selectedRole, operator)
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
        return <p className='dark'>Loading contracts and parties...</p>
    }

    if (error) {
        return <p className='dark'>Error: {error}</p>
    }

    if (findRegisteredParty()) {
        return (
            <p className='dark'>
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

    return <p className='dark'>Loading role contract...</p>

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

            default:
                return false
        }
    }

    async function changeRole() {
        const key = { _1: operator, _2: user }
        const args = { newRole: selectedRole }

        return await ledger
            .exerciseByKey(User.User_RequestRoleChange, key, args)
            .then(_ => {
                return selectedRole
            })
            .catch(_ => {
                return undefined
            })
    }
}

async function createUserSession(ledger: Ledger, user: string, role: MarketRole, operator: string) {
    return await ledger.create(UserSession, { user, role, operator })
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

    const [loginStatus, setLoginStatus] = useState<string>()
    const [partyLoggingIn, setPartyLoggingIn] = useState<boolean>(false)

    const [partyLoginData, setPartyLoginData] = useState<IPartyLoginData>({
        ...party,
        role: role,
        name: party.partyName,
        location: "NYC",
        deployMatchingEngine: true,
    })

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

                {partyLoginData.role === MarketRole.IssuerRole ? (
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
                    partyLoginData.role === MarketRole.ExchangeRole && (
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
                className='ghost dark submit-button'
                onClick={() => setupRole()}
                content={<p className='dark bold'>Submit role</p>}
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
                getRoleInvitation(role, retries - 1)
            }
            return false
        }
    }

    async function handleSetLoginStatus(status: string) {
        await halfSecondPromise()
        setLoginStatus(status)
    }

    async function setupRole() {
        setPartyLoggingIn(true)

        if (!getRoleInvitation(role, 3)) {
            handleSetLoginStatus(`Error: could not find ${roleLabel(role)}Invitation contract`)
            setPartyLoggingIn(false)
        } else {
            handleSetLoginStatus(`Onboarding ${roleLabel(role)}...`)

            onboardParty(role, partyLoginData, ledger, publicParty, operator)
                .then(_ => {
                    handleSetLoginStatus("Done")
                    clearPartyRoleSelect(`${roleLabel(role)} onboarded successfully`)
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
    }
}

export default QuickSetup
