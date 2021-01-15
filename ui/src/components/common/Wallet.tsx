import React from 'react'
import { useStreamQueries } from '@daml/react'

import { AssetDeposit } from '@daml.js/da-marketplace/lib/DA/Finance/Asset'
import { BrokerCustomer } from '@daml.js/da-marketplace/lib/Marketplace/BrokerCustomer'
import { ExchangeParticipant } from '@daml.js/da-marketplace/lib/Marketplace/ExchangeParticipant'
import { CustodianRelationship } from '@daml.js/da-marketplace/lib/Marketplace/Custodian'
import { MarketRole } from '@daml.js/da-marketplace/lib/Marketplace/Utils'

import { WalletIcon } from '../../icons/Icons'

import { damlTupleToString, makeContractInfo } from '../common/damlTypes'
import { useRegistryLookup } from '../common/RegistryLookup'
import Holdings from '../common/Holdings'
import PageSection from '../common/PageSection'
import Page from '../common/Page'

const Wallet = (props: {
    sideNav: React.ReactElement;
    onLogout: () => void;
}) => {

    const { sideNav, onLogout } = props
    const { brokerMap, custodianMap, exchangeMap } = useRegistryLookup();

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

    return (
        <Page
        sideNav={sideNav}
        menuTitle={<><WalletIcon size='24'/>Wallet</>}
        onLogout={onLogout}
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
    )
}

export default Wallet;
