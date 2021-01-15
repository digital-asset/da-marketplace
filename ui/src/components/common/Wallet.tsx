import React from 'react'

import { Switch, Route, useRouteMatch, useHistory } from 'react-router-dom'

import { Header } from 'semantic-ui-react'

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

const Wallet = (props: {
    sideNav: React.ReactElement;
    onLogout: () => void;
    role: MarketRole;
}) => {
    const history = useHistory()
    const { path, url } = useRouteMatch();
    const { brokerMap, custodianMap, exchangeMap } = useRegistryLookup();

    const { sideNav, onLogout, role } = props

    const allDeposits = useStreamQueries(AssetDeposit, () => [], [], (e) => {
        console.log("Unexpected close from assetDeposit: ", e);
    }).contracts.map(makeContractInfo);

    const allCustodianRelationships = useStreamQueries(CustodianRelationship, () => [], [], (e) => {
        console.log("Unexpected close from custodianRelationship: ", e);
    }).contracts.map(makeContractInfo);

    const brokerProviders = useStreamQueries(BrokerCustomer, () => [], [], (e) => {
        console.log("Unexpected close from brokerCustomer: ", e);
    }).contracts
        .map(broker => {
            const party = broker.payload.broker;
            const name = brokerMap.get(damlTupleToString(broker.key))?.name;
            return {
                party,
                label: `${name ? `${name} (${party})` : party} | Broker`
            }
        })

    const exchangeProviders = useStreamQueries(ExchangeParticipant, () => [], [], (e) => {
        console.log("Unexpected close from exchangeParticipant: ", e);
    }).contracts
        .map(exchParticipant => {
            const party = exchParticipant.payload.exchange;
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
            onClick: () => history.push(`${url}/withdraw`)
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
                    menuTitle={<><WalletIcon/>Wallet</>}
                    onLogout={onLogout}
                    topMenuButtons={topMenuButtons}
                    >
                    <PageSection border='blue' background='grey'>
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
