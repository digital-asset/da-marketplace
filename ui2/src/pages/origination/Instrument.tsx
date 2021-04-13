import React, { useEffect, useRef } from 'react';
// import { useStreamQueries } from '@daml/react';
import { useStreamQueries } from '../../Main';
import { useParams, RouteComponentProps } from 'react-router-dom';
import { getName } from '../../config';
import { render } from '../../components/Claims/render';
import { transformClaim } from '../../components/Claims/util';
import { AssetDescription } from '@daml.js/da-marketplace/lib/Marketplace/Issuance/AssetDescription';
import Tile from '../../components/Tile/Tile';
import StripedTable from '../../components/Table/StripedTable';

export const Instrument: React.FC<RouteComponentProps> = () => {
  const el = useRef<HTMLDivElement>(null);

  const { contractId } = useParams<any>();
  const cid = contractId.replace('_', '#');

  const instruments = useStreamQueries(AssetDescription).contracts;
  const instrument = instruments.find(c => c.contractId === cid);

  useEffect(() => {
    if (!el.current || !instrument) return;
    const data = transformClaim(instrument.payload.claims, 'root');
    render(el.current, data);
  }, [el, instrument]);

  if (!instrument) return <h5>Instrument not found</h5>;

  return (
    <div>
      <Tile header={<h3>{instrument.payload.description}</h3>}>
        <h5>Details</h5>
        <StripedTable
          headings={['Issuer', 'Signatories', 'Label', 'Version', 'Description']}
          rows={[
            [
              getName(instrument.payload.issuer),
              Object.keys(instrument.payload.assetId.signatories.textMap).join(', '),
              instrument.payload.assetId.label,
              instrument.payload.assetId.version,
              instrument.payload.description,
            ],
          ]}
        />
      </Tile>

      <Tile header={<h3>Claims</h3>}>
        <div ref={el} style={{ height: '100%' }} />
      </Tile>
    </div>
  );
};
