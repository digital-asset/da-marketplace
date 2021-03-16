import React from 'react'

import { useLedger } from '@daml/react'
import { ContractId } from '@daml/types'

import { CustodianRelationshipRequest } from '@daml.js/da-marketplace/lib/Marketplace/Custodian'
import { MarketRole } from '@daml.js/da-marketplace/lib/Marketplace/Utils'

import { useContractQuery } from '../../websocket/queryStream'

import { CustodianRelationshipRequestInfo } from './damlTypes'
import { useRegistryLookup } from './RegistryLookup'
import AcceptRejectNotification from './AcceptRejectNotification'

type RelationshipRequestNotificationProps = {
    request: CustodianRelationshipRequestInfo;
    requestAccept: () => Promise<void>;
    requestReject: () => Promise<void>;
}

export const useRelationshipRequestNotifications = () => {
    const ledger = useLedger();
    const relationshipRequestNotifications = useContractQuery(CustodianRelationshipRequest)
        .map(request => <RelationshipRequestNotification key={request.contractId}
            request={request}
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
        <AcceptRejectNotification onAccept={requestAccept} onReject={requestReject}>
           <p>{name} is requesting a relationship.</p>
        </AcceptRejectNotification>
    )
}
