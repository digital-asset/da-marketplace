import React, { useState} from 'react'
import { useHistory } from 'react-router-dom'
import { Button, Card, Header} from 'semantic-ui-react'

import { useParty, useStreamQueries, useLedger } from '@daml/react'
import { UserSession } from '@daml.js/da-marketplace/lib/Marketplace/Onboarding'
import { MarketRole } from '@daml.js/da-marketplace/lib/Marketplace/Utils'

import OnboardingTile from './common/OnboardingTile'
import { ArrowRightIcon } from '../icons/Icons'

type RoleSelectProps = {
    loading: boolean;
    caption: string;
    disabled?: boolean;
    roleSelectClick: () => void;
}

const RoleSelect: React.FC<RoleSelectProps> = ({ loading, disabled, caption, roleSelectClick }) => (
    <Card className='role-select centered'>
        <Button
            disabled={disabled}
            loading={loading}
            onClick={roleSelectClick}
        >
           <Header as='h4'> { caption } </Header>  <ArrowRightIcon/>
        </Button>
    </Card>
)

type Props = {
    operator: string;
    onLogout: () => void;
}

const RoleSelectScreen: React.FC<Props> = ({ operator, onLogout }) => {
    const history = useHistory();
    const [ loading, setLoading ] = useState(false);
    const [ role, setRole ] = useState<MarketRole>();

    const user = useParty();
    const ledger = useLedger();
    const { contracts: userSessions } = useStreamQueries(UserSession, () => [], [], (e) => {
        console.log("Unexpected close from userSession: ", e);
    });

    const handleRoleClick = async (role: MarketRole) => {
        setRole(role);

        // don't create a new userSession if one exists
        if (userSessions.length === 0) {
            setLoading(true);
            await ledger.create(UserSession, { user, role, operator });
        }

        setLoading(false);
        setRole(undefined);
        history.push(`/role/${role.slice(0, -4).toLowerCase()}`);
    }

    return (
        <div className='role-selector'>
            <OnboardingTile>
                <p className='dark'>What would you like to do?</p>
                <RoleSelect
                    caption='I want to chat & invest'
                    loading={loading && role === MarketRole.InvestorRole}
                    roleSelectClick={() => handleRoleClick(MarketRole.InvestorRole)}/>

                <RoleSelect
                    caption='Issue an asset'
                    loading={loading && role === MarketRole.IssuerRole}
                    roleSelectClick={() => handleRoleClick(MarketRole.IssuerRole)}/>

                <RoleSelect
                    caption='Exchange'
                    loading={loading && role === MarketRole.ExchangeRole}
                    roleSelectClick={() => handleRoleClick(MarketRole.ExchangeRole)}/>

                <RoleSelect
                    caption='Broker'
                    loading={loading && role === MarketRole.BrokerRole}
                    roleSelectClick={() => handleRoleClick(MarketRole.BrokerRole)}/>

                <RoleSelect
                    caption='Bank'
                    loading={loading && role === MarketRole.CustodianRole}
                    roleSelectClick={() => handleRoleClick(MarketRole.CustodianRole)}/>
            </OnboardingTile>
        </div>
    );
}

export default RoleSelectScreen;
