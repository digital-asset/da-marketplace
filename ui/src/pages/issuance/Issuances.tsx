import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Button, Header } from 'semantic-ui-react';
import { useStreamQueries } from '../../Main';
import { usePartyName } from '../../config';
import { Issuance } from '@daml.js/da-marketplace/lib/Marketplace/Issuance/Model';
import Tile from '../../components/Tile/Tile';
import StripedTable from '../../components/Table/StripedTable';
import { ActionTile } from '../network/Actions';

export const IssuancesTable: React.FC = () => {
  const { contracts: issuances, loading: issuancesLoading } = useStreamQueries(Issuance);
  const { getName } = usePartyName('');

  return (
    <>
      <ActionTile
        title="Issuance"
        actions={[{ path: '/app/setup/issuance/new', label: 'New Issuance' }]}
      />
      <Header as="h2">Issuances</Header>
      <StripedTable
        headings={[
          'Issuing Agent',
          'Issuer',
          'Issuance ID',
          'Issuance Account',
          'Asset',
          'Quantity',
        ]}
        loading={issuancesLoading}
        rows={issuances.map(c => {
          return {
            elements: [
              getName(c.payload.provider),
              getName(c.payload.customer),
              c.payload.issuanceId,
              c.payload.accountId.label,
              c.payload.assetId.label,
              c.payload.quantity,
            ],
          };
        })}
      />
    </>
  );
};

const IssuancesComponent: React.FC<RouteComponentProps> = ({ history }: RouteComponentProps) => {
  return (
    <div className="issuances">
      <Tile header={<h4>Actions</h4>}>
        <Button secondary className="ghost" onClick={() => history.push('/app/issuance/new')}>
          New Issuance
        </Button>
      </Tile>

      <Tile header={<h4>Issuances</h4>}>
        <IssuancesTable />
      </Tile>
    </div>
  );
};

export const Issuances = withRouter(IssuancesComponent);
