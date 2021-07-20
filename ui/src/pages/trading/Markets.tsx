import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { usePartyName } from '../../config';
import { Listing } from '@daml.js/da-marketplace/lib/Marketplace/Listing/Model';
import { CreateEvent } from '@daml/ledger';
import StripedTable from '../../components/Table/StripedTable';
import { ArrowRightIcon } from '../../icons/icons';
import paths from '../../paths';

type Props = {
  listings: Readonly<CreateEvent<Listing, any, any>[]>;
};

const MarketsComponent: React.FC<RouteComponentProps & Props> = ({
  history,
  listings,
}: RouteComponentProps & Props) => {
  const { getName } = usePartyName('');

  return (
    <StripedTable
      title="Markets"
      headings={['Provider', 'Client', 'Symbol', 'Traded Asset', 'Quoted Asset']}
      rowsClickable
      clickableIcon={<ArrowRightIcon />}
      rows={listings.map(c => {
        return {
          elements: [
            getName(c.payload.provider),
            getName(c.payload.customer),
            c.payload.listingId,
            c.payload.tradedAssetId.label,
            c.payload.quotedAssetId.label,
          ],
          onClick: () =>
            history.push(`${paths.app.markets.root}/${c.contractId.replace('#', '_')}`),
        };
      })}
    />
  );
};

export const Markets = withRouter(MarketsComponent);
