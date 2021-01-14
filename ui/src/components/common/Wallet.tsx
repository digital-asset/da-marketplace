import React, { useState } from 'react'
import { useStreamQueries } from '@daml/react'
import { Switch, Route, useRouteMatch } from 'react-router-dom'
import { useHistory } from 'react-router-dom'

import { AssetDeposit } from '@daml.js/da-marketplace/lib/DA/Finance/Asset'
import { BrokerCustomer } from '@daml.js/da-marketplace/lib/Marketplace/BrokerCustomer'
import { ExchangeParticipant } from '@daml.js/da-marketplace/lib/Marketplace/ExchangeParticipant'
import { CustodianRelationship } from '@daml.js/da-marketplace/lib/Marketplace/Custodian'
import { MarketRole } from '@daml.js/da-marketplace/lib/Marketplace/Utils'

import { AddPlusIcon, WalletIcon } from '../../icons/Icons'

import { damlTupleToString, makeContractInfo, ContractInfo } from '../common/damlTypes'
import DonutChart, { IDonutChartData, donutChartColors } from '../common/DonutChart';
import { useRegistryLookup } from '../common/RegistryLookup'
import Holdings from '../common/Holdings'
import PageSection from '../common/PageSection'
import Page from '../common/Page'
import TabViewer, { DivTab } from '../common/TabViewer';

import { ITopMenuButtonInfo } from './TopMenu'

import WalletTransaction from './WalletTransaction';
import { Form } from 'semantic-ui-react'


const Wallet = (props: {
    sideNav: React.ReactElement;
    onLogout: () => void;
}) => {
    const { path, url } = useRouteMatch();
    const history = useHistory()

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

    const topMenuButtons: ITopMenuButtonInfo[] = [
        {label: 'Withdraw', onClick: () => history.push(`${url}/withdraw`)},
        {label: 'Deposit', onClick: () => history.push(`${url}/deposit`)}
    ]

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
            </Route>
            <Route path={`${path}/withdraw`}>
                <WalletTransaction
                    sideNav={sideNav}
                    onLogout={onLogout}
                    onSubmit={() => onRequestWithdraw()}
                    transactionType='Withdraw'
                    baseUrl={url}>
                </WalletTransaction>
            </Route>
            <Route path={`${path}/deposit`}>
                <WalletTransaction
                    sideNav={sideNav}
                    onLogout={onLogout}
                    transactionType='Deposit'
                    onSubmit={() => onRequestDeposit()}
                    baseUrl={url}>
                    <div className='transaction-step'>
                        <div className='step-title'>
                          Select Payment Method
                            <a>
                                <AddPlusIcon/> Add New Payment Method
                            </a>
                        </div>
                    </div>
                    ??
                    <div className='transaction-step'>
                    <div>
                        Amount
                    </div>
                    <Form.Input>

                    </Form.Input>
                    </div>
                    </WalletTransaction>
            </Route>
        </Switch>
    )

    function onRequestWithdraw() {

    }

    function onRequestDeposit() {
        
    }
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
