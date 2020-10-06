import React from 'react'

import { MarketRole } from '@daml.js/da-marketplace/lib/Marketplace/Utils'

import CardTable from './CardTable'
import { CustodianRelationshipInfo } from './damlTypes'
import { useRegistryLookup } from './RegistryLookup'
import RequestCustodianRelationship from './RequestCustodianRelationship'

type Props = {
    role: MarketRole;
    custodianRelationships: CustodianRelationshipInfo[];
}

const MarketRelationships: React.FC<Props> = ({ role, custodianRelationships }) => {
    const custodianMap = useRegistryLookup().custodianMap;
    const header = ['Custodians'];
    const rows = custodianRelationships.map(relationship => {
        const name = custodianMap.get(relationship.contractData.custodian)?.name;
        return [(name || relationship.contractData.custodian)];
    }) || [];
    return (
        <>
            <CardTable
                className='market-pairs'
                header={header}
                rows={rows}/>
            <RequestCustodianRelationship role={role} custodianRelationships={custodianRelationships}/>
        </>
    )
}

export default MarketRelationships;
