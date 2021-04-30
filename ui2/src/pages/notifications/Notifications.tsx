import React from 'react';
import { useHistory } from 'react-router-dom';
import { Button } from 'semantic-ui-react';

import {
  Offer as CustodyRoleOffer,
  Request as CustodyRoleRequest,
} from '@daml.js/da-marketplace/lib/Marketplace/Custody/Role';
import {
  Offer as TradingRoleOffer,
  Request as TradingRoleRequest,
} from '@daml.js/da-marketplace/lib/Marketplace/Trading/Role';
import {
  Offer as ClearingRoleOffer,
  Request as ClearingRoleRequest,
} from '@daml.js/da-marketplace/lib/Marketplace/Clearing/Role';
import {
  Offer as RegulatorRoleOffer,
  Request as RegulatorRoleRequest,
} from '@daml.js/da-marketplace/lib/Marketplace/Regulator/Role';
import {
  Offer as DistributionRoleOffer,
  Request as DistributionRoleRequest,
} from '@daml.js/da-marketplace/lib/Marketplace/Distribution/Role';

import {
  Offer as CustodyServiceOffer,
  Request as CustodyServiceRequest,
} from '@daml.js/da-marketplace/lib/Marketplace/Custody/Service';
import {
  Offer as ListingServiceOffer,
  Request as ListingServiceRequest,
} from '@daml.js/da-marketplace/lib/Marketplace/Listing/Service';
import {
  Offer as TradingServiceOffer,
  Request as TradingServiceRequest,
} from '@daml.js/da-marketplace/lib/Marketplace/Trading/Service';
import {
  Offer as MatchingServiceOffer,
  Request as MatchingServiceRequest,
} from '@daml.js/da-marketplace/lib/Marketplace/Trading/Matching/Service';
import {
  Offer as ClearingServiceOffer,
  Request as ClearingServiceRequest,
} from '@daml.js/da-marketplace/lib/Marketplace/Clearing/Service';
import {
  Offer as IssuanceServiceOffer,
  Request as IssuanceServiceRequest,
} from '@daml.js/da-marketplace/lib/Marketplace/Issuance/Service';
import {
  Offer as RegulatorServiceOffer,
  Request as RegulatorServiceRequest,
} from '@daml.js/da-marketplace/lib/Marketplace/Regulator/Service';
import {
  Offer as SettlementServiceOffer,
  Request as SettlementServiceRequest,
} from '@daml.js/da-marketplace/lib/Marketplace/Settlement/Service';
import {
  Offer as MarketServiceOffer,
  Request as MarketServiceRequest,
} from '@daml.js/da-marketplace/lib/Marketplace/Clearing/Market/Service';
import {
  Offer as AuctionServiceOffer,
  Request as AuctionServiceRequest,
} from '@daml.js/da-marketplace/lib/Marketplace/Distribution/Auction/Service';
import {
  Offer as BiddingServiceOffer,
  Request as BiddingServiceRequest,
} from '@daml.js/da-marketplace/lib/Marketplace/Distribution/Bidding/Service';

import { ServiceKind } from '../../context/ServicesContext';
import { ArrowLeftIcon } from '../../icons/icons';
import { useStreamQueries } from '../../Main';

import {
  NotificationSet,
  OfferAcceptChoice,
  OfferDeclineChoice,
  RequestApproveChoice,
  RequestRejectChoice,
} from './NotificationTypes';
import { OfferNotification, RequestNotification } from './NotificationComponents';

export const useAllNotifications = (party: string): NotificationSet[] => {
  const custodianRoleOffers = useStreamQueries(CustodyRoleOffer);
  const custodianRoleRequests = useStreamQueries(CustodyRoleRequest);
  const tradingRoleOffers = useStreamQueries(TradingRoleOffer);
  const tradingRoleRequests = useStreamQueries(TradingRoleRequest);
  const clearingRoleOffers = useStreamQueries(ClearingRoleOffer);
  const clearingRoleRequests = useStreamQueries(ClearingRoleRequest);
  const regulatorRoleOffers = useStreamQueries(RegulatorRoleOffer);
  const regulatorRoleRequests = useStreamQueries(RegulatorRoleRequest);
  const distributionRoleOffers = useStreamQueries(DistributionRoleOffer);
  const distributionRoleRequests = useStreamQueries(DistributionRoleRequest);

  const custodianServiceOffers = useStreamQueries(CustodyServiceOffer);
  const custodianServiceRequests = useStreamQueries(CustodyServiceRequest);
  const listingServiceOffers = useStreamQueries(ListingServiceOffer);
  const listingServiceRequests = useStreamQueries(ListingServiceRequest);
  const tradingServiceOffers = useStreamQueries(TradingServiceOffer);
  const tradingServiceRequests = useStreamQueries(TradingServiceRequest);
  const matchingServiceOffers = useStreamQueries(MatchingServiceOffer);
  const matchingServiceRequests = useStreamQueries(MatchingServiceRequest);
  const clearingServiceOffers = useStreamQueries(ClearingServiceOffer);
  const clearingServiceRequests = useStreamQueries(ClearingServiceRequest);
  const issuanceServiceOffers = useStreamQueries(IssuanceServiceOffer);
  const issuanceServiceRequests = useStreamQueries(IssuanceServiceRequest);
  const regulatorServiceOffers = useStreamQueries(RegulatorServiceOffer);
  const regulatorServiceRequests = useStreamQueries(RegulatorServiceRequest);
  const settlementServiceOffers = useStreamQueries(SettlementServiceOffer);
  const settlementServiceRequests = useStreamQueries(SettlementServiceRequest);
  const marketServiceOffers = useStreamQueries(MarketServiceOffer);
  const marketServiceRequests = useStreamQueries(MarketServiceRequest);
  const auctionServiceOffers = useStreamQueries(AuctionServiceOffer);
  const auctionServiceRequests = useStreamQueries(AuctionServiceRequest);
  const biddingServiceOffers = useStreamQueries(BiddingServiceOffer);
  const biddingServiceRequests = useStreamQueries(BiddingServiceRequest);

  return [
    {
      kind: 'Role',
      tag: 'offer',
      service: ServiceKind.CUSTODY,
      choices: {
        accept: CustodyRoleOffer.Accept as OfferAcceptChoice,
        decline: CustodyRoleOffer.Decline as OfferDeclineChoice,
      },
      contracts: custodianRoleOffers.contracts.filter(c => c.payload.provider === party),
    },
    {
      kind: 'Role',
      tag: 'request',
      service: ServiceKind.CUSTODY,
      choices: {
        approve: CustodyRoleRequest.Approve as RequestApproveChoice,
        reject: CustodyRoleRequest.Reject as RequestRejectChoice,
      },
      contracts: custodianRoleRequests.contracts.filter(c => c.payload.operator === party),
    },
    {
      kind: 'Role',
      tag: 'offer',
      service: ServiceKind.TRADING,
      choices: {
        accept: TradingRoleOffer.Accept as OfferAcceptChoice,
        decline: TradingRoleOffer.Decline as OfferDeclineChoice,
      },
      contracts: tradingRoleOffers.contracts.filter(c => c.payload.provider === party),
    },
    {
      kind: 'Role',
      tag: 'request',
      service: ServiceKind.TRADING,
      choices: {
        approve: TradingRoleRequest.Approve as RequestApproveChoice,
        reject: TradingRoleRequest.Reject as RequestRejectChoice,
      },
      contracts: tradingRoleRequests.contracts.filter(c => c.payload.operator === party),
    },
    {
      kind: 'Role',
      tag: 'offer',
      service: ServiceKind.CLEARING,
      choices: {
        accept: ClearingRoleOffer.Accept as OfferAcceptChoice,
        decline: ClearingRoleOffer.Decline as OfferDeclineChoice,
      },
      contracts: clearingRoleOffers.contracts.filter(c => c.payload.provider === party),
    },
    {
      kind: 'Role',
      tag: 'request',
      service: ServiceKind.CLEARING,
      choices: {
        approve: ClearingRoleRequest.Approve as RequestApproveChoice,
        reject: ClearingRoleRequest.Reject as RequestRejectChoice,
      },
      contracts: clearingRoleRequests.contracts.filter(c => c.payload.operator === party),
    },
    {
      kind: 'Role',
      tag: 'offer',
      service: ServiceKind.REGULATOR,
      choices: {
        accept: RegulatorRoleOffer.Accept as OfferAcceptChoice,
        decline: RegulatorRoleOffer.Decline as OfferDeclineChoice,
      },
      contracts: regulatorRoleOffers.contracts.filter(c => c.payload.provider === party),
    },
    {
      kind: 'Role',
      tag: 'request',
      service: ServiceKind.REGULATOR,
      choices: {
        approve: RegulatorRoleRequest.Approve as RequestApproveChoice,
        reject: RegulatorRoleRequest.Reject as RequestRejectChoice,
      },
      contracts: regulatorRoleRequests.contracts.filter(c => c.payload.operator === party),
    },
    {
      kind: 'Role',
      tag: 'offer',
      service: ServiceKind.DISTRIBUTOR,
      choices: {
        accept: DistributionRoleOffer.Accept as OfferAcceptChoice,
        decline: DistributionRoleOffer.Decline as OfferDeclineChoice,
      },
      contracts: distributionRoleOffers.contracts.filter(c => c.payload.provider === party),
    },
    {
      kind: 'Role',
      tag: 'request',
      service: ServiceKind.DISTRIBUTOR,
      choices: {
        approve: DistributionRoleRequest.Approve as RequestApproveChoice,
        reject: DistributionRoleRequest.Reject as RequestRejectChoice,
      },
      contracts: distributionRoleRequests.contracts.filter(c => c.payload.operator === party),
    },
    {
      kind: 'Service',
      tag: 'offer',
      service: ServiceKind.CUSTODY,
      choices: {
        accept: CustodyServiceOffer.Accept as OfferAcceptChoice,
        decline: CustodyServiceOffer.Decline as OfferDeclineChoice,
      },
      contracts: custodianServiceOffers.contracts.filter(c => c.payload.customer === party),
    },
    {
      kind: 'Service',
      tag: 'request',
      service: ServiceKind.CUSTODY,
      choices: {
        approve: CustodyServiceRequest.Approve as RequestApproveChoice,
        reject: CustodyServiceRequest.Reject as RequestRejectChoice,
      },
      contracts: custodianServiceRequests.contracts.filter(c => c.payload.provider === party),
    },
    {
      kind: 'Service',
      tag: 'offer',
      service: ServiceKind.LISTING,
      choices: {
        accept: ListingServiceOffer.Accept as OfferAcceptChoice,
        decline: ListingServiceOffer.Decline as OfferDeclineChoice,
      },
      contracts: listingServiceOffers.contracts.filter(c => c.payload.customer === party),
    },
    {
      kind: 'Service',
      tag: 'request',
      service: ServiceKind.LISTING,
      choices: {
        approve: ListingServiceRequest.Approve as RequestApproveChoice,
        reject: ListingServiceRequest.Reject as RequestRejectChoice,
      },
      contracts: listingServiceRequests.contracts.filter(c => c.payload.provider === party),
    },
    {
      kind: 'Service',
      tag: 'offer',
      service: ServiceKind.TRADING,
      choices: {
        accept: TradingServiceOffer.Accept as OfferAcceptChoice,
        decline: TradingServiceOffer.Decline as OfferDeclineChoice,
      },
      contracts: tradingServiceOffers.contracts.filter(c => c.payload.customer === party),
    },
    {
      kind: 'Service',
      tag: 'request',
      service: ServiceKind.TRADING,
      choices: {
        approve: TradingServiceRequest.Approve as RequestApproveChoice,
        reject: TradingServiceRequest.Reject as RequestRejectChoice,
      },
      contracts: tradingServiceRequests.contracts.filter(c => c.payload.provider === party),
    },
    {
      kind: 'Service',
      tag: 'offer',
      service: ServiceKind.MATCHING,
      choices: {
        accept: MatchingServiceOffer.Accept as OfferAcceptChoice,
        decline: MatchingServiceOffer.Decline as OfferDeclineChoice,
      },
      contracts: matchingServiceOffers.contracts.filter(c => c.payload.provider === party),
    },
    {
      kind: 'Service',
      tag: 'request',
      service: ServiceKind.MATCHING,
      choices: {
        approve: MatchingServiceRequest.Approve as RequestApproveChoice,
        reject: MatchingServiceRequest.Reject as RequestRejectChoice,
      },
      contracts: matchingServiceRequests.contracts.filter(c => c.payload.provider === party),
    },
    {
      kind: 'Service',
      tag: 'offer',
      service: ServiceKind.CLEARING,
      choices: {
        accept: ClearingServiceOffer.Accept as OfferAcceptChoice,
        decline: ClearingServiceOffer.Decline as OfferDeclineChoice,
      },
      contracts: clearingServiceOffers.contracts.filter(c => c.payload.customer === party),
    },
    {
      kind: 'Service',
      tag: 'request',
      service: ServiceKind.CLEARING,
      choices: {
        approve: ClearingServiceRequest.Approve as RequestApproveChoice,
        reject: ClearingServiceRequest.Reject as RequestRejectChoice,
      },
      contracts: clearingServiceRequests.contracts.filter(c => c.payload.provider === party),
    },
    {
      kind: 'Service',
      tag: 'offer',
      service: ServiceKind.ISSUANCE,
      choices: {
        accept: IssuanceServiceOffer.Accept as OfferAcceptChoice,
        decline: IssuanceServiceOffer.Decline as OfferDeclineChoice,
      },
      contracts: issuanceServiceOffers.contracts.filter(c => c.payload.customer === party),
    },
    {
      kind: 'Service',
      tag: 'request',
      service: ServiceKind.ISSUANCE,
      choices: {
        approve: IssuanceServiceRequest.Approve as RequestApproveChoice,
        reject: IssuanceServiceRequest.Reject as RequestRejectChoice,
      },
      contracts: issuanceServiceRequests.contracts.filter(c => c.payload.provider === party),
    },
    {
      kind: 'Service',
      tag: 'offer',
      service: ServiceKind.REGULATOR,
      choices: {
        accept: RegulatorServiceOffer.Accept as OfferAcceptChoice,
        decline: RegulatorServiceOffer.Decline as OfferDeclineChoice,
      },
      contracts: regulatorServiceOffers.contracts.filter(c => c.payload.customer === party),
    },
    {
      kind: 'Service',
      tag: 'request',
      service: ServiceKind.REGULATOR,
      choices: {
        approve: RegulatorServiceRequest.Approve as RequestApproveChoice,
        reject: RegulatorServiceRequest.Reject as RequestRejectChoice,
      },
      contracts: regulatorServiceRequests.contracts.filter(c => c.payload.provider === party),
    },
    {
      kind: 'Service',
      tag: 'offer',
      service: ServiceKind.SETTLEMENT,
      choices: {
        accept: SettlementServiceOffer.Accept as OfferAcceptChoice,
        decline: SettlementServiceOffer.Decline as OfferDeclineChoice,
      },
      contracts: settlementServiceOffers.contracts.filter(c => c.payload.provider === party),
    },
    {
      kind: 'Service',
      tag: 'request',
      service: ServiceKind.SETTLEMENT,
      choices: {
        approve: SettlementServiceRequest.Approve as RequestApproveChoice,
        reject: SettlementServiceRequest.Reject as RequestRejectChoice,
      },
      contracts: settlementServiceRequests.contracts.filter(c => c.payload.provider === party),
    },
    {
      kind: 'Service',
      tag: 'offer',
      service: ServiceKind.MARKET_CLEARING,
      choices: {
        accept: MarketServiceOffer.Accept as OfferAcceptChoice,
        decline: MarketServiceOffer.Decline as OfferDeclineChoice,
      },
      contracts: marketServiceOffers.contracts.filter(c => c.payload.customer === party),
    },
    {
      kind: 'Service',
      tag: 'request',
      service: ServiceKind.MARKET_CLEARING,
      choices: {
        approve: MarketServiceRequest.Approve as RequestApproveChoice,
        reject: MarketServiceRequest.Reject as RequestRejectChoice,
      },
      contracts: marketServiceRequests.contracts.filter(c => c.payload.provider === party),
    },
    {
      kind: 'Service',
      tag: 'offer',
      service: ServiceKind.AUCTION,
      choices: {
        accept: AuctionServiceOffer.Accept as OfferAcceptChoice,
        decline: AuctionServiceOffer.Decline as OfferDeclineChoice,
      },
      contracts: auctionServiceOffers.contracts.filter(c => c.payload.customer === party),
    },
    {
      kind: 'Service',
      tag: 'request',
      service: ServiceKind.AUCTION,
      choices: {
        approve: AuctionServiceRequest.Approve as RequestApproveChoice,
        reject: AuctionServiceRequest.Reject as RequestRejectChoice,
      },
      contracts: auctionServiceRequests.contracts.filter(c => c.payload.provider === party),
    },
    {
      kind: 'Service',
      tag: 'offer',
      service: ServiceKind.BIDDING,
      choices: {
        accept: BiddingServiceOffer.Accept as OfferAcceptChoice,
        decline: BiddingServiceOffer.Decline as OfferDeclineChoice,
      },
      contracts: biddingServiceOffers.contracts.filter(c => c.payload.customer === party),
    },
    {
      kind: 'Service',
      tag: 'request',
      service: ServiceKind.BIDDING,
      choices: {
        approve: BiddingServiceRequest.Approve as RequestApproveChoice,
        reject: BiddingServiceRequest.Reject as RequestRejectChoice,
      },
      contracts: biddingServiceRequests.contracts.filter(c => c.payload.provider === party),
    },
  ];
};

type Props = {
  notifications: NotificationSet[];
};

const Notifications: React.FC<Props> = ({ notifications }) => {
  const history = useHistory();

  const count = notifications.reduce((count, ns) => count + ns.contracts.length, 0);

  return (
    <div className="notifications">
      <div className="return-link">
        <Button className="ghost" onClick={() => history.goBack()}>
          <ArrowLeftIcon />
        </Button>
      </div>
      <div className="notification-content">
        {count > 0
          ? notifications.map(n => {
              switch (n.tag) {
                case 'offer':
                  return n.contracts.map(c => (
                    <OfferNotification
                      key={c.contractId}
                      contract={c.contractId}
                      serviceText={n.service + ' ' + n.kind}
                      offerer={c.payload.operator}
                      acceptChoice={n.choices.accept}
                      declineChoice={n.choices.decline}
                    />
                  ));
                case 'request':
                  return n.contracts.map(c => (
                    <RequestNotification
                      key={c.contractId}
                      contract={c.contractId}
                      serviceText={n.service + ' ' + n.kind}
                      requester={c.payload.provider}
                      approveChoice={n.choices.approve}
                      rejectChoice={n.choices.reject}
                    />
                  ));
              }
            })
          : 'No Notifications.'}
      </div>
    </div>
  );
};

export default Notifications;
