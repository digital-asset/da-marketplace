import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { IconButton } from '@material-ui/core';
import { KeyboardArrowRight } from '@material-ui/icons';
import { useStreamQueries } from '../../Main';
import { getName } from '../../config';
import { AssetDescription } from '@daml.js/da-marketplace/lib/Marketplace/Issuance/AssetDescription';
import StripedTable from '../../components/Table/StripedTable';
import { Button } from 'semantic-ui-react';
import Tile from '../../components/Tile/Tile';

const InstrumentsComponent: React.FC<RouteComponentProps> = ({ history }: RouteComponentProps) => {
  const allInstruments = useStreamQueries(AssetDescription).contracts;
  const instruments = allInstruments.filter(c => c.payload.assetId.version === '0');

  return (
    <div className="instruments">
      <Tile header={<h2>Actions</h2>}>
        <Button secondary className="ghost" onClick={() => history.push('/app/instrument/new')}>
          New Instrument
        </Button>
      </Tile>

      <StripedTable
        headings={['Issuer', 'Signatories', 'Id', 'Version', 'Description', 'Details']}
        rows={instruments.map(c => [
          getName(c.payload.issuer),
          Object.keys(c.payload.assetId.signatories.textMap).join(', '),
          c.payload.assetId.label,
          c.payload.assetId.version,
          c.payload.description,
          <IconButton
            color="primary"
            size="small"
            component="span"
            onClick={() =>
              history.push('/app/registry/instruments/' + c.contractId.replace('#', '_'))
            }
          >
            <KeyboardArrowRight fontSize="small" />
          </IconButton>,
        ])}
      />
    </div>
  );
};

export const Instruments = withRouter(InstrumentsComponent);
