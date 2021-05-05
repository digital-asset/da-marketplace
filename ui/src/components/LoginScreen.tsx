// Copyright (c) 2020 Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useState, useEffect } from "react"
import { useHistory, useLocation } from "react-router-dom"
import { Button, Form, Icon } from "semantic-ui-react"

import { DablPartiesInput, PartyDetails } from "@daml/hub-react"

import { PublicAppInfo } from "@daml.js/da-marketplace/lib/Marketplace/Operator"

import QueryStreamProvider, {
    useContractQuery,
    AS_PUBLIC,
    usePublicLoading,
} from "../websocket/queryStream"
import Credentials, { computeCredentials } from "../Credentials"
import { retrieveParties, storeParties } from "../Parties"
import { DeploymentMode, deploymentMode, ledgerId, dablHostname } from "../config"

import OnboardingTile, { Tile, logoHeader } from "./common/OnboardingTile"
import { AppError } from "./common/errorTypes"
import FormErrorHandled from "./common/FormErrorHandled"
import LoadingScreen from "./common/LoadingScreen"
import SetupRequired from "./SetupRequired"
import { useDablParties } from "./common/common"
import {
    HashRouter as Router,
    useRouteMatch,
} from "react-router-dom"

function useQuery() {
    return new URLSearchParams(useLocation().search)
}

function raiseParamsToHash() {
    const url = new URL(window.location.href)

    // When DABL login redirects back to app, hoist the query into the hash route.
    // This allows react-router's HashRouter to see and parse the supplied params

    // i.e., we want to turn
    // ledgerid.projectdabl.com/?party=party&token=token/#/
    // into
    // ledgerid.projectdabl.com/#/?party=party&token=token
    if (url.search !== "" && url.hash === "#/") {
        window.location.href = `${url.origin}${url.pathname}#/${url.search}`
    }
}

function getTokenFromCookie(): string {
    const tokenCookiePair =
        document.cookie.split("; ").find(row => row.startsWith("DABL_LEDGER_ACCESS_TOKEN")) || ""
    return tokenCookiePair.slice(tokenCookiePair.indexOf("=") + 1)
}

type Props = {
    onLogin: (credentials?: Credentials) => void
}

interface PartiesLoginFormProps extends Props {
    setUploadedParties: (parties: PartyDetails[]) => void
}
/**
 * React component for the login screen of the `App`.
 */
const LoginScreen: React.FC<Props> = ({ onLogin }) => {
    const isLoading = usePublicLoading()
    const appInfos = useContractQuery(PublicAppInfo, AS_PUBLIC)
    const query = useQuery()
    const history = useHistory()
    const location = useLocation()
    const { path, url } = useRouteMatch()

    const [uploadedParties, setUploadedParties] = useState<PartyDetails[]>([])

    useEffect(() => {
        raiseParamsToHash()
    }, [location])

    useEffect(() => {
        const party = query.get("party")
        const token = getTokenFromCookie()

        if (!token || !party) {
            return
        }

        onLogin({ token, party, ledgerId })
        history.push("/role")
    }, [onLogin, query, history])

    const localTiles = [
        <Tile key='login' header={logoHeader}>
            <LocalLoginForm onLogin={onLogin} />
        </Tile>,
    ]

    let dablTiles = [
        <Tile key='login' header={logoHeader}>
            <DablLoginForm onLogin={onLogin} />
        </Tile>,
        <Tile key='parties'>
            <PartiesLoginForm onLogin={onLogin} setUploadedParties={setUploadedParties} />
        </Tile>,
        <Tile key='jwt'>
            <JWTLoginForm onLogin={onLogin} />
        </Tile>,
    ]

    if (uploadedParties.length != 0) {
        dablTiles.splice(
            2,
            0,
            <Tile>
                <Button className='ghost dark' onClick={() => history.push("/quick-setup")}>
                    Quick Setup
                </Button>
            </Tile>
        )
    }

    const tiles =
        appInfos.length !== 0
            ? deploymentMode === DeploymentMode.PROD_DABL
                ? dablTiles
                : localTiles
            : [<SetupRequired />]

    return (
        <div className='login-screen'>
            {isLoading ? <LoadingScreen /> : <OnboardingTile tiles={tiles} />}
        </div>
    )
}

const LocalLoginForm: React.FC<Props> = ({ onLogin }) => {
    const [username, setUsername] = useState("")
    const history = useHistory()

    const handleLogin = async (event: React.FormEvent) => {
        event.preventDefault()
        const credentials = computeCredentials(username)
        onLogin(credentials)
        history.push("/role")
    }

    return (
        <Form size='large' className='username-login'>
            <Form.Input
                required
                fluid
                placeholder='Username'
                value={username}
                onChange={e => setUsername(e.currentTarget.value)}
            />
            <Button
                className='ghost dark'
                fluid
                icon='right arrow'
                labelPosition='right'
                disabled={!username}
                content={<p className='dark bold'>Log in</p>}
                onClick={handleLogin}
            />
        </Form>
    )
}

const JWTLoginForm: React.FC<Props> = ({ onLogin }) => {
    const [partyId, setPartyId] = useState("")
    const [jwt, setJwt] = useState("")
    const { parties, loading } = useDablParties()

    const history = useHistory()

    const handleDablTokenLogin = () => {
        onLogin({ token: jwt, party: partyId, ledgerId })
        history.push("/role")
    }

    return (
        <>
            <p className='login-details dark'>or via DABL Console JWT Token:</p>
            <Form size='large' className='login-form'>
                <Form.Input
                    fluid
                    required
                    label={<p className='dark'>Party</p>}
                    placeholder='Party ID'
                    value={partyId}
                    onChange={e => setPartyId(e.currentTarget.value)}
                />

                <Form.Input
                    fluid
                    required
                    type='password'
                    label={<p className='dark'>Token</p>}
                    placeholder='Party JWT'
                    value={jwt}
                    onChange={e => setJwt(e.currentTarget.value)}
                />
                <Button
                    fluid
                    className='ghost dark'
                    icon='right arrow'
                    labelPosition='right'
                    disabled={!jwt || !partyId}
                    content={<p className='dark bold'>Submit</p>}
                    onClick={handleDablTokenLogin}
                />
            </Form>
        </>
    )
}

const PartiesLoginForm: React.FC<PartiesLoginFormProps> = ({ onLogin, setUploadedParties }) => {
    const [selectedPartyId, setSelectedPartyId] = useState("")
    const [parties, setParties] = useState<PartyDetails[]>()

    const history = useHistory()

    const options =
        parties?.map(party => ({
            key: party.party,
            text: party.partyName,
            value: party.party,
        })) || []

    useEffect(() => {
        const parties = retrieveParties()
        if (parties) {
            setParties(parties)
            setSelectedPartyId(parties[0]?.party || "")
        }
    }, [])

    useEffect(() => {
        setUploadedParties(parties || [])
    }, [parties])

    const handleLogin = async (party?: PartyDetails) => {
        let partyDetails = parties?.find(p => p.party === selectedPartyId)

        if (party) {
            partyDetails = party
        }

        if (partyDetails) {
            const { ledgerId, party, token } = partyDetails
            onLogin({ ledgerId, party, token })
            history.push("/role")
        } else {
            throw new AppError("Failed to Login", "No parties.json or party selected")
        }
    }

    const handleLoad = async (parties: PartyDetails[]) => {
        setParties(parties)
        setSelectedPartyId(parties[0]?.party || "")
        storeParties(parties)
    }

    const handleError = (error: string): (() => Promise<void>) => {
        return async () => {
            throw new AppError("Invalid Parties.json", error)
        }
    }

    return (
        <>
            <p className='login-details dark'>
                <span>
                    Alternatively, login with <code className='link'>parties.json</code> located in
                    the DABL Console Users tab:{" "}
                </span>
            </p>
            <FormErrorHandled size='large' className='login-form' onSubmit={handleLogin}>
                {loadAndCatch => (
                    <>
                        <Form.Group widths='equal'>
                            <Form.Input className='upload-file-input'>
                                <label className='custom-file-upload button ui'>
                                    <DablPartiesInput
                                        ledgerId={ledgerId}
                                        onError={error => loadAndCatch(handleError(error))}
                                        onLoad={handleLoad}
                                    />
                                    <Icon name='file' className='white' />
                                    <p className='dark'>Load Parties</p>
                                </label>
                            </Form.Input>
                            <Form.Select
                                selection
                                disabled={!parties}
                                placeholder='Choose a party'
                                options={options}
                                value={selectedPartyId}
                                onChange={(_, d) =>
                                    typeof d.value === "string" && setSelectedPartyId(d.value)
                                }
                            />
                        </Form.Group>
                        <Button
                            fluid
                            submit
                            icon='right arrow'
                            labelPosition='right'
                            disabled={!parties?.find(p => p.party === selectedPartyId)}
                            className='ghost dark'
                            content={<p className='dark bold'>Log in</p>}
                        />
                        {/* FORM_END */}
                    </>
                )}
            </FormErrorHandled>
        </>
    )
}

const DablLoginForm: React.FC<Props> = ({ onLogin }) => {
    const handleDablLogin = () => {
        window.location.assign(`https://login.${dablHostname}/auth/login?ledgerId=${ledgerId}`)
    }

    return (
        <Form size='large'>
            <Button
                fluid
                icon='right arrow blue'
                labelPosition='right'
                className='dabl-login-button'
                content={<p className='bold'>Log in with Daml Hub</p>}
                onClick={handleDablLogin}
            />
        </Form>
    )
}

export default LoginScreen
