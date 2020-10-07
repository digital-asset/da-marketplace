import React from 'react'
import { Button, Form } from 'semantic-ui-react'

import { useLedger, useStreamQuery } from '@daml/react'
import { ContractId } from '@daml/types'
import { ExchangeParticipantInvitation } from '@daml.js/da-marketplace/lib/Marketplace/ExchangeParticipant'

import Notification from '../common/Notification'
import FormErrorHandled from '../common/FormErrorHandled'
import { ExchParticipantInviteInfo, makeContractInfo } from '../common/damlTypes'

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
            invite={makeContractInfo(invite)}
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
}) => (
    <Notification>
        <p>Exchange <b>@{invite.contractData.exchange}</b> is inviting you to trade.</p>
        <FormErrorHandled onSubmit={invitationAccept}>
            { loadAndCatch =>
                <Form.Group className='inline-form-group'>
                    <Button basic content='Accept' type='submit'/>
                    <Button
                        basic
                        content='Reject'
                        type='button'
                        onClick={() => loadAndCatch(invitationReject)}/>
                </Form.Group>
            }
        </FormErrorHandled>
    </Notification>
)
