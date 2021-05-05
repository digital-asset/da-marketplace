import React from 'react'

import {useLedger} from '@daml/react'
import {ContractId} from '@daml/types'
import {CCPCustomerInvitation} from '@daml.js/da-marketplace/lib/Marketplace/CentralCounterpartyCustomer'

import {CCPCustomerInviteInfo} from '../common/damlTypes'
import {useRegistryLookup} from '../common/RegistryLookup'
import {useContractQuery} from '../../websocket/queryStream'
import AcceptRejectNotification from '../common/AcceptRejectNotification'

type CCPCustomerInviteProps = {
    invite: CCPCustomerInviteInfo;
    invitationAccept: () => Promise<void>;
    invitationReject: () => Promise<void>;
}

export const useCCPCustomerInviteNotifications = () => {
    const ledger = useLedger();
    const ccpCustomerInviteNotifications = useContractQuery(CCPCustomerInvitation)
        .map(invite => <CCPCustomerInvite key={invite.contractId}
            invite={invite}
            invitationAccept={async () => await acceptExchParticipantInvite(invite.contractId)}
            invitationReject={async () => await rejectExchParticipantInvite(invite.contractId)}/>);

    const acceptExchParticipantInvite = async (cid: ContractId<CCPCustomerInvitation>) => {
        const choice = CCPCustomerInvitation.CCPCustomerInvitation_Accept;
        await ledger.exercise(choice, cid, {});
    }

    const rejectExchParticipantInvite = async (cid: ContractId<CCPCustomerInvitation>) => {
        const choice = CCPCustomerInvitation.CCPCustomerInvitation_Reject;
        await ledger.exercise(choice, cid, {});
    }

    return ccpCustomerInviteNotifications;
}

const CCPCustomerInvite: React.FC<CCPCustomerInviteProps> = ({
    invite,
    invitationAccept,
    invitationReject
}) => {
    const { ccpMap } = useRegistryLookup();
    const name = ccpMap.get(invite.contractData.ccp)?.name || invite.contractData.ccp;
    return (
        <AcceptRejectNotification onAccept={invitationAccept} onReject={invitationReject}>
           <p>CCP <b>@{name}</b> is inviting you to become a clearing member.</p>
        </AcceptRejectNotification>
    )
}
