import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { useStreamQueries } from '../../../Main';
import { getName } from '../../../config';
import { Auction as BiddingAuctionContract } from '@daml.js/da-marketplace/lib/Marketplace/Distribution/Bidding/Model';
import { Bid } from '@daml.js/da-marketplace/lib/Marketplace/Distribution/Bidding/Model';
import { getBidStatus, getBidAllocation } from '../Utils';
import StripedTable from '../../../components/Table/StripedTable';
import Tile from '../../../components/Tile/Tile';
import { Icon } from 'semantic-ui-react';

const BiddingAuctionsComponent: React.FC<RouteComponentProps> = ({
  history,
}: RouteComponentProps) => {
  const {contracts: biddingAuctions, loading: biddingAuctionsLoading } = useStreamQueries(BiddingAuctionContract);
  const {contracts: bids, loading: bidsLoading } = useStreamQueries(Bid);

  return (
    <div className="bidding">
      <Tile header={<h4>Auctions</h4>}>
        <StripedTable
          headings={['Auction ID', 'Agent', 'Issuer', 'Asset', 'Quantity', 'Details']}
          loading={biddingAuctionsLoading}
          rows={biddingAuctions.map(c => [
            c.payload.auctionId,
            getName(c.payload.provider),
            getName(c.payload.issuer),
            c.payload.asset.id.label,
            c.payload.asset.quantity,
            <Icon
              name="angle right"
              link
              onClick={() =>
                history.push('/app/distribution/bidding/' + c.contractId.replace('#', '_'))
              }
            />,
          ])}
        />
      </Tile>
      <Tile header={<h4>Bids</h4>}>
        <StripedTable
          headings={[
            'Auction ID',
            'Agent',
            'Issuer',
            'Asset',
            'Quantity',
            'Price',
            'Status',
            'Allocation',
          ]}
          loading={bidsLoading}
          rows={bids.map(c => [
            c.payload.auctionId,
            getName(c.payload.provider),
            getName(c.payload.issuer),
            c.payload.assetId.label,
            c.payload.details.quantity,
            c.payload.details.price,
            getBidStatus(c.payload.status),
            getBidAllocation(c.payload),
          ])}
        />
      </Tile>
    </div>
  );
};

export const BiddingAuctions = withRouter(BiddingAuctionsComponent);
