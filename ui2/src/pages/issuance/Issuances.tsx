import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Button } from 'semantic-ui-react';
import { IconButton } from '@material-ui/core';
import { KeyboardArrowRight } from '@material-ui/icons';
import { useStreamQueries } from '../../Main';
import { getName } from '../../config';
import { Issuance } from '@daml.js/da-marketplace/lib/Marketplace/Issuance/Model';
import Tile from '../../components/Tile/Tile';
import StripedTable from '../../components/Table/StripedTable';

const IssuancesComponent: React.FC<RouteComponentProps> = ({ history }: RouteComponentProps) => {
  const issuances = useStreamQueries(Issuance).contracts;

  return (
    <div className="issuances">
      <Tile header={<h2>Actions</h2>}>
        <Button secondary className="ghost" onClick={() => history.push('/app/issuance/new')}>
          New Issuance
        </Button>
      </Tile>

      <Tile header={<h2>Issuances</h2>}>
        <StripedTable
          headings={[
            'Issuing Agent',
            'Issuer',
            'Issuance ID',
            'Issuance Account',
            'Asset',
            'Quantity',
            'Action',
            'Details',
          ]}
          rows={issuances.map(c => [
            getName(c.payload.provider),
            getName(c.payload.customer),
            c.payload.issuanceId,
            c.payload.accountId.label,
            c.payload.assetId.label,
            c.payload.quantity,
            <>
              {/* { party === c.payload.client &&
                  <Button secondary className='ghost' onClick={() => requestDelisting(c)}>Delist</Button>}                */}
            </>,
            <IconButton
              color="primary"
              size="small"
              component="span"
              onClick={() =>
                history.push('/app/issuance/issuances/' + c.contractId.replace('#', '_'))
              }
            >
              <KeyboardArrowRight fontSize="small" />
            </IconButton>,
          ])}
        />
      </Tile>
    </div>
  );
};

export const Issuances = withRouter(IssuancesComponent);
