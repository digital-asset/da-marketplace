import React from 'react'
import { Button, Form, Header } from 'semantic-ui-react'

import { useLedger, useParty } from '@daml/react'
import { ContractId } from '@daml/types'

import { MarketRole } from '@daml.js/da-marketplace/lib/Marketplace/Utils'
import {
    DismissibleNotification as DismissibleNotificationTemplate
} from '@daml.js/da-marketplace/lib/Marketplace/Notification'

import { IconClose } from '../../icons/Icons'
import { useContractQuery } from '../../websocket/queryStream'

import { DismissibleNotificationInfo } from './damlTypes'
import { useRegistryLookup } from './RegistryLookup'
import NotificationComponent from './Notification'
import FormErrorHandled from './FormErrorHandled'

type DismissibleNotificationProps = {
    notification: DismissibleNotificationInfo;
    notificationDismiss : () => Promise<void>;
}

export const useDismissibleNotifications = () => {
    const ledger = useLedger();
    const party = useParty();
    const relationshipRequestNotifications = useContractQuery(DismissibleNotificationTemplate)
        .filter(notification => notification.contractData.receiver === party)
        .map(notification => <DismissibleNotification key={notification.contractId}
            notification={notification}
            notificationDismiss={async () => await dismissNotification(notification.contractId)}/>);

    const dismissNotification = async (cid: ContractId<DismissibleNotificationTemplate>) => {
        const choice = DismissibleNotificationTemplate.DismissibleNotification_Dismiss;
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

    // useEffect(() => {
    //     setTimeout(() => {
    //         notificationDismiss();
    //     }, 5000);
    // })

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
        case MarketRole.CCPRole:
            name = <>CCP <b>@{lookup.ccpMap.get(sender)?.name || sender}</b></>;
            break;
        default:
            name = <b>@{sender}</b>;
    }

    return (
        <NotificationComponent>
            <Header as='h3'>Notification from {name}: {notification.contractData.text}</Header>
            <FormErrorHandled onSubmit={notificationDismiss}>
                <Form.Group className='inline-form-group'>
                    <Button
                        className='close-button'
                        type='submit'>
                        <IconClose/>
                    </Button>
                </Form.Group>
            </FormErrorHandled>
        </NotificationComponent>
    )
}
