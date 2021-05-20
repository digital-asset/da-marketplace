import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { useStreamQueries } from '../../../Main';
import { usePartyName } from '../../../config';
import { Auction } from '@daml.js/da-marketplace/lib/Marketplace/Distribution/Auction/Model';
import { getAuctionStatus } from '../Utils';
import { Header } from 'semantic-ui-react';
import StripedTable from '../../../components/Table/StripedTable';
import { ActionTile } from '../../network/Actions';
import { AddPlusIcon } from '../../../icons/icons';

const AuctionsComponent: React.FC<RouteComponentProps> = ({ history }: RouteComponentProps) => {
  const { contracts: auctions, loading: auctionsLoading } = useStreamQueries(Auction);
  const { getName } = usePartyName('');

  return (
    <div className="auction">
      <div className="title-action">
        <Header as="h2">Auctions</Header>
        <a
          className="a2 with-icon"
          onClick={() => history.push('/app/setup/distribution/new/auction')}
        >
          <AddPlusIcon /> New Auction
        </a>
      </div>

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
              history.push('/app/distribution/auctions/' + c.contractId.replace('#', '_')),
          };
        })}
      />
    </div>
  );
};

export const Auctions = withRouter(AuctionsComponent);
