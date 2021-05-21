import React from 'react';
import { RouteComponentProps, useHistory, withRouter } from 'react-router-dom';
import { useStreamQueries } from '../../Main';
import { usePartyName } from '../../config';
import { AssetDescription } from '@daml.js/da-marketplace/lib/Marketplace/Issuance/AssetDescription';
import StripedTable from '../../components/Table/StripedTable';
import { Button } from 'semantic-ui-react';
import Tile from '../../components/Tile/Tile';
import TitleWithActions from '../../components/Common/TitleWithActions';
import { damlSetValues } from '../common';

export const InstrumentsTable: React.FC = () => {
  const history = useHistory();
  const { contracts: allInstruments, loading: allInstrumentsLoading } =
    useStreamQueries(AssetDescription);
  const instruments = allInstruments.filter(c => c.payload.assetId.version === '0');
  const { getName } = usePartyName('');

  return (
    <div>
      <TitleWithActions
        title={'Instruments'}
        addNewActions={[
          { path: '/app/setup/instrument/new/base', label: 'New Base Instrument' },
          { path: '/app/setup/instrument/new/convertiblenote', label: 'New Convertible Note' },
          { path: '/app/setup/instrument/new/binaryoption', label: 'New Binary Option' },
        ]}
      />

      <StripedTable
        rowsClickable
        headings={['Issuer', 'Signatories', 'Id', 'Version', 'Description']}
        loading={allInstrumentsLoading}
        rows={instruments.map(c => {
          return {
            elements: [
              getName(c.payload.issuer),
              damlSetValues(c.payload.assetId.signatories)
                .map(party => getName(party))
                .sort()
                .join(', '),
              c.payload.assetId.label,
              c.payload.assetId.version,
              c.payload.description,
            ],
            onClick: () => history.push(`/app/manage/instrument/${c.contractId.replace('#', '_')}`),
          };
        })}
      />
    </div>
  );
};

const InstrumentsComponent: React.FC<RouteComponentProps> = ({ history }: RouteComponentProps) => {
  return (
    <div className="instruments">
      <Tile header="Actions">
        <Button secondary className="ghost" onClick={() => history.push('/app/instrument/new')}>
          New Instrument
        </Button>
      </Tile>

      <InstrumentsTable />
    </div>
  );
};

export const Instruments = withRouter(InstrumentsComponent);
