import React from 'react'
import { useHistory } from 'react-router-dom'
import { Button, Menu, Header } from 'semantic-ui-react'

import { LogoutIcon, NotificationCenterIcon } from '../../icons/Icons'

import OverflowMenu, { OverflowMenuEntry } from './OverflowMenu'

import classNames from 'classnames'

export type ITopMenuButtonInfo = {
    label: string,
    onClick: () => void,
    disabled?: boolean;
}

type Props = {
    title?: React.ReactElement;
    notifications?: React.ReactElement[];
    onLogout: () => void;
    activeMenuTitle?: boolean;
    topMenuButtons?: ITopMenuButtonInfo[];
    landingPage?: boolean;
    showNotificationAlert?: boolean;
    handleNotificationAlert?: () => void;
}

const TopMenu: React.FC<Props> = ({ title, notifications, onLogout, topMenuButtons, activeMenuTitle, landingPage, showNotificationAlert, handleNotificationAlert }) => {
    const history = useHistory();

    return (
        <div className='top-section'>
            <Menu className='top-menu'>
                <Menu.Menu position='left'>
                    <Menu.Item disabled={!activeMenuTitle} onClick={history.goBack}>
                        <Header as='h1'>
                            <Header.Content>{ title }</Header.Content>
                        </Header>
                    </Menu.Item>
                </Menu.Menu>
                <Menu.Menu position='right'>
                    {topMenuButtons?.map(b =>
                        <Menu.Item className='menu-button'>
                            <Button className='ghost' onClick={b.onClick} disabled={b.disabled}>
                                <Header as='h3'>{b.label}</Header>
                            </Button>
                        </Menu.Item>
                    )}
                    {topMenuButtons &&
                        <Menu.Item className='overflow-menu-item'>
                            <OverflowMenu>
                                {topMenuButtons?.map(b =>
                                    <OverflowMenuEntry key={b.label} label={b.label} onClick={b.onClick}/>
                                )}
                            </OverflowMenu>
                        </Menu.Item>}
                    <Menu.Item className={classNames('notification-center-button', { 'divider': !landingPage })}>
                        <Button className='ghost smaller' onClick={handleNotificationAlert}>
                            <div >
                                <NotificationCenterIcon />
                            </div>
                            <div className={classNames({ 'notifications-active': showNotificationAlert})}></div>
                        </Button>
                    </Menu.Item>
                    <Menu.Item className={classNames('log-out-button', { 'divider': !landingPage })}>
                        <Button className='ghost smaller' onClick={onLogout}>
                            <div className='log-out'>
                                <Header as='h3'>Log out</Header>
                                <LogoutIcon/>
                            </div>
                        </Button>
                    </Menu.Item>
                </Menu.Menu>
            </Menu>

            <div className='notifications'>
                { notifications }
            </div>
        </div>
    )
}

export default TopMenu
