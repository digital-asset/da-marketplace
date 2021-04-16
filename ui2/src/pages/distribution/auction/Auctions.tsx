import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { useStreamQueries } from '../../../Main';
import { getName } from '../../../config';
import { Auction } from '@daml.js/da-marketplace/lib/Marketplace/Distribution/Auction/Model';
import { getAuctionStatus } from '../Utils';
import { Header, Icon } from 'semantic-ui-react';
import StripedTable from '../../../components/Table/StripedTable';

const AuctionsComponent: React.FC<RouteComponentProps> = ({ history }: RouteComponentProps) => {
  const { contracts: auctions, loading: auctionsLoading } = useStreamQueries(Auction);

  return (
    <div className="auctions">
      <Header as="h2">Auctions</Header>
      <StripedTable
        headings={['Provider', 'Client', 'Asset', 'Floor', 'Status', 'Details']}
        loading={auctionsLoading}
        rowsClickable
        rows={auctions.map(c => {
          return {
            elements: [
              getName(c.payload.provider),
              getName(c.payload.customer),
              c.payload.asset.quantity + ' ' + c.payload.asset.id.label,
              c.payload.floorPrice + ' ' + c.payload.quotedAssetId.label,
              getAuctionStatus(c.payload.status),
            ],
            onClick: () =>
              history.push('/app/distribution/auctions/' + c.contractId.replace('#', '_')),
          };
        })}
      />
    </div>
  );
};

export const Auctions = withRouter(AuctionsComponent);
