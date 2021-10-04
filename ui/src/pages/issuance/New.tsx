import React, { useEffect, useRef, useState } from 'react';
import { useLedger, useParty } from '@daml/react';
import { useStreamQueries } from '../../Main';
import { render } from '../../components/Claims/render';
import { transformClaim } from '../../components/Claims/util';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { AssetDescription } from '@daml.js/da-marketplace/lib/Marketplace/Issuance/AssetDescription';
import { Service as IssuanceService } from '@daml.js/da-marketplace/lib/Marketplace/Issuance/Service';
import { Service as CustodyService } from '@daml.js/da-marketplace/lib/Marketplace/Custody/Service';
import { CreateEvent } from '@daml/ledger';
import FormErrorHandled from '../../components/Form/FormErrorHandled';
import { Button, Form, Header } from 'semantic-ui-react';
import Tile from '../../components/Tile/Tile';
import BackButton from '../../components/Common/BackButton';
import paths from '../../paths';
import { EyeClosed, EyeOpen } from '../../icons/icons';
import _ from 'lodash';

type Props = {
  issuanceServices: Readonly<CreateEvent<IssuanceService, any, any>[]>;
  custodyServices: Readonly<CreateEvent<CustodyService, any, any>[]>;
};

const NewComponent: React.FC<RouteComponentProps & Props> = ({
  history,
  issuanceServices,
  custodyServices,
}) => {
  const el = useRef<HTMLDivElement>(null);

  const [showAsset, setShowAsset] = useState(false);
  const [assetLabel, setAssetLabel] = useState('');
  const [issuanceId, setIssuanceId] = useState('');
  const [quantity, setQuantity] = useState('');

  const ledger = useLedger();
  const party = useParty();
  const customerServices = issuanceServices.filter(s => s.payload.customer === party);
  const registrars = custodyServices
    .filter(s => !_.isEmpty(customerServices.find(i => i.payload.provider === s.payload.provider)))
    .map(s => s.payload.provider);
  const allAssets = useStreamQueries(AssetDescription).contracts;
  const assets = allAssets.filter(
    c =>
      c.payload.issuer === party &&
      c.payload.assetId.version === '0' &&
      registrars.includes(c.payload.registrar)
  );
  const asset = assets.find(c => c.payload.assetId.label === assetLabel);

  const canRequest = !!assetLabel && !!asset && !!issuanceId && !!quantity;

  useEffect(() => {
    if (!el.current || !asset) return;
    el.current.innerHTML = '';
    const data = transformClaim(asset.payload.claims, 'root');
    render(el.current, data);
  }, [el, asset, showAsset]);

  if (_.isEmpty(customerServices))
    return (
      <div>
        <h2>Party "{party}" can not request new issuances.</h2>
      </div>
    );

  const requestIssuance = async () => {
    if (!asset) return;
    const service = customerServices.find(i => i.payload.provider === asset.payload.registrar);
    const custody = custodyServices.find(c => c.payload.provider === asset.payload.registrar);
    if (!service || !custody) return;

    await ledger.exercise(IssuanceService.RequestCreateIssuance, service.contractId, {
      issuanceId,
      account: custody.payload.account,
      assetId: asset.payload.assetId,
      quantity,
    });
    history.push(paths.app.issuance.root);
  };

  return (
    <div className="input-dialog">
      <BackButton />
      <Header as="h2">New Issuance</Header>
      <FormErrorHandled onSubmit={requestIssuance}>
        <div className="form-select">
          <Form.Select
            selection
            placeholder="Asset"
            options={assets.map(c => ({
              text: c.payload.assetId.label,
              value: c.payload.assetId.label,
            }))}
            value={assetLabel}
            onChange={(_, d) => setAssetLabel((d.value && (d.value as string)) || '')}
          />
          <Button className="icon-button ghost" onClick={() => setShowAsset(!showAsset)}>
            {showAsset ? <EyeClosed /> : <EyeOpen />}
          </Button>
        </div>

        <Form.Input
          required
          fluid
          placeholder="Issuance ID"
          value={issuanceId}
          onChange={e => setIssuanceId(e.currentTarget.value)}
        />

        <Form.Input
          required
          fluid
          placeholder="Quantity"
          value={quantity}
          onChange={e => setQuantity(e.currentTarget.value)}
        />

        <Button type="submit" disabled={!canRequest} className="ghost">
          Request Issuance
        </Button>
      </FormErrorHandled>

      {showAsset && (
        <Tile header="Instrument">
          <div ref={el} style={{ height: '400px', overflow: 'hidden' }} />
        </Tile>
      )}
    </div>
  );
};

export const New = withRouter(NewComponent);
