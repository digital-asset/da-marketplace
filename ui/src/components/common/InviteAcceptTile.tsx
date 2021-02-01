import React from 'react'

import { MarketRole } from '@daml.js/da-marketplace/lib/Marketplace/Utils'

import { formatIndefiniteArticle, roleLabel } from './utils'
import TopMenu from './TopMenu'
import FormErrorHandled from './FormErrorHandled'
import OnboardingTile, { Tile } from './OnboardingTile'

type Props = {
    role: MarketRole;
    onSubmit: () => Promise<void>;
    onLogout: () => void;
}

const InviteAcceptTile: React.FC<Props> = ({ children, role, onSubmit, onLogout }) => (
    <div className='invite-accept-tile'>
        <TopMenu onLogout={onLogout}/>
        <OnboardingTile
            tiles={[
                <Tile subtitle={
                    `Please fill in some information about yourself as
                    ${formatIndefiniteArticle(roleLabel(role))}`
                }>
                    <FormErrorHandled
                        className='invite-accept-form'
                        size='large'
                        onSubmit={onSubmit}
                    >
                        { children }
                    </FormErrorHandled>
                </Tile>
            ]}
        />
    </div>
)

export default InviteAcceptTile;
