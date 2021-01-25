import React from 'react'

import { Header } from 'semantic-ui-react'
import { useStreamQueries } from '@daml/react'

import { MarketRole } from '@daml.js/da-marketplace/lib/Marketplace/Utils'
import { RegisteredInvestor } from '@daml.js/da-marketplace/lib/Marketplace/Registry'
import { ExchangeParticipant } from '@daml.js/da-marketplace/lib/Marketplace/ExchangeParticipant'

import { getAbbreviation } from '../common/utils';

import { CustodianRelationshipInfo, ContractInfo, makeContractInfo } from './damlTypes'

import { useRegistryLookup } from './RegistryLookup'
import RequestCustodianRelationship from './RequestCustodianRelationship'
import RequestInvestorRelationship from './RequestInvestorRelationship'

type Props = {
    role: MarketRole;
    custodianRelationships: CustodianRelationshipInfo[];
    investorOptions?: ContractInfo<RegisteredInvestor>[]
}

const MarketRelationships: React.FC<Props> = ({ role, custodianRelationships, investorOptions }) => {
    const custodianMap = useRegistryLookup().custodianMap;
    const investorMap = useRegistryLookup().investorMap;

    const custodianRows = custodianRelationships.map(relationship => {
        const custodian = custodianMap.get(relationship.contractData.custodian);

        if (!custodian) {
            return null
        }

        return <RelationshipRow
                contractId={relationship.contractId}
                name={custodian.name}
                party={custodian?.custodian}/>
    });

    const exchangeParticipants = useStreamQueries(ExchangeParticipant, () => [], [], (e) => {
        console.log("Unexpected close from exchangeParticipant: ", e);
    }).contracts.map(makeContractInfo);

    const investorRows = exchangeParticipants.map(relationship => {
        const investor = investorMap.get(relationship.contractData.exchParticipant);

        if (!investor) {
            return null
        }

        return <RelationshipRow
                contractId={relationship.contractId}
                name={investor.name}
                party={investor?.investor}/>
    });

    return (
        <div className='market-relationships'>
            <Header as='h3'>Market Relationships</Header>

            {custodianRows}
            <RequestCustodianRelationship role={role} custodianRelationships={custodianRelationships}/>

            { role == MarketRole.ExchangeRole && investorOptions &&
                <>
                    {investorRows}
                    <RequestInvestorRelationship registeredInvestors={investorOptions || []}/>
                </>
            }
        </div>
    )
}

const RelationshipRow = (props: {contractId: string, name: string, party: string }) => (
    <div className='relationship-row' key={props.contractId}>
        <div className='default-profile-icon'>
            {getAbbreviation(props.name)}
        </div>
        <div className='relationship-info'>
            <Header className='name' as='h4'>{props.name}</Header>
            <p className='p2'>{props.party}</p>
        </div>
    </div>
)

export default MarketRelationships;
