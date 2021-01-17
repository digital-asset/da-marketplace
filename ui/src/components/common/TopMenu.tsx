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
                <Menu.Menu className='top-right-menu' position='left'>
                    <Menu.Item disabled={!activeMenuTitle} onClick={history.goBack}>
                        <Header as='h3'>
                            <Header.Content>{ title }</Header.Content>
                        </Header>
                    </Menu.Item>
                </Menu.Menu>
                <Menu.Menu className='top-left-menu' position='right'>
                    {topMenuButtons?.map(b =>
                        <Menu.Item>
                            <Button className='ghost' onClick={b.onClick} disabled={b.disabled}>
                                {b.label}
                            </Button>
                        </Menu.Item>
                    )}
                    <Menu.Item as={() => (
                        <Button className='item ghost smaller' onClick={onLogout}>
                            <div className='log-out'>
                                <p className='p2'>Log out</p>
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
