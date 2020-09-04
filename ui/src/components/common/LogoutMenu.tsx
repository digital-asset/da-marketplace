import React from 'react'
import { Button, Menu } from 'semantic-ui-react'

import { LogoutIcon } from '../../icons/Icons'

type Props = {
    onLogout: () => void;
}

const LogoutMenu: React.FC<Props> = ({ onLogout }) => (
    <Menu>
        <Menu.Menu position='right'>
            <Menu.Item as={() => (
                <Button className='ghost' onClick={onLogout}>
                    Log out <LogoutIcon/>
                </Button>
            )}/>
        </Menu.Menu>
    </Menu>
)

export default LogoutMenu
