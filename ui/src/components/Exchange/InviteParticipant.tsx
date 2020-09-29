import React, { useState } from 'react'
import { Button, Form } from 'semantic-ui-react'

import { useParty, useLedger } from '@daml/react'
import { useWellKnownParties } from '@daml/dabl-react'
import { Exchange } from '@daml.js/da-marketplace/lib/Marketplace/Exchange'

import { wrapDamlTuple, RegisteredInvestorInfo } from '../common/damlTypes'
import { parseError, ErrorMessage } from '../common/errorTypes'
import FormErrorHandled from '../common/FormErrorHandled'
import ContractSelect from '../common/ContractSelect'

type Props = {
    registeredInvestors: RegisteredInvestorInfo[];
}

const InviteParticipant: React.FC<Props> = ({ registeredInvestors }) => {
    const [ loading, setLoading ] = useState(false);
    const [ error, setError ] = useState<ErrorMessage>();
    const [ exchParticipant, setExchParticipant ] = useState('');

    const ledger = useLedger();
    const exchange = useParty();
    const operator = useWellKnownParties().userAdminParty;

    const clearForm = () => {
        setLoading(false);
        setExchParticipant('');
    }

    const handleExchParticipantInviteSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        try {
            const key = wrapDamlTuple([operator, exchange]);
            const args = {
                exchParticipant
            };

            await ledger.exerciseByKey(Exchange.Exchange_InviteParticipant, key, args);
            clearForm();
        } catch (err) {
            setError(parseError(err));
        }
        setLoading(false);
    }

    return (
        <FormErrorHandled
            loading={loading}
            error={error}
            clearError={() => setError(undefined)}
            onSubmit={handleExchParticipantInviteSubmit}
        >
            <Form.Group>
                <ContractSelect
                    allowAdditions
                    clearable
                    search
                    selection
                    contracts={registeredInvestors}
                    placeholder='Investor party ID'
                    getOptionText={ri => ri.contractData.investor}
                    setContract={ri => setExchParticipant(ri ? ri.contractData.investor : '')}
                    setAddition={privateInvestorId => setExchParticipant(privateInvestorId)}/>

                <Button
                    content='Invite'
                    className='invite-investor'
                    disabled={!exchParticipant}/>
            </Form.Group>
        </FormErrorHandled>
    )
}

export default InviteParticipant;
