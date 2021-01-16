import React from 'react'

import { MarketRole } from '@daml.js/da-marketplace/lib/Marketplace/Utils'

import { CustodianRelationshipInfo } from './damlTypes'
import { useRegistryLookup } from './RegistryLookup'
import RequestCustodianRelationship from './RequestCustodianRelationship'

type Props = {
    role: MarketRole;
    custodianRelationships: CustodianRelationshipInfo[];
}

const MarketRelationships: React.FC<Props> = ({ role, custodianRelationships }) => {
    const custodianMap = useRegistryLookup().custodianMap;

    const rows = custodianRelationships.map(relationship => {
        const name = custodianMap.get(relationship.contractData.custodian)?.name;
        return <p key={relationship.contractId}>{name}</p>
    });

    return (
        <>
            <RequestCustodianRelationship role={role} custodianRelationships={custodianRelationships}/>
            {rows}
        </>
    )
}

export default MarketRelationships;
