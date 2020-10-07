import React from 'react'
import { Button, Form } from 'semantic-ui-react'

import { useLedger, useStreamQuery } from '@daml/react'
import { ContractId } from '@daml/types'
import { BrokerCustomerInvitation } from '@daml.js/da-marketplace/lib/Marketplace/BrokerCustomer'

import Notification from '../common/Notification'
import FormErrorHandled from '../common/FormErrorHandled'
import { BrokerCustomerInviteInfo, makeContractInfo } from '../common/damlTypes'
import {useRegistryLookup} from '../common/RegistryLookup'

type BrokerCustomerInviteProps = {
    invite: BrokerCustomerInviteInfo;
    invitationAccept: () => Promise<void>;
    invitationReject: () => Promise<void>;
}

export const useBrokerCustomerInviteNotifications = () => {
    const ledger = useLedger();
    const brokerCustomerInviteNotifications = useStreamQuery(BrokerCustomerInvitation)
        .contracts
        .map(invite => <BrokerCustomerInvite key={invite.contractId}
            invite={ makeContractInfo(invite) }
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
        <Notification>
            <p>Broker <b>@{name}</b> is inviting you to become a customer.</p>
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
}
