import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { usePartyLegalName } from '../../config';
import { Listing } from '@daml.js/da-marketplace/lib/Marketplace/Listing/Model';
import { CreateEvent } from '@daml/ledger';
import { Header } from 'semantic-ui-react';
import StripedTable from '../../components/Table/StripedTable';

type Props = {
  listings: Readonly<CreateEvent<Listing, any, any>[]>;
};

const MarketsComponent: React.FC<RouteComponentProps & Props> = ({
  history,
  listings,
}: RouteComponentProps & Props) => {
  const { getLegalName } = usePartyLegalName('');

  return (
    <div>
      <Header as="h2">Markets</Header>
      <StripedTable
        headings={['Provider', 'Client', 'Symbol', 'Traded Asset', 'Quoted Asset']}
        rowsClickable
        rows={listings.map(c => {
          return {
            elements: [
              getLegalName(c.payload.provider),
              getLegalName(c.payload.customer),
              c.payload.listingId,
              c.payload.tradedAssetId.label,
              c.payload.quotedAssetId.label,
            ],
            onClick: () => history.push('/app/trading/markets/' + c.contractId.replace('#', '_')),
          };
        })}
      />
    </div>
  );
};

export const Markets = withRouter(MarketsComponent);
