import React from 'react';
import { useParty } from '@daml/react';
import { useStreamQueries } from '../../Main';
import { Service as AuctionService } from '@daml.js/da-marketplace/lib/Marketplace/Distribution/Auction/Service';
import { Service as BiddingService } from '@daml.js/da-marketplace/lib/Marketplace/Distribution/Bidding/Service';
import { getTemplateId, usePartyName } from '../../config';
import StripedTable from '../../components/Table/StripedTable';

export const DistributionServiceTable = () => {
  const party = useParty();
  const { getName } = usePartyName(party);

  const { contracts: auctionServices, loading: auctionServicesLoading } =
    useStreamQueries(AuctionService);
  const { contracts: biddingServices, loading: biddingServicesLoading } =
    useStreamQueries(BiddingService);

  const services = [...auctionServices, ...biddingServices];

  return (
    <StripedTable
      title="Services"
      headings={['Service', 'Operator', 'Provider', 'Consumer', 'Role']}
      loading={biddingServicesLoading || auctionServicesLoading}
      rows={services.map(c => {
        return {
          elements: [
            getTemplateId(c.templateId).split('.')[2],
            getName(c.payload.operator),
            getName(c.payload.provider),
            getName(c.payload.customer),
            party === c.payload.provider ? 'Provider' : 'Consumer',
          ],
        };
      })}
    />
  );
};
