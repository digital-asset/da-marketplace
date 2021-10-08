import React from 'react';
import { useHistory } from 'react-router-dom';

import { AssetDescription } from '@daml.js/da-marketplace/lib/Marketplace/Issuance/AssetDescription';

import { useStreamQueries } from '../../Main';
import TitleWithActions from '../../components/Common/TitleWithActions';
import StripedTable from '../../components/Table/StripedTable';
import { usePartyName } from '../../config';
import paths from '../../paths';
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
        iconActions={[
          { path: paths.app.instruments.new.base, label: 'New Base Instrument' },
          {
            path: paths.app.instruments.new.convertiblenote,
            label: 'New Convertible Note',
          },
          { path: paths.app.instruments.new.binaryoption, label: 'New Binary Option' },
          { path: paths.app.instruments.new.simplefuture, label: 'New Simple Future' },
        ]}
      />

      <StripedTable
        rowsClickable
        headings={['Registrar', 'Issuer', 'Signatories', 'Id', 'Version', 'Description']}
        loading={allInstrumentsLoading}
        rows={instruments.map(c => {
          return {
            elements: [
              getName(c.payload.registrar),
              getName(c.payload.issuer),
              damlSetValues(c.payload.assetId.signatories)
                .map(party => getName(party))
                .sort()
                .join(', '),
              c.payload.assetId.label,
              c.payload.assetId.version,
              c.payload.description,
            ],
            onClick: () =>
              history.push(`${paths.app.instruments.instrument}/${c.contractId.replace('#', '_')}`),
          };
        })}
      />
    </div>
  );
};
