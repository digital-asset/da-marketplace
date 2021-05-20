import React from 'react';
import { RouteComponentProps, withRouter, useHistory } from 'react-router-dom';
import { Header } from 'semantic-ui-react';
import { useStreamQueries } from '../../Main';
import { usePartyName } from '../../config';
import { Issuance } from '@daml.js/da-marketplace/lib/Marketplace/Issuance/Model';
import Tile from '../../components/Tile/Tile';
import StripedTable from '../../components/Table/StripedTable';
import { ActionTile } from '../network/Actions';
import { AddPlusIcon } from '../../icons/icons';

export const IssuancesTable: React.FC = () => {
  const { contracts: issuances, loading: issuancesLoading } = useStreamQueries(Issuance);
  const { getName } = usePartyName('');
  const history = useHistory();

  return (
    <>
      <div className="title-action">
        <Header as="h2">Issuances</Header>
        <a className="a2 with-icon" onClick={() => history.push('/app/setup/issuance/new')}>
          <AddPlusIcon /> New Issuance
        </a>
      </div>

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
      <div className="title-action">
        <Header as="h2">Issuances</Header>
        <a className="a2 with-icon" onClick={() => history.push('/app/issuance/new')}>
          <AddPlusIcon /> New Issuance
        </a>
      </div>
      <IssuancesTable />
    </div>
  );
};

export const Issuances = withRouter(IssuancesComponent);
