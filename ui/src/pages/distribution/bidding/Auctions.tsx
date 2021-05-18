import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { useStreamQueries } from '../../../Main';
import { usePartyName } from '../../../config';
import {
  Auction as BiddingAuctionContract,
  Bid,
} from '@daml.js/da-marketplace/lib/Marketplace/Distribution/Bidding/Model';
import { getBidAllocation, getBidStatus } from '../Utils';
import StripedTable from '../../../components/Table/StripedTable';
import Tile from '../../../components/Tile/Tile';
import { ArrowRightIcon } from '../../../icons/icons';

const BiddingAuctionsComponent: React.FC<RouteComponentProps> = ({
  history,
}: RouteComponentProps) => {
  const { contracts: biddingAuctions, loading: biddingAuctionsLoading } =
    useStreamQueries(BiddingAuctionContract);
  const { contracts: bids, loading: bidsLoading } = useStreamQueries(Bid);
  const { getName } = usePartyName('');

  return (
    <div className="bidding">
      <Tile header={<h4>Auctions</h4>}>
        <StripedTable
          rowsClickable
          headings={['Auction ID', 'Agent', 'Issuer', 'Asset', 'Quantity']}
          loading={biddingAuctionsLoading}
          rows={biddingAuctions.map(c => {
            return {
              elements: [
                c.payload.auctionId,
                getName(c.payload.provider),
                getName(c.payload.issuer),
                c.payload.asset.id.label,
                c.payload.asset.quantity,
              ],
              onClick: () =>
                history.push('/app/distribution/bidding/' + c.contractId.replace('#', '_')),
            };
          })}
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
          rows={bids.map(c => {
            return {
              elements: [
                c.payload.auctionId,
                getName(c.payload.provider),
                getName(c.payload.issuer),
                c.payload.assetId.label,
                c.payload.details.quantity,
                c.payload.details.price,
                getBidStatus(c.payload.status),
                getBidAllocation(c.payload),
              ],
            };
          })}
        />
      </Tile>
    </div>
  );
};

export const BiddingAuctions = withRouter(BiddingAuctionsComponent);
