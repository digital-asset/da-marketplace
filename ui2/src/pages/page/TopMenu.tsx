import React from 'react'
import { useHistory } from 'react-router-dom'
import { Button, Menu, Header } from 'semantic-ui-react'

import { LogoutIcon } from '../../icons/icons'

import OverflowMenu, { OverflowMenuEntry } from './OverflowMenu'

import classNames from 'classnames'
import { signOut, useUserDispatch } from '../../context/UserContext'

export type ITopMenuButtonInfo = {
    label: string,
    onClick: () => void,
    disabled?: boolean;
}

type Props = {
    title?: React.ReactElement;
    notifications?: React.ReactElement[];
    activeMenuTitle?: boolean;
    topMenuButtons?: ITopMenuButtonInfo[];
    landingPage?: boolean;
}

const TopMenu: React.FC<Props> = ({ title, notifications, topMenuButtons, activeMenuTitle, landingPage }) => {
    const history = useHistory();
    const userDispatch = useUserDispatch();

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
                    <Menu.Item className={classNames('log-out-button', {'divider': !landingPage})}>
                        <Button className='ghost smaller' onClick={() => signOut(userDispatch, history)}>
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
