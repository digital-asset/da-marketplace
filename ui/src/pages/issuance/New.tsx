import React, { useEffect, useRef, useState } from 'react';
import { useLedger, useParty } from '@daml/react';
import { useStreamQueries } from '../../Main';
import { render } from '../../components/Claims/render';
import { transformClaim } from '../../components/Claims/util';
import { AssetSettlementRule } from '@daml.js/da-marketplace/lib/DA/Finance/Asset/Settlement';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { AssetDescription } from '@daml.js/da-marketplace/lib/Marketplace/Issuance/AssetDescription';
import { Service } from '@daml.js/da-marketplace/lib/Marketplace/Issuance/Service';
import { CreateEvent } from '@daml/ledger';
import FormErrorHandled from '../../components/Form/FormErrorHandled';
import { Button, Form, Header } from 'semantic-ui-react';
import Tile from '../../components/Tile/Tile';
import BackButton from '../../components/Common/BackButton';
import paths from '../../paths';
import { EyeClosed, EyeOpen } from '../../icons/icons';

type Props = {
  services: Readonly<CreateEvent<Service, any, any>[]>;
};

const NewComponent: React.FC<RouteComponentProps & Props> = ({
  history,
  services,
}: RouteComponentProps & Props) => {
  const el = useRef<HTMLDivElement>(null);

  const [showAsset, setShowAsset] = useState(false);
  const [assetLabel, setAssetLabel] = useState('');
  const [accountLabel, setAccountLabel] = useState('');
  const [issuanceId, setIssuanceId] = useState('');
  const [quantity, setQuantity] = useState('');

  const ledger = useLedger();
  const party = useParty();
  const customerServices = services.filter(s => s.payload.customer === party);
  const allAssets = useStreamQueries(AssetDescription).contracts;
  const assets = allAssets.filter(
    c => c.payload.issuer === party && c.payload.assetId.version === '0'
  );
  const asset = assets.find(c => c.payload.assetId.label === assetLabel);
  const assetSettlementRules = useStreamQueries(AssetSettlementRule).contracts;
  const accounts = assetSettlementRules.map(c => c.payload.account);
  const account = accounts.find(a => a.id.label === accountLabel);

  const canRequest =
    !!assetLabel && !!asset && !!accountLabel && !!account && !!issuanceId && !!quantity;

  useEffect(() => {
    if (!el.current || !asset) return;
    el.current.innerHTML = '';
    const data = transformClaim(asset.payload.claims, 'root');
    render(el.current, data);
  }, [el, asset, showAsset]);

  const service = customerServices[0];
  if (!service)
    return (
      <div>
        <h2>Party "{party}" can not request new issuances.</h2>
      </div>
    );

  const requestIssuance = async () => {
    if (!asset || !account) return;
    await ledger.exercise(Service.RequestCreateIssuance, service.contractId, {
      issuanceId,
      accountId: account.id,
      assetId: asset.payload.assetId,
      quantity,
    });
    history.push(paths.app.manage.issuance);
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

        <Form.Select
          selection
          placeholder="Issuance Account"
          options={accounts.map(c => ({
            text: c.id.label,
            value: c.id.label,
          }))}
          value={accountLabel}
          onChange={(_, d) => setAccountLabel((d.value && (d.value as string)) || '')}
        />

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
