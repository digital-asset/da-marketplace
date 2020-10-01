import React from 'react'
import { Button, Menu, Header } from 'semantic-ui-react'

import { LogoutIcon } from '../../icons/Icons'

import './TopMenu.css'

type Props = {
    title?: React.ReactElement;
    notifications?: React.ReactElement[];
    onLogout: () => void;
}

const TopMenu: React.FC<Props> = ({ title, notifications, onLogout }) => (
    <div className='top-section'>
        <Menu className='top-menu'>
            <Menu.Menu className='top-right-menu' position='left'>
                <Menu.Item>
                    <Header as='h3'>
                        <Header.Content>{ title }</Header.Content>
                    </Header>
                </Menu.Item>
            </Menu.Menu>

            <Menu.Menu className='top-left-menu' position='right'>
                <Menu.Item as={() => (
                    <Button className='ghost item' onClick={onLogout}>
                        <p className='log-out'>Log out <LogoutIcon/></p>
                    </Button>
                )}/>
            </Menu.Menu>
        </Menu>

        <div className='notifications'>
            { notifications }
        </div>
    </div>
)


export default TopMenu
