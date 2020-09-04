import React, { useState} from 'react'
import { Button, Card, Grid, Header } from 'semantic-ui-react'

import { useParty, useStreamQuery, useLedger, useFetchByKey } from '@daml/react'
import { UserSession } from '@daml.js/da-marketplace/lib/Marketplace/Role'

import { ChatFaceIcon } from '../icons/Icons'
import { OPERATOR_PARTY } from '../config'

import LogoutMenu from './common/LogoutMenu'
import {Mode} from './MainScreen'
import './RoleSelectScreen.css'

enum MarketRole {
    INVESTOR = "Investor",
    ISSUER = "Issuer",
    CUSTODIAN = "Custodian",
    EXCHANGE = "Exchange"
}

type RoleSelectProps = {
    loading: boolean;
    caption: string;
    roleSelectClick: () => void;
}

const RoleSelect: React.FC<RoleSelectProps> = ({ loading, caption, roleSelectClick }) => (
    <Card className='centered role-select'>
        <Button
            className='ghost'
            loading={loading}
            onClick={roleSelectClick}
        >
            { caption }
        </Button>
    </Card>
)

type Props = {
    setView: (view: Mode) => void;
    onLogout: () => void;
}

const RoleSelectScreen: React.FC<Props> = ({ setView, onLogout }) => {
    const user = useParty();
    const ledger = useLedger();
    const userSessions = useStreamQuery(UserSession).contracts;

    const [ loading, setLoading ] = useState(false);
    const [ role, setRole ] = useState<MarketRole>();

    const handleRoleClick = async (role: MarketRole, view: Mode) => {
        setRole(role);
        if (userSessions.length === 0) {
            setLoading(true);
            await ledger.create(UserSession, {
                user,
                role,
                operator: OPERATOR_PARTY
            })
        }
        setLoading(false);
        setRole(undefined);
        setView(view);
    }

    return (
        <>
            <LogoutMenu onLogout={onLogout}/>
            <Grid textAlign='center' verticalAlign='middle'>
                <Grid.Row>
                    <Grid.Column width={8} className='role-selector'>
                        <Header as='h3' textAlign='center'>
                            <Header.Content>
                                <ChatFaceIcon/> Welcome to the DABL Social Marketplace
                            </Header.Content>
                        </Header>

                        <Header as='h4' textAlign='center'>
                            <Header.Content>
                                What will you do?
                            </Header.Content>
                        </Header>

                        <RoleSelect
                            caption='I want to chat & invest'
                            loading={loading && role === MarketRole.INVESTOR}
                            roleSelectClick={() => handleRoleClick(MarketRole.INVESTOR, Mode.INVESTOR_VIEW)}/>

                        <Card className='centered'>
                            <Button className='ghost' loading={loading && role === MarketRole.ISSUER}>
                                Issue an asset
                            </Button>
                        </Card>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </>
    );
}

export default RoleSelectScreen;
