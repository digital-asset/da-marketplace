import React, { useState} from 'react'
import { Button, Card } from 'semantic-ui-react'

import { useParty, useStreamQuery, useLedger } from '@daml/react'
import { UserSession } from '@daml.js/da-marketplace/lib/Marketplace/Role'

import { getWellKnownParties } from '../config'

import TopMenu from './common/TopMenu'
import OnboardingTile from './common/OnboardingTile'
import { ArrowRightIcon } from '../icons/Icons'

import { Mode } from './MainScreen'
import './RoleSelectScreen.css'

enum MarketRole {
    INVESTOR = "Investor",
    ISSUER = "Issuer",
    CUSTODIAN = "Custodian"
}

type RoleSelectProps = {
    loading: boolean;
    caption: string;
    disabled?: boolean;
    roleSelectClick: () => void;
}

const RoleSelect: React.FC<RoleSelectProps> = ({ loading, disabled, caption, roleSelectClick }) => (
    <Card className='centered role-select'>
        <Button
            disabled={disabled}
            className='ghost'
            loading={loading}
            onClick={roleSelectClick}
        >
            { caption } <ArrowRightIcon/>
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

            const { operator } = await getWellKnownParties();
            await ledger.create(UserSession, { user, role, operator });
        }
        setLoading(false);
        setRole(undefined);
        setView(view);
    }

    return (
        <>
            <TopMenu onLogout={onLogout}/>
            <OnboardingTile subtitle='What will you do?'>
                <RoleSelect
                    caption='I want to chat & invest'
                    loading={loading && role === MarketRole.INVESTOR}
                    roleSelectClick={() => handleRoleClick(MarketRole.INVESTOR, Mode.INVESTOR_VIEW)}/>

                {/* disabled these buttons until the view components for them are ready */}
                <RoleSelect
                    disabled
                    caption='Issue an asset'
                    loading={loading && role === MarketRole.ISSUER}
                    roleSelectClick={() => {}}/>

                <RoleSelect
                    disabled
                    caption='Bank'
                    loading={loading && role === MarketRole.CUSTODIAN}
                    roleSelectClick={() => {}}/>
            </OnboardingTile>
        </>
    );
}

export default RoleSelectScreen;
