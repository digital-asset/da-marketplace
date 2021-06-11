import React from 'react';
import { useStreamQueries } from '../../Main';
import { usePartyName } from '../../config';
import { Issuance } from '@daml.js/da-marketplace/lib/Marketplace/Issuance/Model';
import StripedTable from '../../components/Table/StripedTable';
import TitleWithActions from '../../components/Common/TitleWithActions';
import paths from '../../paths';

export const IssuancesTable: React.FC = () => {
  const { contracts: issuances, loading: issuancesLoading } = useStreamQueries(Issuance);
  const { getName } = usePartyName('');

  return (
    <>
      <TitleWithActions
        title={'Issuances'}
        iconActions={[{ path: paths.app.issuance.new, label: 'New Issuance' }]}
      />
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
