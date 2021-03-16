import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { Button, Menu, Header } from 'semantic-ui-react'

import { User } from '@daml.js/da-marketplace/lib/Marketplace/Onboarding'
import { useContractQuery } from '../../websocket/queryStream'

import { LogoutIcon, NotificationCenterIcon } from '../../icons/Icons'
import { roleRoute } from '../common/utils'

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
}

const TopMenu: React.FC<Props> = ({ title, notifications, onLogout, topMenuButtons, activeMenuTitle, landingPage }) => {
    const history = useHistory();
    const userContracts = useContractQuery(User);
    const currentRole = userContracts[0]?.contractData?.currentRole;
    const [dismissNotificationsAlert, setDismissNotificationsAlert] = useState(true);

    const baseUrl = roleRoute(currentRole);

    useEffect(() => {
        setDismissNotificationsAlert(false);
      }, [notifications]);

    const handleNotifications = () => {
        history.push(`${baseUrl}/notifications`);
        setDismissNotificationsAlert(true);
    }

    console.log(dismissNotificationsAlert);
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
                        <Button className='ghost smaller' onClick={handleNotifications}>
                            <div >
                                <NotificationCenterIcon />
                            </div>
                            <div className={dismissNotificationsAlert ? '' : 'notifications-active'}></div>
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
