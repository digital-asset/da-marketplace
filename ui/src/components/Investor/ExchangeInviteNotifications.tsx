import React, { useState } from 'react'
import { Button, Form } from 'semantic-ui-react'

import { useLedger, useStreamQuery } from '@daml/react'
import { ContractId } from '@daml/types'
import { ExchangeParticipantInvitation } from '@daml.js/da-marketplace/lib/Marketplace/ExchangeParticipant'

import Notification from '../common/Notification'
import FormErrorHandled from '../common/FormErrorHandled'
import { parseError, ErrorMessage } from '../common/errorTypes'
import { ExchParticipantInviteInfo } from '../common/damlTypes'

type ExchParticipantInviteProps = {
    invite: ExchParticipantInviteInfo;
    invitationAccept: () => Promise<void>;
    invitationReject: () => Promise<void>;
}

export const useExchangeInviteNotifications = () => {
    const ledger = useLedger();
    const exchangeInviteNotifications = useStreamQuery(ExchangeParticipantInvitation)
        .contracts
        .map(invite => <ExchangeParticipantInvite key={invite.contractId}
            invite={{ contractId: invite.contractId, contractData: invite.payload }}
            invitationAccept={async () => await acceptExchParticipantInvite(invite.contractId)}
            invitationReject={async () => await rejectExchParticipantInvite(invite.contractId)}/>);

    const acceptExchParticipantInvite = async (cid: ContractId<ExchangeParticipantInvitation>) => {
        const choice = ExchangeParticipantInvitation.ExchangeParticipantInvitation_Accept;
        await ledger.exercise(choice, cid, {});
    }

    const rejectExchParticipantInvite = async (cid: ContractId<ExchangeParticipantInvitation>) => {
        const choice = ExchangeParticipantInvitation.ExchangeParticipantInvitation_Reject;
        await ledger.exercise(choice, cid, {});
    }

    return exchangeInviteNotifications;
}

const ExchangeParticipantInvite: React.FC<ExchParticipantInviteProps> = ({
    invite,
    invitationAccept,
    invitationReject
}) => {
    const [ loading, setLoading ] = useState(false);
    const [ error, setError ] = useState<ErrorMessage>();

    const acceptExchParticipantInvite = async () => {
        setLoading(true);
        try {
            await invitationAccept();
        } catch(err) {
            setError(parseError(err));
        }
        setLoading(false);
    }

    const rejectExchParticipantInvite = async () => {
        setLoading(true);
        try {
            await invitationReject();
        } catch(err) {
            setError(parseError(err));
        }
        setLoading(false);
    }

    return (
        <Notification>
            <p>Exchange <b>@{invite.contractData.exchange}</b> is inviting you to trade.</p>
            <FormErrorHandled loading={loading} error={error} clearError={() => setError(undefined)}>
                <Form.Group className='inline-form-group'>
                    <Button basic onClick={() => acceptExchParticipantInvite()}>Accept</Button>
                    <Button basic onClick={() => rejectExchParticipantInvite()}>Reject</Button>
                </Form.Group>
            </FormErrorHandled>
        </Notification>
    )
}
