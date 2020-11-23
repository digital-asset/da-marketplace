import React from 'react'

import { useLedger, useStreamQueries } from '@daml/react'
import { ContractId } from '@daml/types'
import { BrokerCustomerInvitation } from '@daml.js/da-marketplace/lib/Marketplace/BrokerCustomer'

import AcceptRejectNotification from '../common/AcceptRejectNotification'
import { BrokerCustomerInviteInfo, makeContractInfo } from '../common/damlTypes'
import { useRegistryLookup } from '../common/RegistryLookup'

type BrokerCustomerInviteProps = {
    invite: BrokerCustomerInviteInfo;
    invitationAccept: () => Promise<void>;
    invitationReject: () => Promise<void>;
}

export const useBrokerCustomerInviteNotifications = () => {
    const ledger = useLedger();
    const brokerCustomerInviteNotifications = useStreamQueries(BrokerCustomerInvitation, () => [], [], (e) => {
        console.log("Unexpected close from brokerCustomerInvitation: ", e);
    })
        .contracts
        .map(invite => <BrokerCustomerInvite key={invite.contractId}
            invite={makeContractInfo(invite)}
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
            Broker <b>@{name}</b> is inviting you to become a customer.
        </AcceptRejectNotification>
    )
}
