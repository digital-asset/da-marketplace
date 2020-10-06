import React from 'react'
import { Button, Form } from 'semantic-ui-react'

import { useLedger, useStreamQuery } from '@daml/react'
import { ContractId } from '@daml/types'
import { CustodianRelationshipRequest } from '@daml.js/da-marketplace/lib/Marketplace/Custodian'
import { MarketRole } from '@daml.js/da-marketplace/lib/Marketplace/Utils'

import { useRegistryLookup } from '../common/RegistryLookup'
import Notification from '../common/Notification'
import FormErrorHandled from '../common/FormErrorHandled'
import { CustodianRelationshipRequestInfo } from '../common/damlTypes'

type RelationshipRequestNotificationProps = {
    request: CustodianRelationshipRequestInfo;
    requestAccept: () => Promise<void>;
    requestReject: () => Promise<void>;
}

export const useRelationshipRequestNotifications = () => {
    const ledger = useLedger();
    const relationshipRequestNotifications = useStreamQuery(CustodianRelationshipRequest)
        .contracts
        .map(request => <RelationshipRequestNotification key={request.contractId}
            request={{ contractId: request.contractId, contractData: request.payload }}
            requestAccept={async () => await acceptRelationshipRequest(request.contractId)}
            requestReject={async () => await rejectRelationshipRequest(request.contractId)}/>);

    const acceptRelationshipRequest = async (cid: ContractId<CustodianRelationshipRequest>) => {
        const choice = CustodianRelationshipRequest.CustodianRelationshipRequest_Approve;
        await ledger.exercise(choice, cid, {});
    }

    const rejectRelationshipRequest = async (cid: ContractId<CustodianRelationshipRequest>) => {
        const choice = CustodianRelationshipRequest.CustodianRelationshipRequest_Reject;
        await ledger.exercise(choice, cid, {});
    }

    return relationshipRequestNotifications;
}

const RelationshipRequestNotification: React.FC<RelationshipRequestNotificationProps> = ({
    request,
    requestAccept,
    requestReject
}) => {
    const lookup = useRegistryLookup();
    const requester = request.contractData.requester;
    let name;
    switch(request.contractData.role) {
        case MarketRole.InvestorRole:
            name = <>Investor <b>@{lookup.investorMap.get(requester)?.name || requester}</b></>;
            break;
        case MarketRole.IssuerRole:
            name = <>Issuer <b>@{lookup.issuerMap.get(requester)?.name || requester}</b></>;
            break;
        case MarketRole.BrokerRole:
            name = <>Broker <b>@{lookup.brokerMap.get(requester)?.name || requester}</b></>;
            break;
        case MarketRole.ExchangeRole:
            name = <>Exchange <b>@{lookup.exchangeMap.get(requester)?.name || requester}</b></>;
            break;
        default:
            name = <b>@{requester}</b>;
    }
    return (
    <Notification>
        <p>{name} is requesting a relationship.</p>
        <FormErrorHandled onSubmit={requestAccept}>
            { loadAndCatch =>
                <Form.Group className='inline-form-group'>
                    <Button basic content='Accept' type='submit'/>
                    <Button
                        basic
                        content='Reject'
                        type='button'
                        onClick={() => loadAndCatch(requestReject)}/>
                </Form.Group>
            }
        </FormErrorHandled>
    </Notification>
    )
}
