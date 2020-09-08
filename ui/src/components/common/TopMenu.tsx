import React from 'react'
import { Button, Menu, Header } from 'semantic-ui-react'

import { LogoutIcon } from '../../icons/Icons'

import './TopMenu.css'

type Props = {
    title?: React.ReactElement;
    onLogout: () => void;
}

const TopMenu: React.FC<Props> = ({ title, onLogout }) => (
    <Menu className="top-menu">
        { title &&
            <Menu.Menu position='left'>
                <Menu.Item>
                    <Header as='h1'>
                        <Header.Content>
                            {title}
                        </Header.Content>
                    </Header>
                </Menu.Item>
            </Menu.Menu>
        }

        <Menu.Menu position='right'>
            <Menu.Item as={() => (
                <Button className='ghost' onClick={onLogout}>
                    Log out <LogoutIcon/>
                </Button>
            )}/>
        </Menu.Menu>
    </Menu>
)

export default TopMenu
