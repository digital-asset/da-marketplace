import React, { useState } from 'react'
import { Button, Form } from 'semantic-ui-react'

import { useParty, useLedger } from '@daml/react'
import { useWellKnownParties } from '@daml/dabl-react'
import { Broker } from '@daml.js/da-marketplace/lib/Marketplace/Broker'
import { Issuer } from '@daml.js/da-marketplace/lib/Marketplace/Issuer'
import { Investor } from '@daml.js/da-marketplace/lib/Marketplace/Investor'
import { Exchange } from '@daml.js/da-marketplace/lib/Marketplace/Exchange'
import { MarketRole } from '@daml.js/da-marketplace/lib/Marketplace/Utils'

import { wrapDamlTuple } from './damlTypes'
import { parseError, ErrorMessage } from './errorTypes'
import FormErrorHandled from './FormErrorHandled'

type Props = {
    role: MarketRole;
}

const RequestCustodianRelationship: React.FC<Props> = ({ role }) => {
    const ledger = useLedger();
    const party = useParty();
    const operator = useWellKnownParties().userAdminParty;

    const [ loading, setLoading ] = useState(false);
    const [ error, setError ] = useState<ErrorMessage>();
    const [ custodianId, setCustodianId ] = useState('');

    const requestCustodianRelationship = async (custodian: string) => {
        const key = wrapDamlTuple([operator, party]);
        const args = { custodian };

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

    return (
        <FormErrorHandled
            loading={loading}
            error={error}
            clearError={() => setError(undefined)}
            onSubmit={async () => {
                setLoading(true);
                try {
                    await requestCustodianRelationship(custodianId);
                } catch (err) {
                    setError(parseError(err));
                }
                setLoading(false);
            }}
        >
            <Form.Group className='inline-form-group'>
                <Form.Input
                    label='Custodian'
                    placeholder='Enter ID'
                    onChange={e => setCustodianId(e.currentTarget.value)}/>
                <Button basic content='Send Request'/>
            </Form.Group>
        </FormErrorHandled>
    )
}

export default RequestCustodianRelationship;
