import React, { useState } from 'react'

import { useParty, useLedger } from '@daml/react'

import { Broker } from '@daml.js/da-marketplace/lib/Marketplace/Broker'
import { CustodianRelationshipRequest } from '@daml.js/da-marketplace/lib/Marketplace/Custodian'
import { Exchange } from '@daml.js/da-marketplace/lib/Marketplace/Exchange'
import { Issuer } from '@daml.js/da-marketplace/lib/Marketplace/Issuer'
import { Investor } from '@daml.js/da-marketplace/lib/Marketplace/Investor'
import { MarketRole } from '@daml.js/da-marketplace/lib/Marketplace/Utils'
import { RegisteredCustodian } from '@daml.js/da-marketplace/lib/Marketplace/Registry'

import { useContractQuery, AS_PUBLIC } from '../../websocket/queryStream'

import { wrapDamlTuple, CustodianRelationshipInfo } from './damlTypes'
import { useOperator } from './common'

import AddRegisteredPartyModal from './AddRegisteredPartyModal'
import AddRelationshipTile from '../common/AddRelationshipTile'

type Props = {
    role: MarketRole;
    custodianRelationships: CustodianRelationshipInfo[];
}

const RequestCustodianRelationship: React.FC<Props> = ({ role, custodianRelationships }) => {
    const [ showAddRelationshipModal, setShowAddRelationshipModal ] = useState(false);

    const ledger = useLedger();
    const party = useParty();
    const operator = useOperator();

    const requestCustodians = useContractQuery(CustodianRelationshipRequest).map(cr => cr.contractData.custodian);
    const relationshipCustodians = custodianRelationships.map(cr => cr.contractData.custodian);

    const registeredCustodians = useContractQuery(RegisteredCustodian, AS_PUBLIC)
        .filter(custodian =>
            !requestCustodians.includes(custodian.contractData.custodian) &&
            !relationshipCustodians.includes(custodian.contractData.custodian));

    const requestCustodianRelationship = async (custodianId: string) => {
        const key = wrapDamlTuple([operator, party]);

        const args = { custodian: custodianId };

        switch(role) {
            case MarketRole.InvestorRole:
                await ledger.exerciseByKey(Investor.Investor_RequestCustodianRelationship, key, args);
                break;
            case MarketRole.IssuerRole:
                await ledger.exerciseByKey(Issuer.Issuer_RequestCustodianRelationship, key, args);
                break;
            case MarketRole.BrokerRole:
                await ledger.exerciseByKey(Broker.Broker_RequestCustodianRelationship, key, args);
                break;
            case MarketRole.ExchangeRole:
                await ledger.exerciseByKey(Exchange.Exchange_RequestCustodianRelationship, key, args);
                break;
            default:
                throw new Error(`The role '${role}' can not request a custodian relationship.`);
        }
    }

    const partyOptions = registeredCustodians.map(d => {
            return {
                text: `${d.contractData.name}`,
                value: d.contractData.custodian
            }
        })

    return (
        <>
           <AddRelationshipTile
                disabled={partyOptions.length === 0}
                disabledMessage='All registered custodians have been added'
                onClick={()=> setShowAddRelationshipModal(true)}
                label='Add Custodian'/>
            {showAddRelationshipModal &&
                <AddRegisteredPartyModal
                    title='Add Custodian'
                    partyOptions={partyOptions}
                    onRequestClose={() => setShowAddRelationshipModal(false)}
                    multiple={false}
                    onSubmit={requestCustodianRelationship}/>
            }
        </>
    )
}

export default RequestCustodianRelationship;
