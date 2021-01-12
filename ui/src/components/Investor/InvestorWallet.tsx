import React, { useState } from 'react'
import { useLedger, useParty, useStreamQueries } from '@daml/react'

import { AssetDeposit } from '@daml.js/da-marketplace/lib/DA/Finance/Asset'
import { BrokerCustomer } from '@daml.js/da-marketplace/lib/Marketplace/BrokerCustomer'
import { ExchangeParticipant } from '@daml.js/da-marketplace/lib/Marketplace/ExchangeParticipant'
import { CustodianRelationship } from '@daml.js/da-marketplace/lib/Marketplace/Custodian'
import { MarketRole } from '@daml.js/da-marketplace/lib/Marketplace/Utils'

import { damlTupleToString, makeContractInfo } from '../common/damlTypes'
import { WalletIcon } from '../../icons/Icons'

import { useRegistryLookup } from '../common/RegistryLookup'
import Holdings from '../common/Holdings'
import PageSection from '../common/PageSection'
import Page from '../common/Page'
// import DonutChart, { IDonutInfo } from '../common/DonutChart'
import TabViewer, { TabElementProps } from '../common/TabViewer';

import './InvestorWallet.css';

const walletTabs =  {
    ALLOCATIONS: 'allocations',
    PASSIVE_VS_COMMITTED: 'passive_vs_commited'
}

const InvestorWallet = (props: {
    sideNav: React.ReactElement;
    onLogout: () => void;
}) => {

    const { sideNav, onLogout } = props
    const { brokerMap, custodianMap, exchangeMap } = useRegistryLookup();

    const tabItems = [
        { id: walletTabs.ALLOCATIONS, label: 'Allocations' },
        { id: walletTabs.PASSIVE_VS_COMMITTED, label: 'Passive vs. Commited' }
    ]

    const [ currentTabId, setCurrentTabId ] = useState(walletTabs.ALLOCATIONS)

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

    const handleTabChange = (tabId: string) => setCurrentTabId(tabId);

    return (
        <Page
        sideNav={sideNav}
        menuTitle={<><WalletIcon/>Wallet</>}
        onLogout={onLogout}
    >
        <PageSection border='blue' background='white'>
            <div className='investor-wallet'>
                <Holdings
                    deposits={allDeposits}
                    providers={allProviders}
                    role={MarketRole.InvestorRole}/>
                    <TabViewer
                        currentId={currentTabId}
                        items={tabItems}
                        Tab={props => DivTab(props, handleTabChange)}>
                        { currentTabId === walletTabs.ALLOCATIONS &&
                            'donut'}

                        { currentTabId === walletTabs.PASSIVE_VS_COMMITTED &&
                           'other'}
                    </TabViewer>
                {/* <DonutChart slices={[20,30,20]}/> */}
            </div>
        </PageSection>
    </Page>
    )
}

const DivTab = (
    props: TabElementProps<string>,
    handleTabChange: (tabId: string) => void
): JSX.Element => (
    <div key={props.itemId}
         className={props.className}
         onClick={() => handleTabChange(props.itemId)}
    >
        {props.children}
    </div>
);

export default InvestorWallet;
