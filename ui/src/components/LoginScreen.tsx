// Copyright (c) 2020 Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useState, useEffect } from "react"
import { useHistory } from "react-router-dom"
import { Button, Form, Icon } from "semantic-ui-react"

import { PartyToken, DamlHubLogin, usePublicParty } from "@daml/hub-react"

import { PublicAppInfo } from "@daml.js/da-marketplace/lib/Marketplace/Operator"

import {
    useContractQuery,
    AS_PUBLIC,
    usePublicLoading,
} from "../websocket/queryStream"
import Credentials, { computeCredentials } from "../Credentials"
import { retrieveParties, storeParties } from "../Parties"
import { DeploymentMode, deploymentMode, ledgerId } from "../config"

import OnboardingTile, { Tile, logoHeader } from "./common/OnboardingTile"
import { AppError } from "./common/errorTypes"
import FormErrorHandled from "./common/FormErrorHandled"
import LoadingScreen from "./common/LoadingScreen"
import SetupRequired from "./SetupRequired"

type Props = {
    onLogin: (credentials?: Credentials) => void
}

interface PartiesLoginFormProps extends Props {
  setUploadedParties: (parties: PartyToken[]) => void;
}
/**
 * React component for the login screen of the `App`.
 */
const LoginScreen: React.FC<Props> = ({ onLogin }) => {
    const isLoading = usePublicLoading()
    const appInfos = useContractQuery(PublicAppInfo, AS_PUBLIC)
    const history = useHistory()
    const location = window.location;

    useEffect(() => {
        const url = new URL(location.href)

        // Remove the query params set by Daml Hub
        if (url.search !== "" && url.hash === "#/") {
            location.href = `${url.origin}${url.pathname}#/`
        }
    }, [location])

    const [uploadedParties, setUploadedParties] = useState<PartyToken[]>([])

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
    const history = useHistory();

    const handleLogin = async (event: React.FormEvent) => {
        event.preventDefault()
        const credentials = computeCredentials(username)
        onLogin(credentials)
        history.push('/role');
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
    const history = useHistory()

    const handleDablTokenLogin = () => {
        onLogin({ token: jwt, party: partyId, ledgerId })
        history.push('/role');
    }

    return (
        <>
            <p className='login-details dark'>or via Daml Hub Console JWT Token:</p>
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
    const [parties, setParties] = useState<PartyToken[]>()
    const publicPartyId = usePublicParty();
    const history = useHistory();

    const options =
        parties?.map(party => ({
            key: party.party,
            text: party.partyName,
            value: party.party,
        })) || []

    useEffect(() => {
        if (publicPartyId) {
            const parties = retrieveParties(publicPartyId)
            if (parties) {
                setParties(parties)
                setSelectedPartyId(parties[0]?.party || "")
            }
        }
    }, [publicPartyId])

    useEffect(() => {
        setUploadedParties(parties || [])
    }, [parties])

    const handleLogin = async (party?: PartyToken) => {
        let partyDetails = parties?.find(p => p.party === selectedPartyId)

        if (party) {
            partyDetails = party
        }

        if (partyDetails) {
            const { ledgerId, party, token } = partyDetails
            onLogin({ ledgerId, party, token })
            history.push('/role');
        } else {
            throw new AppError("Failed to Login", "No parties.json or party selected")
        }
    }

    const handleLoad = async (parties: PartyToken[]) => {
        if (parties.length > 0) {
            setParties(parties)
            setSelectedPartyId(parties[0].party)
            storeParties(parties)
        }
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
                    the Daml Hub Console Identities tab:{" "}
                </span>
            </p>
            <FormErrorHandled size='large' className='login-form' onSubmit={handleLogin}>
                {loadAndCatch => (
                    <>
                    <Form.Group widths='equal'>
                        <Form.Input className='upload-file-input'>
                        <DamlHubLogin withFile
                            options={{
                                method: {
                                    file: {
                                        render: () => (
                                            <label className='custom-file-upload button ui'>
                                                <Icon name='file' className='white' />
                                                <p className='dark'>Load Parties</p>
                                            </label>
                                        )

                                    }
                                }
                            }}
                            onPartiesLoad={(creds, err) => {
                                if (creds) {
                                    handleLoad(creds)
                                } else {
                                    loadAndCatch(handleError(err || 'Parties login error'))
                                }
                            }}
                        />
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
    const history = useHistory();

    return (
        <Form size='large'>
            <DamlHubLogin
                onLogin={creds => {
                    if (creds) {
                        const { party, token, ledgerId } = creds;
                        onLogin({ party, token, ledgerId });
                        history.push('/role');
                    }
                }}
                options={{
                    method: {
                        button: {
                            render: () => <Button
                                fluid
                                icon='right arrow blue'
                                labelPosition='right'
                                className='dabl-login-button'
                            />
                        }
                    }
                }}
            />
        </Form>
    )
}

export default LoginScreen
