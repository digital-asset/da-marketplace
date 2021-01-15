import React from 'react'

import { useLedger, useStreamQueries } from '@daml/react'
import { CustodianRelationshipRequest } from '@daml.js/da-marketplace/lib/Marketplace/Custodian'
import { MarketRole } from '@daml.js/da-marketplace/lib/Marketplace/Utils'
import { ContractId } from '@daml/types'

import AcceptRejectNotification from '../common/AcceptRejectNotification'
import { useRegistryLookup } from '../common/RegistryLookup'
import { CustodianRelationshipRequestInfo, makeContractInfo } from '../common/damlTypes'

type RelationshipRequestNotificationProps = {
    request: CustodianRelationshipRequestInfo;
    requestAccept: () => Promise<void>;
    requestReject: () => Promise<void>;
}

export const useRelationshipRequestNotifications = () => {
    const ledger = useLedger();
    const relationshipRequestNotifications = useStreamQueries(CustodianRelationshipRequest, () => [], [], (e) => {
        console.log("Unexpected close from custodianRelationshipRequest: ", e);
    })
        .contracts
        .map(request => <RelationshipRequestNotification key={request.contractId}
            request={makeContractInfo(request)}
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
