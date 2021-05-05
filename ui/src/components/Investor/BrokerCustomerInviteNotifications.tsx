import React from 'react'

import {useLedger} from '@daml/react'
import {ContractId} from '@daml/types'

import {BrokerCustomerInvitation} from '@daml.js/da-marketplace/lib/Marketplace/BrokerCustomer'

import {BrokerCustomerInviteInfo} from '../common/damlTypes'
import {useRegistryLookup} from '../common/RegistryLookup'
import {useContractQuery} from '../../websocket/queryStream'
import AcceptRejectNotification from '../common/AcceptRejectNotification'

type BrokerCustomerInviteProps = {
    invite: BrokerCustomerInviteInfo;
    invitationAccept: () => Promise<void>;
    invitationReject: () => Promise<void>;
}

export const useBrokerCustomerInviteNotifications = () => {
    const ledger = useLedger();
    const brokerCustomerInviteNotifications = useContractQuery(BrokerCustomerInvitation)
        .map(invite => <BrokerCustomerInvite key={invite.contractId}
            invite={invite}
            invitationAccept={async () => await acceptBrokerCustomerInvite(invite.contractId)}
            invitationReject={async () => await rejectBrokerCustomerInvite(invite.contractId)}/>);

    const acceptBrokerCustomerInvite = async (cid: ContractId<BrokerCustomerInvitation>) => {
        const choice = BrokerCustomerInvitation.BrokerCustomerInvitation_Accept;
        await ledger.exercise(choice, cid, {});
    }

    const rejectBrokerCustomerInvite = async (cid: ContractId<BrokerCustomerInvitation>) => {
        const choice = BrokerCustomerInvitation.BrokerCustomerInvitation_Reject;
        await ledger.exercise(choice, cid, {});
    }

    return brokerCustomerInviteNotifications;
}

const BrokerCustomerInvite: React.FC<BrokerCustomerInviteProps> = ({
    invite,
    invitationAccept,
    invitationReject
}) => {
    const { brokerMap } = useRegistryLookup();
    const name = brokerMap.get(invite.contractData.broker)?.name || invite.contractData.broker;
    return (
        <AcceptRejectNotification onAccept={invitationAccept} onReject={invitationReject}>
            <p>Broker <b>@{name}</b> is inviting you to become a customer.</p>
        </AcceptRejectNotification>
    )
}
