import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';

import { Auction } from '@daml.js/da-marketplace/lib/Marketplace/Distribution/Auction/Model';

import { useStreamQueries } from '../../../Main';
import TitleWithActions from '../../../components/Common/TitleWithActions';
import StripedTable from '../../../components/Table/StripedTable';
import { usePartyName } from '../../../config';
import paths from '../../../paths';
import { getAuctionStatus } from '../Utils';

const AuctionsComponent: React.FC<RouteComponentProps> = ({ history }: RouteComponentProps) => {
  const { contracts: auctions, loading: auctionsLoading } = useStreamQueries(Auction);
  const { getName } = usePartyName('');

  return (
    <div className="auction">
      <TitleWithActions
        title="Auctions"
        iconActions={[{ path: paths.app.auctions.new, label: ' New Auction' }]}
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
