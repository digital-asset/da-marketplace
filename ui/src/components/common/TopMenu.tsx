import React from 'react'
import { useHistory } from 'react-router-dom'
import { Button, Menu, Header } from 'semantic-ui-react'

import { LogoutIcon } from '../../icons/Icons'

import './TopMenu.scss'

export type ITopMenuButtonInfo = {
    label: string,
    onClick: () => void
}

type Props = {
    title?: React.ReactElement;
    notifications?: React.ReactElement[];
    onLogout: () => void;
    isLandingPage?: boolean;
    activeMenuTitle?: boolean;
    topMenuButtons?: ITopMenuButtonInfo[];
}

const TopMenu: React.FC<Props> = ({ title, notifications, onLogout, isLandingPage, topMenuButtons, activeMenuTitle }) => {
    const history = useHistory()

    return (
        <div className='top-section'>
            <Menu className='top-menu'>
                <Menu.Menu className='top-right-menu' position='left'>
                    <Menu.Item disabled={!activeMenuTitle} onClick={history.goBack}>
                        <Header as='h3'>
                            <Header.Content>{ title }</Header.Content>
                        </Header>
                    </Menu.Item>
                </Menu.Menu>
                <Menu.Menu className='menu-buttons' position='right'>
                    {topMenuButtons?.map(b =>
                        <Menu.Item>
                            <Button className='ghost'
                            onClick={b.onClick}
                            >
                                {b.label}
                            </Button>
                        </Menu.Item>)}
                </Menu.Menu>
                <Menu.Menu className={`top-left-menu ${!isLandingPage && 'blue-border' }`}>
                    <Menu.Item as={() => (
                        <Button className='item' onClick={onLogout}>
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
}


export default TopMenu
