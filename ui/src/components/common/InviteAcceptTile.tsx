import React from 'react'

import TopMenu from './TopMenu'
import FormErrorHandled from './FormErrorHandled'
import OnboardingTile, { Tile } from './OnboardingTile'
import { indefiniteArticle as a } from './utils'

import './InviteAcceptTile.scss'

type Props = {
    role: string;
    onSubmit: () => Promise<void>;
    onLogout: () => void;
}

const InviteAcceptTile: React.FC<Props> = ({ children, role, onSubmit, onLogout }) => (
    <>
        <TopMenu onLogout={onLogout}/>
        <OnboardingTile
            tiles={[
                <Tile subtitle={`Please fill in some information about yourself as ${a(role.replace(/Role/g, ''))}:`}>
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
    </>
)

export default InviteAcceptTile;
