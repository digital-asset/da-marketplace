import React, { useState } from 'react'
import { Button, Form } from 'semantic-ui-react'

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
import FormErrorHandled from './FormErrorHandled'
import ContractSelect from './ContractSelect'

type Props = {
    role: MarketRole;
    custodianRelationships: CustodianRelationshipInfo[];
}

const RequestCustodianRelationship: React.FC<Props> = ({ role, custodianRelationships }) => {
    const [ custodianId, setCustodianId ] = useState('');
    const ledger = useLedger();
    const party = useParty();
    const operator = useOperator();

    const requestCustodians = useContractQuery(CustodianRelationshipRequest).map(cr => cr.contractData.custodian);
    const relationshipCustodians = custodianRelationships.map(cr => cr.contractData.custodian);

    const registeredCustodians = useContractQuery(RegisteredCustodian, AS_PUBLIC)
        .filter(custodian =>
            !requestCustodians.includes(custodian.contractData.custodian) &&
            !relationshipCustodians.includes(custodian.contractData.custodian));

    const requestCustodianRelationship = async () => {
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
        setCustodianId('');
    }

    return (
        <FormErrorHandled onSubmit={requestCustodianRelationship}>
            <Form.Group className='inline-form-group'>
                <ContractSelect
                    label='Request a relationship:'
                    allowAdditions
                    className='custodian-select-container'
                    clearable
                    search
                    selection
                    contracts={registeredCustodians}
                    placeholder='Custodian ID'
                    value={custodianId}
                    getOptionText={rc => rc.contractData.name}
                    setContract={ri => setCustodianId(ri ? ri.contractData.custodian : '')}
                    setAddition={privateCustodianId => setCustodianId(privateCustodianId)}/>

                <Button className='ghost' content='Send Request' disabled={!custodianId}/>
            </Form.Group>
        </FormErrorHandled>
    )
}

export default RequestCustodianRelationship;
