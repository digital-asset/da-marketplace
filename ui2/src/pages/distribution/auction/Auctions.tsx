import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { useStreamQueries } from '../../../Main';
import { usePartyName } from '../../../config';
import { Auction } from '@daml.js/da-marketplace/lib/Marketplace/Distribution/Auction/Model';
import { getAuctionStatus } from '../Utils';
import { Header } from 'semantic-ui-react';
import StripedTable from '../../../components/Table/StripedTable';
import { ArrowRightIcon } from '../../../icons/icons';
import { ActionTile } from '../../network/Actions';

const AuctionsComponent: React.FC<RouteComponentProps> = ({ history }: RouteComponentProps) => {
  const { contracts: auctions, loading: auctionsLoading } = useStreamQueries(Auction);
  const { getName } = usePartyName('');

  return (
    <div className="auctions">
      <ActionTile
        actions={[{ path: '/app/setup/distribution/new/auction', label: 'New Auction' }]}
      />
      <Header as="h2">Auctions</Header>
      <StripedTable
        headings={['Provider', 'Client', 'Asset', 'Floor', 'Status']}
        loading={auctionsLoading}
        rowsClickable
        clickableIcon={<ArrowRightIcon />}
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
