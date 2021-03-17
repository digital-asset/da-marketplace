import React, { useState} from 'react'
import { useHistory } from 'react-router-dom'
import { Button, Card } from 'semantic-ui-react'

import { useParty, useLedger } from '@daml/react'
import { UserSession } from '@daml.js/da-marketplace/lib/Marketplace/Onboarding'
import { MarketRole } from '@daml.js/da-marketplace/lib/Marketplace/Utils'

import { useContractQuery } from '../websocket/queryStream'

import OnboardingTile from './common/OnboardingTile'
import { roleRoute } from './common/utils'

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
            icon='right arrow blue'
            labelPosition='right'
            content={<p className='bold'> { caption } </p> }
            onClick={roleSelectClick}
        />
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
    const userSessions = useContractQuery(UserSession);

    const handleRoleClick = async (role: MarketRole) => {
        setRole(role);

        // don't create a new userSession if one exists
        if (userSessions.length === 0) {
            setLoading(true);
            await ledger.create(UserSession, { user, role, operator });
        }

        setLoading(false);
        setRole(undefined);
        history.push(roleRoute(role));
    }

    return (
        <div className='role-selector'>
            <OnboardingTile>
                <p className='dark bold'>What would you like to do?</p>
                <RoleSelect
                    caption='Invest'
                    loading={loading && role === MarketRole.InvestorRole}
                    roleSelectClick={() => handleRoleClick(MarketRole.InvestorRole)}/>

                <RoleSelect
                    caption='Issue an asset'
                    loading={loading && role === MarketRole.IssuerRole}
                    roleSelectClick={() => handleRoleClick(MarketRole.IssuerRole)}/>

                <RoleSelect
                    caption='List markets and match orders'
                    loading={loading && role === MarketRole.ExchangeRole}
                    roleSelectClick={() => handleRoleClick(MarketRole.ExchangeRole)}/>

                <RoleSelect
                    caption='Intermediate access to markets'
                    loading={loading && role === MarketRole.BrokerRole}
                    roleSelectClick={() => handleRoleClick(MarketRole.BrokerRole)}/>

                <RoleSelect
                    caption='Safekeep assets'
                    loading={loading && role === MarketRole.CustodianRole}
                    roleSelectClick={() => handleRoleClick(MarketRole.CustodianRole)}/>

                <RoleSelect
                    caption='Clear trades'
                    loading={loading && role === MarketRole.CCPRole}
                    roleSelectClick={() => handleRoleClick(MarketRole.CCPRole)}/>
            </OnboardingTile>
        </div>
    );
}

export default RoleSelectScreen;
