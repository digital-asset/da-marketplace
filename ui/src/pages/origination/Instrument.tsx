import React, { useEffect, useRef } from 'react';
import { useStreamQueries } from '../../Main';
import { Button } from 'semantic-ui-react';

import { RouteComponentProps, useHistory, useParams } from 'react-router-dom';
import { usePartyName } from '../../config';
import { render } from '../../components/Claims/render';
import { transformClaim } from '../../components/Claims/util';
import { AssetDescription } from '@daml.js/da-marketplace/lib/Marketplace/Issuance/AssetDescription';
import Tile from '../../components/Tile/Tile';
import StripedTable from '../../components/Table/StripedTable';
import BackButton from '../../components/Common/BackButton';
import { damlSetValues } from '../common';

export const Instrument: React.FC<RouteComponentProps> = () => {
  const el = useRef<HTMLDivElement>(null);
  const { contractId } = useParams<any>();
  const { getName } = usePartyName('');
  const cid = contractId.replace('_', '#');

  const { contracts: instruments, loading: instrumentsLoading } =
    useStreamQueries(AssetDescription);
  const instrument = instruments.find(c => c.contractId === cid);

  useEffect(() => {
    if (!el.current || !instrument) return;
    const data = transformClaim(instrument.payload.claims, 'root');
    render(el.current, data);
  }, [el, instrument]);

  if (instrumentsLoading) {
    return <h5>Loading instrument...</h5>;
  }

  if (!instrument) return <h5>Instrument not found</h5>;

  return (
    <div>
      <BackButton />
      <Tile header={<h3>{instrument.payload.description}</h3>}>
        <h5>Details</h5>
        <StripedTable
          headings={['Issuer', 'Signatories', 'Label', 'Version', 'Description']}
          loading={instrumentsLoading}
          rows={[
            {
              elements: [
                getName(instrument.payload.issuer),
                damlSetValues(instrument.payload.assetId.signatories)
                  .map(party => getName(party))
                  .join(', '),
                instrument.payload.assetId.label,
                instrument.payload.assetId.version,
                instrument.payload.description,
              ],
            },
          ]}
        />
      </Tile>

      <Tile header={<h3>Claims</h3>}>
        <div ref={el} style={{ height: '100%' }} />
      </Tile>
    </div>
  );
};
