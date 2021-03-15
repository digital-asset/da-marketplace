import React from 'react'

import { useLedger } from '@daml/react'
import { ContractId } from '@daml/types'
import { ExchangeParticipantInvitation } from '@daml.js/da-marketplace/lib/Marketplace/ExchangeParticipant'

import { ExchParticipantInviteInfo } from '../common/damlTypes'
import { useRegistryLookup } from '../common/RegistryLookup'
import { useContractQuery } from '../../websocket/queryStream'
import AcceptRejectNotification from '../common/AcceptRejectNotification'

type ExchParticipantInviteProps = {
    invite: ExchParticipantInviteInfo;
    invitationAccept: () => Promise<void>;
    invitationReject: () => Promise<void>;
}

export const useExchangeInviteNotifications = () => {
    const ledger = useLedger();
    const exchangeInviteNotifications = useContractQuery(ExchangeParticipantInvitation)
        .map(invite => <ExchangeParticipantInvite key={invite.contractId}
            invite={invite}
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
    const { exchangeMap } = useRegistryLookup();
    const name = exchangeMap.get(invite.contractData.exchange)?.name || invite.contractData.exchange;
    return (
        <AcceptRejectNotification onAccept={invitationAccept} onReject={invitationReject}>
           <p>Exchange <b>@{name}</b> is inviting you to trade.</p>
        </AcceptRejectNotification>
    )
}
