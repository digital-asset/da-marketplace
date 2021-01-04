import React from 'react'
import { NavLink } from 'react-router-dom'
import { Header, Menu } from 'semantic-ui-react'

import { useStreamQueries } from '@daml/react'

import { Token } from '@daml.js/da-marketplace/lib/Marketplace/Token'

import { PublicIcon, CircleIcon } from '../../icons/Icons'

type IssuerSideNavProps = {
    url: string;
    name: string;
}

const IssuerSideNav: React.FC<IssuerSideNavProps> = ({ url, name }) => {
    const allTokens = useStreamQueries(Token, () => [], [], (e) => {
        console.log("Unexpected close from Token: ", e);
    }).contracts

    return <>
        <Menu.Menu>
            <Menu.Item
                as={NavLink}
                to={url}
                exact={true}
            >
                <Header as='h3'>@{name}</Header>
            </Menu.Item>
            <Menu.Item
                as={NavLink}
                to={`${url}/issue-asset`}
                className='sidemenu-item-normal'
            >
                <p><PublicIcon/>Issue Asset</p>
            </Menu.Item>
        </Menu.Menu>

        <Menu.Menu className='sub-menu'>
            <Menu.Item>
                <p className='p2'>Issued Tokens:</p>
            </Menu.Item>
            {allTokens.map(token => (
                <Menu.Item
                    className='sidemenu-item-normal'
                    as={NavLink}
                    to={`${url}/issued-token/${encodeURIComponent(token.contractId)}`}
                    key={token.contractId}
                >
                <p>{token.payload.id.label}</p>
                </Menu.Item>
            ))}
        </Menu.Menu>
    </>
}

export default IssuerSideNav
