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
        return <p>{name}</p>
    });
    return (
        <>
            <p><b>Custodians</b></p>
            {rows}
            <RequestCustodianRelationship role={role} custodianRelationships={custodianRelationships}/>
        </>
    )
}

export default MarketRelationships;
