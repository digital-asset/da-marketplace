import React from 'react'
import { NavLink } from 'react-router-dom'
import { Header, Menu } from 'semantic-ui-react'

import { useParty, useStreamFetchByKey } from '@daml/react'
import { RegisteredCustodian } from '@daml.js/da-marketplace/lib/Marketplace/Registry'

import { wrapDamlTuple } from '../common/damlTypes'
import { UserIcon } from '../../icons/Icons'
import { useOperator } from '../common/common'

type Props = {
    url: string;
    disabled?: boolean;
}

const CustodianSideNav: React.FC<Props> = ({ disabled, url }) => {
    const custodian = useParty();
    const operator = useOperator();
    const key = () => wrapDamlTuple([operator, custodian]);
    const registeredCustodian = useStreamFetchByKey(RegisteredCustodian, key, [operator, custodian]).contract;

    const HomeMenuItem = (
        <Menu.Item
            as={NavLink}
            to={url}
            exact
        >
            <Header as='h3'>@{registeredCustodian?.payload.name || custodian}</Header>
        </Menu.Item>
    )

    return disabled ? HomeMenuItem : (
        <Menu.Menu>
            { HomeMenuItem }

            <Menu.Item
                as={NavLink}
                to={`${url}/clients`}
                className='sidemenu-item-normal'
                exact
            >
                <p><UserIcon/> Clients</p>
            </Menu.Item>
        </Menu.Menu>
    )
}

export default CustodianSideNav;
