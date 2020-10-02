import React, { useState } from 'react'
import { Button, Form } from 'semantic-ui-react'

import { useParty, useLedger } from '@daml/react'
import { useWellKnownParties } from '@daml/dabl-react'
import { Broker } from '@daml.js/da-marketplace/lib/Marketplace/Broker'
import { Issuer } from '@daml.js/da-marketplace/lib/Marketplace/Issuer'
import { Investor } from '@daml.js/da-marketplace/lib/Marketplace/Investor'
import { Exchange } from '@daml.js/da-marketplace/lib/Marketplace/Exchange'
import { MarketRole } from '@daml.js/da-marketplace/lib/Marketplace/Utils'

import { wrapDamlTuple, RegisteredCustodianInfo } from './damlTypes'
import FormErrorHandled from './FormErrorHandled'
import ContractSelect from '../common/ContractSelect'

type Props = {
    role: MarketRole;
    registeredCustodians: RegisteredCustodianInfo[];
}

const RequestCustodianRelationship: React.FC<Props> = ({ role, registeredCustodians }) => {
    const [ custodianId, setCustodianId ] = useState('');
    const ledger = useLedger();
    const party = useParty();
    const operator = useWellKnownParties().userAdminParty;

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
                    allowAdditions
                    clearable
                    search
                    selection
                    contracts={registeredCustodians}
                    placeholder='Custodian ID'
                    value={custodianId}
                    getOptionText={rc => rc.contractData.name}
                    setContract={rc => setCustodianId(rc.contractData.custodian)}
                    setAddition={privateCustodianId => setCustodianId(privateCustodianId)}/>

                <Button className='request-custodian-relationship' content='Send' disabled={!custodianId}/>
            </Form.Group>
        </FormErrorHandled>
    )
}

export default RequestCustodianRelationship;
