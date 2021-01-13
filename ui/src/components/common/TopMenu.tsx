import React from 'react'
import { Button, Menu, Header } from 'semantic-ui-react'

import { LogoutIcon } from '../../icons/Icons'

import './TopMenu.scss'

type Props = {
    title?: React.ReactElement;
    notifications?: React.ReactElement[];
    onLogout: () => void;
    isLandingPage?: boolean;
    topMenuButtons?: JSX.Element[];
}

const TopMenu: React.FC<Props> = ({ title, notifications, onLogout, isLandingPage, topMenuButtons }) => (
    <div className='top-section'>
        <Menu className='top-menu'>
            <Menu.Menu className='top-right-menu' position='left'>
                <Menu.Item>
                    <Header as='h3'>
                        <Header.Content>{ title }</Header.Content>
                    </Header>
                </Menu.Item>
            </Menu.Menu>
            <Menu.Menu className='menu-buttons' position='right'>
               {topMenuButtons?.map(button =>
                    <Menu.Item>
                        {button}
                    </Menu.Item>)}
            </Menu.Menu>
            <Menu.Menu className={`top-left-menu ${!isLandingPage && 'blue-border' }`} position='right'>
                <Menu.Item as={() => (
                    <Button className='ghost item' onClick={onLogout}>
                        <div className='log-out'>
                            <p>Log out</p>
                            <LogoutIcon/>
                        </div>
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
