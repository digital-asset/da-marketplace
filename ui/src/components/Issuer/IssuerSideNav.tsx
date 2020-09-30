import React from 'react'
import { NavLink } from 'react-router-dom'
import { Header, Menu } from 'semantic-ui-react'

import { useParty, useStreamQuery, useStreamFetchByKey } from '@daml/react'
import { useWellKnownParties } from '@daml/dabl-react'

import { Token } from '@daml.js/da-marketplace/lib/Marketplace/Token'
import { RegisteredIssuer } from '@daml.js/da-marketplace/lib/Marketplace/Registry'

import { PublicIcon } from '../../icons/Icons'
import { wrapDamlTuple } from '../common/damlTypes'

type IssuerSideNavProps = {
    url: string
}

const IssuerSideNav: React.FC<IssuerSideNavProps> = ({ url }) => {
    const issuer = useParty();
    const allTokens = useStreamQuery(Token).contracts

    const operator = useWellKnownParties().userAdminParty;
    const key = () => wrapDamlTuple([operator, issuer]);
    const registeredIssuer = useStreamFetchByKey(RegisteredIssuer, key, [operator, issuer]).contract;

    return <>
        <Menu.Menu>
            <Menu.Item
                as={NavLink}
                to={url}
                exact={true}
            >
                <Header as='h3'>@{registeredIssuer?.payload.name || issuer}</Header>
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
                <p>Issued Tokens:</p>
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
