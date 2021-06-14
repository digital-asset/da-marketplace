import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { useStreamQueries } from '../../../Main';
import { usePartyName } from '../../../config';
import { Auction } from '@daml.js/da-marketplace/lib/Marketplace/Distribution/Auction/Model';
import { getAuctionStatus } from '../Utils';
import StripedTable from '../../../components/Table/StripedTable';
import TitleWithActions from '../../../components/Common/TitleWithActions';
import paths from '../../../paths';

const AuctionsComponent: React.FC<RouteComponentProps> = ({ history }: RouteComponentProps) => {
  const { contracts: auctions, loading: auctionsLoading } = useStreamQueries(Auction);
  const { getName } = usePartyName('');

  return (
    <div className="auction">
      <TitleWithActions
        title="Auctions"
        iconActions={[{ path: paths.app.auctions.new.auction, label: ' New Auction' }]}
      />

      <StripedTable
        rowsClickable
        headings={['Provider', 'Client', 'Asset', 'Floor', 'Status']}
        loading={auctionsLoading}
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
              history.push(`${paths.app.auctions.root}/${c.contractId.replace('#', '_')}`),
          };
        })}
      />
    </div>
  );
};

export const Auctions = withRouter(AuctionsComponent);
