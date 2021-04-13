import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
// import { useStreamQueries } from '@daml/react';
import { useStreamQueries } from '../../../Main';
import { getName } from '../../../config';
import { Auction } from '@daml.js/da-marketplace/lib/Marketplace/Distribution/Auction/Model';
import { getAuctionStatus } from '../Utils';
import Tile from '../../../components/Tile/Tile';
import { Button, Header, Icon } from 'semantic-ui-react';
import StripedTable from '../../../components/Table/StripedTable';

const AuctionsComponent: React.FC<RouteComponentProps> = ({ history }: RouteComponentProps) => {
  const auctions = useStreamQueries(Auction).contracts;

  return (
    <div>
      <Tile header={<h2>Actions</h2>}>
        <Button className="ghost" onClick={() => history.push('/app/distribution/new')}>
          New Auction
        </Button>
      </Tile>
      <Header as="h2">Holdings</Header>
      <StripedTable
        headings={['Provider', 'Client', 'Asset', 'Floor', 'Status', 'Details']}
        rows={auctions.map(c => [
          getName(c.payload.provider),
          getName(c.payload.customer),
          c.payload.asset.quantity + ' ' + c.payload.asset.id.label,
          c.payload.floorPrice + ' ' + c.payload.quotedAssetId.label,
          getAuctionStatus(c.payload.status),
          <Icon
            name="angle right"
            link
            onClick={() =>
              history.push('/app/distribution/auctions/' + c.contractId.replace('#', '_'))
            }
          />,
        ])}
      />
    </div>
  );
};

export const Auctions = withRouter(AuctionsComponent);
