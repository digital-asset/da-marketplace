import React, { useState } from 'react'
import { Button } from 'semantic-ui-react'

import { useParty, useLedger, useStreamQueries } from '@daml/react'
import { useStreamQueryAsPublic } from '@daml/dabl-react'
import { Broker } from '@daml.js/da-marketplace/lib/Marketplace/Broker'
import { CustodianRelationshipRequest } from '@daml.js/da-marketplace/lib/Marketplace/Custodian'
import { Exchange } from '@daml.js/da-marketplace/lib/Marketplace/Exchange'
import { Issuer } from '@daml.js/da-marketplace/lib/Marketplace/Issuer'
import { Investor } from '@daml.js/da-marketplace/lib/Marketplace/Investor'
import { MarketRole } from '@daml.js/da-marketplace/lib/Marketplace/Utils'
import { RegisteredCustodian } from '@daml.js/da-marketplace/lib/Marketplace/Registry'

import { useOperator } from './common'
import { wrapDamlTuple, CustodianRelationshipInfo, makeContractInfo } from './damlTypes'

import { AddPlusIcon } from '../../icons/Icons'

import AddRegisteredPartyModal from './AddRegisteredPartyModal'

type Props = {
    role: MarketRole;
    custodianRelationships: CustodianRelationshipInfo[];
}

const RequestCustodianRelationship: React.FC<Props> = ({ role, custodianRelationships }) => {
    const [ showAddRelationshipModal, setShowAddRelationshipModal ] = useState(false);

    const ledger = useLedger();
    const party = useParty();
    const operator = useOperator();

    const requestCustodians = useStreamQueries(CustodianRelationshipRequest, () => [], [], (e) => {
        console.log("Unexpected close from custodianRelationshipRequest: ", e);
    }).contracts.map(cr => cr.payload.custodian);
    const relationshipCustodians = custodianRelationships.map(cr => cr.contractData.custodian);

    const registeredCustodians = useStreamQueryAsPublic(RegisteredCustodian).contracts
        .map(makeContractInfo)
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
            <Button
                disabled={partyOptions.length === 0}
                className='profile-link add-relationship'
                onClick={()=> setShowAddRelationshipModal(true)}>
                    <AddPlusIcon/> <a>Add Custodian</a>
                    {partyOptions.length === 0 && <i className='disabled'>All registered custodians have been added</i>}
            </Button>
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
