import React from 'react'

import { Switch, Route, useRouteMatch, useHistory } from 'react-router-dom'

import { useStreamQueries } from '@daml/react'

import { ExchangeParticipant } from '@daml.js/da-marketplace/lib/Marketplace/ExchangeParticipant'
import { CustodianRelationship } from '@daml.js/da-marketplace/lib/Marketplace/Custodian'
import { BrokerCustomer } from '@daml.js/da-marketplace/lib/Marketplace/BrokerCustomer'
import { AssetDeposit } from '@daml.js/da-marketplace/lib/DA/Finance/Asset'
import { MarketRole } from '@daml.js/da-marketplace/lib/Marketplace/Utils'

import { WalletIcon } from '../../icons/Icons'

import { damlTupleToString, makeContractInfo } from '../common/damlTypes'
import { useRegistryLookup } from '../common/RegistryLookup'
import PageSection from '../common/PageSection'
import Page from '../common/Page'
import Holdings from '../common/Holdings';

import { ITopMenuButtonInfo } from './TopMenu'

import WalletTransaction from './WalletTransaction';
import { useContractQuery } from '../../websocket/queryStream'

const Wallet = (props: {
    sideNav: React.ReactElement;
    onLogout: () => void;
    role: MarketRole;
}) => {
    const history = useHistory()
    const { path, url } = useRouteMatch();
    const { brokerMap, custodianMap, exchangeMap } = useRegistryLookup();

    const { sideNav, onLogout, role } = props

    const allDeposits = useContractQuery(AssetDeposit);

    const allCustodianRelationships = useContractQuery(CustodianRelationship);

    const brokerProviders = useStreamQueries(BrokerCustomer)
        .contracts
        .map(broker => {
            const party = broker.payload.broker;
            const name = brokerMap.get(damlTupleToString(broker.key))?.name;
            return {
                party,
                label: `${name ? `${name} (${party})` : party} | Broker`
            }
        })

    const exchangeProviders = useContractQuery(ExchangeParticipant)
        .map(exchParticipant => {
            const party = exchParticipant.contractData.exchange;
            const name = exchangeMap.get(party)?.name;
            return {
                party,
                label: `${name ? `${name} (${party})` : party} | Exchange`
            }
        });

    const allProviders = [
        ...allCustodianRelationships.map(relationship => {
            const party = relationship.contractData.custodian;
            const name = custodianMap.get(party)?.name;
            return {
                party,
                label: `${name ? `${name} (${party})` : party} | Custodian`
            }
        }),
        ...exchangeProviders,
        ...brokerProviders,
    ];

    const topMenuButtons: ITopMenuButtonInfo[] = role === MarketRole.InvestorRole ?
        [{
            label: 'Withdraw',
            onClick: () => history.push(`${url}/withdraw`),
            disabled: allDeposits.length === 0
        },
        {
            label: 'Deposit',
            onClick: () => history.push(`${url}/deposit`)
        }]
    : []

    return (
        <Switch>
            <Route exact path={path}>
                <Page
                    sideNav={sideNav}
                    menuTitle={<><WalletIcon size='24'/>Wallet</>}
                    onLogout={onLogout}
                    topMenuButtons={topMenuButtons}
                    >
                    <PageSection>
                        <div className='wallet'>
                            <Holdings
                                deposits={allDeposits}
                                providers={allProviders}
                                role={MarketRole.InvestorRole}/>
                        </div>
                    </PageSection>
                </Page>
            </Route>
            <Route path={`${path}/withdraw`}>
                <WalletTransaction
                    sideNav={sideNav}
                    onLogout={onLogout}
                    deposits={allDeposits}
                    providers={allProviders}
                    transactionType='Withdraw'/>
            </Route>
            <Route path={`${path}/deposit`}>
                <WalletTransaction
                    sideNav={sideNav}
                    onLogout={onLogout}
                    transactionType='Deposit'/>
            </Route>
        </Switch>
    )
}

export default Wallet;
