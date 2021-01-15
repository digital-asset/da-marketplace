import React, { useState } from 'react'
import { Button, Form } from 'semantic-ui-react'

import { useParty, useLedger } from '@daml/react'
import { Exchange } from '@daml.js/da-marketplace/lib/Marketplace/Exchange'

import { wrapDamlTuple, RegisteredInvestorInfo } from '../common/damlTypes'
import { useOperator } from '../common/common'
import FormErrorHandled from '../common/FormErrorHandled'
import ContractSelect from '../common/ContractSelect'

type Props = {
    registeredInvestors: RegisteredInvestorInfo[];
}

const InviteParticipant: React.FC<Props> = ({ registeredInvestors }) => {
    const [ exchParticipant, setExchParticipant ] = useState('');

    const ledger = useLedger();
    const exchange = useParty();
    const operator = useOperator();

    const handleExchParticipantInviteSubmit = async () => {
        const choice = Exchange.Exchange_InviteParticipant;
        const key = wrapDamlTuple([operator, exchange]);
        const args = { exchParticipant };

        await ledger.exerciseByKey(choice, key, args);
        setExchParticipant('');
    }

    return (
        <FormErrorHandled onSubmit={handleExchParticipantInviteSubmit}>
            <Form.Group>
                <ContractSelect
                    allowAdditions
                    clearable
                    search
                    selection
                    contracts={registeredInvestors}
                    placeholder='Investor party ID'
                    value={exchParticipant}
                    getOptionText={ri => ri.contractData.name}
                    setContract={ri => setExchParticipant(ri.contractData.investor)}
                    setAddition={privateInvestorId => setExchParticipant(privateInvestorId)}/>

                <Button
                    content='Invite'
                    className='invite-investor ghost'
                    disabled={!exchParticipant}/>
            </Form.Group>
        </FormErrorHandled>
    )
}

export default InviteParticipant;
