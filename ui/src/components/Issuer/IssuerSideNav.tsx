import React from 'react'
import { NavLink } from 'react-router-dom'
import { Header, Menu } from 'semantic-ui-react'

import { Token } from '@daml.js/da-marketplace/lib/Marketplace/Token'

import { useParty, useStreamQuery } from '@daml/react'

import { PublicIcon } from '../../icons/Icons'

type IssuerSideNavProps = {
    url: string
}

const IssuerSideNav: React.FC<IssuerSideNavProps> = ({ url }) => {
    const user = useParty();
    const allTokens = useStreamQuery(Token).contracts

    return <>
        <Menu.Menu>
            <Menu.Item
                as={NavLink}
                to={url}
                exact={true}
            >
                <Header as='h3'>@ {user}</Header>
            </Menu.Item>
            <Menu.Item
                as={NavLink}
                to={`${url}/issue-asset`}
                className='sidemenu-item-normal'
            >
                <p><PublicIcon/>Issue Asset</p>
            </Menu.Item>
        </Menu.Menu>

        <Menu.Menu>
            <Menu.Item>
                <p>Issued Tokens:</p>
            </Menu.Item>
            {allTokens.map(token => (
                <Menu.Item
                    className='sidemenu-item-normal'
                    as={NavLink}
                    to={`${url}/issued-token/${token.contractId}`}
                    key={token.contractId}
                >
                    <p>{token.payload.id.label}</p>
                </Menu.Item>
            ))}
        </Menu.Menu>
    </>
}

export default IssuerSideNav
