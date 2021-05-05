import React from 'react'

import {Header} from 'semantic-ui-react'

import {getAbbreviation} from '../common/utils';

import {CustodianRelationshipInfo, RelationshipRequestChoice} from './damlTypes'

import {useRegistryLookup} from './RegistryLookup'
import RequestCustodianRelationship from './RequestCustodianRelationship'

type Props = {
    relationshipRequestChoice: RelationshipRequestChoice;
    custodianRelationships: CustodianRelationshipInfo[];
}

const MarketRelationships: React.FC<Props> = ({ relationshipRequestChoice, custodianRelationships }) => {
    const custodianMap = useRegistryLookup().custodianMap;

    const rows = custodianRelationships.map(relationship => {
        const custodian = custodianMap.get(relationship.contractData.custodian);

        if (!custodian) {
            return null
        }

        return (
            <div className='relationship-row' key={relationship.contractId}>
                <div className='default-profile-icon'>
                    {getAbbreviation(custodian.name)}
                </div>
                <div className='relationship-info'>
                    <Header className='bold name' as='h3'>{custodian.name}</Header>
                    <p>{custodian?.custodian}</p>
                </div>
            </div>
        )
    });

    return (
        <div className='market-relationships'>
            <Header className='bold' as='h2'>Market Relationships</Header>
            <RequestCustodianRelationship
                relationshipRequestChoice={relationshipRequestChoice}
                custodianRelationships={custodianRelationships}/>
            {rows}
        </div>
    )
}

export default MarketRelationships;
