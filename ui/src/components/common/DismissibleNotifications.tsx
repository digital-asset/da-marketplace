import React from 'react'
import { Button, Form } from 'semantic-ui-react'

import { useLedger, useStreamQuery, useParty } from '@daml/react'
import { ContractId } from '@daml/types'
import { MarketRole,  Notification } from '@daml.js/da-marketplace/lib/Marketplace/Utils'

import { NotificationInfo } from '../common/damlTypes'
import { useRegistryLookup } from '../common/RegistryLookup'
import NotificationComponent from '../common/Notification'
import FormErrorHandled from '../common/FormErrorHandled'

type DismissibleNotificationProps = {
    notification: NotificationInfo;
    notificationDismiss : () => Promise<void>;
}

export const useGeneralNotifications = () => {
    const ledger = useLedger();
    const party = useParty();
    const relationshipRequestNotifications = useStreamQuery(Notification)
        .contracts
        .filter(notification => notification.payload.receiver === party)
        .map(notification => <DismissibleNotification key={notification.contractId}
            notification={{ contractId: notification.contractId, contractData: notification.payload }}
            notificationDismiss={async () => await dismissNotification(notification.contractId)}/>);

    const dismissNotification = async (cid: ContractId<Notification>) => {
        const choice = Notification.Notification_Dismiss;
        await ledger.exercise(choice, cid, {});
    }

    return relationshipRequestNotifications;
}

const DismissibleNotification: React.FC<DismissibleNotificationProps> = ({
    notification,
    notificationDismiss
}) => {
    const lookup = useRegistryLookup();
    const sender = notification.contractData.sender;
    const senderRole = notification.contractData.senderRole;
    let name;
    console.log(senderRole);
    switch(senderRole) {
        case MarketRole.InvestorRole:
            name = <>Investor <b>@{lookup.investorMap.get(sender)?.name || sender}</b></>;
            break;
        case MarketRole.IssuerRole:
            name = <>Issuer <b>@{lookup.issuerMap.get(sender)?.name || sender}</b></>;
            break;
        case MarketRole.BrokerRole:
            name = <>Broker <b>@{lookup.brokerMap.get(sender)?.name || sender}</b></>;
            break;
        case MarketRole.ExchangeRole:
            name = <>Exchange <b>@{lookup.exchangeMap.get(sender)?.name || sender}</b></>;
            break;
        case MarketRole.CustodianRole:
            name = <>Custodian <b>@{lookup.custodianMap.get(sender)?.name || sender}</b></>;
            break;
        default:
            name = <b>@{sender}</b>;
    }
    return (
    <NotificationComponent>
        <p>Notification from {name}: {notification.contractData.text}</p>
        <FormErrorHandled onSubmit={notificationDismiss}>
            <Form.Group className='inline-form-group'>
                <Button
                    basic
                    content='Dismiss'
                    type='submit'/>
            </Form.Group>
        </FormErrorHandled>
    </NotificationComponent>
    )
}
