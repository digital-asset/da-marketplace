import React from 'react'

import { Switch, Route, useRouteMatch, useHistory } from 'react-router-dom'

import { CCPCustomer } from '@daml.js/da-marketplace/lib/Marketplace/CentralCounterpartyCustomer'
import { ExchangeParticipant } from '@daml.js/da-marketplace/lib/Marketplace/ExchangeParticipant'
import { CustodianRelationship } from '@daml.js/da-marketplace/lib/Marketplace/Custodian'
import { BrokerCustomer } from '@daml.js/da-marketplace/lib/Marketplace/BrokerCustomer'
import { AssetDeposit } from '@daml.js/da-marketplace/lib/DA/Finance/Asset'
import { MarketRole } from '@daml.js/da-marketplace/lib/Marketplace/Utils'

import { WalletIcon } from '../../icons/Icons'
import { useContractQuery } from '../../websocket/queryStream'

import { damlTupleToString } from './damlTypes'
import { useRegistryLookup } from './RegistryLookup'
import { ITopMenuButtonInfo } from './TopMenu'
import WalletTransaction from './WalletTransaction'
import PageSection from './PageSection'
import Holdings from './Holdings'
import Page from './Page'

const Wallet = (props: {
    sideNav: React.ReactElement;
    onLogout: () => void;
    role: MarketRole;
    showNotificationAlert?: boolean;
    handleNotificationAlert?: () => void;
}) => {
    const history = useHistory()
    const { path, url } = useRouteMatch();
    const { brokerMap, custodianMap, exchangeMap, ccpMap } = useRegistryLookup();

    const { sideNav, onLogout, role, showNotificationAlert, handleNotificationAlert } = props

    const allDeposits = useContractQuery(AssetDeposit);

    const ccpCustomers = useContractQuery(CCPCustomer);
    const marginDepositsCids = ccpCustomers
        .flatMap(ccpCustomer => {
            return ccpCustomer.contractData.marginDepositCids
        });

    const marginDeposits = allDeposits
        .filter(deposit => marginDepositsCids.includes(deposit.contractId));

    const nonMarginDeposits = allDeposits
        .filter(deposit => !marginDepositsCids.includes(deposit.contractId));

    const clearingDeposits = nonMarginDeposits
        .filter(deposit => {
            return ccpCustomers.find(c =>{return c.contractData.ccp === deposit.contractData.account.provider})
        });

    const allOtherDeposits = nonMarginDeposits
        .filter(deposit => !clearingDeposits.includes(deposit));

    const allCustodianRelationships = useContractQuery(CustodianRelationship);

    const brokerProviders = useContractQuery(BrokerCustomer)
        .map(broker => {
            const party = broker.contractData.broker;
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

    const ccpProviders = useContractQuery(CCPCustomer)
        .map(ccpCustomer => {
            const party = ccpCustomer.contractData.ccp
            const name = ccpMap.get(party)?.name;
            return {
                party,
                label: `${name ? `${name} (${party})` : party} | CCP`
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
        ...ccpProviders
    ];

    const topMenuButtons: ITopMenuButtonInfo[] = role === MarketRole.InvestorRole ?
        [{
            label: 'Withdraw',
            onClick: () => history.push(`${url}/withdraw`),
            disabled: allOtherDeposits.length === 0
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
                    showNotificationAlert={showNotificationAlert}
                    handleNotificationAlert={handleNotificationAlert}
                    >
                    <PageSection>
                        <div className='wallet'>
                            <Holdings
                                deposits={allOtherDeposits}
                                providers={allProviders}
                                role={MarketRole.InvestorRole}
                                clearingDeposits={clearingDeposits}
                                marginDeposits={marginDeposits}/>
                        </div>
                    </PageSection>
                </Page>
            </Route>
            <Route path={`${path}/withdraw`}>
                <WalletTransaction
                    sideNav={sideNav}
                    onLogout={onLogout}
                    deposits={nonMarginDeposits}
                    transactionType='Withdraw'
                    showNotificationAlert={showNotificationAlert}
                    handleNotificationAlert={handleNotificationAlert}/>
            </Route>
            <Route path={`${path}/deposit`}>
                <WalletTransaction
                    sideNav={sideNav}
                    onLogout={onLogout}
                    transactionType='Deposit'
                    showNotificationAlert={showNotificationAlert}
                    handleNotificationAlert={handleNotificationAlert}/>
            </Route>
        </Switch>
    )
}

export default Wallet;
