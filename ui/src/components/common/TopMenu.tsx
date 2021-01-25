import React from 'react'
import { useHistory } from 'react-router-dom'
import { Button, Menu, Header } from 'semantic-ui-react'

import { LogoutIcon } from '../../icons/Icons'

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
}

const TopMenu: React.FC<Props> = ({ title, notifications, onLogout, topMenuButtons, activeMenuTitle }) => {
    const history = useHistory()

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
                <Menu.Menu className='menu-buttons' position='right'>
                    {topMenuButtons?.map(b =>
                        <Menu.Item>
                            <Button className='ghost' onClick={b.onClick} disabled={b.disabled}>
                                <Header as='h3'>{b.label}</Header>
                            </Button>
                        </Menu.Item>
                    )}
                    <Menu.Item className='log-out-button' as={() => (
                        <Button className='item ghost smaller' onClick={onLogout}>
                            <div className='log-out'>
                                <Header as='h3'>Log out</Header>
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
