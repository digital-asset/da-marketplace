import React, { useState } from 'react'
import { useStreamQueries } from '@daml/react'
import { Button } from 'semantic-ui-react'

import { AssetDeposit } from '@daml.js/da-marketplace/lib/DA/Finance/Asset'
import { BrokerCustomer } from '@daml.js/da-marketplace/lib/Marketplace/BrokerCustomer'
import { ExchangeParticipant } from '@daml.js/da-marketplace/lib/Marketplace/ExchangeParticipant'
import { CustodianRelationship } from '@daml.js/da-marketplace/lib/Marketplace/Custodian'
import { MarketRole } from '@daml.js/da-marketplace/lib/Marketplace/Utils'

import { WalletIcon } from '../../icons/Icons'

import { damlTupleToString, makeContractInfo, ContractInfo } from '../common/damlTypes'
import DonutChart, { IDonutChartData, donutChartColors } from '../common/DonutChart';
import { useRegistryLookup } from '../common/RegistryLookup'
import Holdings from '../common/Holdings'
import PageSection from '../common/PageSection'
import Page from '../common/Page'
import TabViewer, { DivTab } from '../common/TabViewer';

const Wallet = (props: {
    sideNav: React.ReactElement;
    onLogout: () => void;
}) => {

    const { sideNav, onLogout } = props
    const { brokerMap, custodianMap, exchangeMap } = useRegistryLookup();

    const tabItems = [
        { id: 'allocations', label: 'Allocations' }
    ]

    const [ currentTabId, setCurrentTabId ] = useState(tabItems[0].id)

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
    const topMenuButtons = [
        <Button >
            Withdraw
        </Button>,
        <Button >
            Withdraw
        </Button>
    ]

    return (
        <Page
        sideNav={sideNav}
        menuTitle={<><WalletIcon/>Wallet</>}
        onLogout={onLogout}
        topMenuButtons={[]}
        >
        <PageSection border='blue' background='grey'>
            <div className='wallet'>
                <Holdings
                    deposits={allDeposits}
                    providers={allProviders}
                    role={MarketRole.InvestorRole}/>
                <TabViewer
                    currentId={currentTabId}
                    items={tabItems}
                    Tab={props => DivTab(props, handleTabChange)}>
                    { currentTabId === 'allocations' &&
                        <Allocations allDeposits={allDeposits}/> }
                </TabViewer>
            </div>
        </PageSection>
    </Page>
    )
}

const Allocations = (props: {
    allDeposits: ContractInfo<AssetDeposit>[]
}) => {
    const tokenOptions = netTokenDeposits(props.allDeposits)

    return (
        <div className='allocations'>
            <DonutChart data={tokenOptions}/>
        </div>
    )
}

function netTokenDeposits(tokenDeposits: ContractInfo<AssetDeposit>[]): IDonutChartData[] {
    let netTokenDeposits: IDonutChartData[]  = []

    tokenDeposits.forEach(deposit => {
        const { asset } = deposit.contractData
        const token = netTokenDeposits.find(d => d.title === asset.id.label)
        const index = tokenDeposits.indexOf(deposit)

        if (token) {
            return token.value += Number(asset.quantity)
        }

        return netTokenDeposits = [
            ...netTokenDeposits,
            {
                title: asset.id.label,
                value: Number(asset.quantity),
                color: donutChartColors[index % donutChartColors.length]
            }
        ]
    })

    return netTokenDeposits
}

export default Wallet;
