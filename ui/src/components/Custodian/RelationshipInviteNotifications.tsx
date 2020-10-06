import React from 'react'
import { Button, Form } from 'semantic-ui-react'

import { useLedger, useStreamQuery } from '@daml/react'
import { ContractId } from '@daml/types'
import { CustodianRelationshipRequest } from '@daml.js/da-marketplace/lib/Marketplace/Custodian'
import { MarketRole } from '@daml.js/da-marketplace/lib/Marketplace/Utils'

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
}) => (
    <Notification>
        {getRequestText(request)}
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

function getRequestText(relationship: CustodianRelationshipRequestInfo) {
    let name = '';
    switch(relationship.contractData.role) {
        case MarketRole.InvestorRole:
            name = `Investor @${relationship.contractData.requester}`
        case MarketRole.IssuerRole:
            name = `Issuer @${relationship.contractData.requester}`
        case MarketRole.BrokerRole:
            name = `Broker @${relationship.contractData.requester}`
        case MarketRole.ExchangeRole:
            name = `Exchange @${relationship.contractData.requester}`
        default:
            name = relationship.contractData.requester;
    }

    return <p><b>@{name}</b> is requesting a relationship</p>;
}
