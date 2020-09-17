import React from 'react'

import { useParams } from 'react-router-dom'

import { Button, Menu, Header } from 'semantic-ui-react'

import { LogoutIcon } from '../../icons/Icons'

import { useStreamQuery } from '@daml/react'
import { Token } from '@daml.js/da-marketplace/lib/Marketplace/Token'

import './TopMenu.css'

type Props = {
    title?: React.ReactElement;
    onLogout: () => void;
}

const TopMenu: React.FC<Props> = ({ title, onLogout }) => {
    const { tokenId } = useParams<{tokenId: string}>()

    const token = useStreamQuery(Token).contracts.find(c => c.contractId === decodeURIComponent(tokenId))

    let headerTitle = title

    if (!!token) {
        headerTitle = <p>{token.payload.id.label}</p>;
    }

    return (
        <Menu className='top-menu'>
            <Menu.Menu className='top-right-menu' position='left'>
                <Menu.Item>
                    <Header as='h1'>
                        <Header.Content>
                            {headerTitle}
                        </Header.Content>
                    </Header>
                </Menu.Item>
            </Menu.Menu>

            <Menu.Menu className='top-left-menu' position='right'>
                <Menu.Item as={() => (
                    <Button className='ghost' onClick={onLogout}>
                        Log out <LogoutIcon/>
                    </Button>
                )}/>
            </Menu.Menu>
        </Menu>
    )
}

export default TopMenu
