import React, { useEffect, useRef, useState } from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Button, Form, Header, Icon } from 'semantic-ui-react';

import { useLedger, useParty } from '@daml/react';

import { Service as MarketClearingService } from '@daml.js/da-marketplace/lib/Marketplace/Clearing/Market/Service';
import { AssetDescription } from '@daml.js/da-marketplace/lib/Marketplace/Issuance/AssetDescription';
import {
  ListingTypeRequest,
  RequestCreateListing,
  Service,
} from '@daml.js/da-marketplace/lib/Marketplace/Listing/Service';

import { useStreamQueries } from '../../Main';
import { render } from '../../components/Claims/render';
import { transformClaim } from '../../components/Claims/util';
import BackButton from '../../components/Common/BackButton';
import FormErrorHandled from '../../components/Form/FormErrorHandled';
import Tile from '../../components/Tile/Tile';
import { usePartyName } from '../../config';
import { IconClose } from '../../icons/icons';
import paths from '../../paths';
import { preciseInputSteps } from '../../util';
import { createDropdownProp, ServicePageProps, usePublicParty } from '../common';

const COLLATERALIZED_VALUE = 'COLLATERALIZED_MARKET';

const NewComponent: React.FC<RouteComponentProps & ServicePageProps<Service>> = ({
  history,
  services,
}) => {
  const el1 = useRef<HTMLDivElement>(null);
  const el2 = useRef<HTMLDivElement>(null);

  const [showTradedAsset, setShowTradedAsset] = useState(false);
  const [showQuotedAsset, setShowQuotedAsset] = useState(false);

  const [tradedAssetLabel, setTradedAssetLabel] = useState('');
  const [tradedAssetPrecision, setTradedAssetPrecision] = useState('');
  const [quotedAssetLabel, setQuotedAssetLabel] = useState('');
  const [quotedAssetPrecision, setQuotedAssetPrecision] = useState('');
  const [minimumTradableQuantity, setMinimumTradableQuantity] = useState('');
  const [maximumTradableQuantity, setMaximumTradableQuantity] = useState('');
  const [listingId, setListingId] = useState('');
  const [description, setDescription] = useState('');
  const [calendarId] = useState('1261007448');
  const [clearedBy, setClearedBy] = useState<string>(COLLATERALIZED_VALUE);

  const ledger = useLedger();
  const party = useParty();
  const publicParty = usePublicParty();
  const { getName } = usePartyName(party);
  const clearedMarketServices = useStreamQueries(MarketClearingService).contracts;
  const customerServices = services.filter(s => s.payload.customer === party);
  const allAssets = useStreamQueries(AssetDescription).contracts;
  const assets = allAssets.filter(c => c.payload.assetId.version === '0');
  const tradedAsset = assets.find(c => c.payload.assetId.label === tradedAssetLabel);
  const quotedAsset = assets.find(c => c.payload.assetId.label === quotedAssetLabel);

  const canRequest =
    !!tradedAssetLabel &&
    !!tradedAsset &&
    !!tradedAssetPrecision &&
    !!quotedAssetLabel &&
    !!quotedAsset &&
    !!quotedAssetPrecision &&
    !!minimumTradableQuantity &&
    !!maximumTradableQuantity &&
    !!listingId &&
    !!calendarId;

  useEffect(() => {
    if (!el1.current || !tradedAsset) return;
    el1.current.innerHTML = '';
    const data = transformClaim(tradedAsset.payload.claims, 'root');
    render(el1.current, data);
  }, [el1, tradedAsset, showTradedAsset]);

  useEffect(() => {
    if (!el2.current || !quotedAsset) return;
    el2.current.innerHTML = '';
    const data = transformClaim(quotedAsset.payload.claims, 'root');
    render(el2.current, data);
  }, [el2, quotedAsset, showQuotedAsset]);

  const service = customerServices[0];
  if (!service) return <></>;

  const requestListing = async () => {
    if (!tradedAsset || !quotedAsset || !publicParty) return;
    const isCollateralized = clearedBy === COLLATERALIZED_VALUE;
    const listingType: ListingTypeRequest = isCollateralized
      ? { tag: 'CollateralizedRequest', value: {} }
      : { tag: 'ClearedRequest', value: clearedBy };
    const request: RequestCreateListing = {
      symbol: listingId,
      listingType,
      calendarId,
      description,
      tradedAssetId: tradedAsset.payload.assetId,
      quotedAssetId: quotedAsset.payload.assetId,
      tradedAssetPrecision,
      quotedAssetPrecision,
      minimumTradableQuantity,
      maximumTradableQuantity,
      observers: [publicParty],
    };
    await ledger.exercise(Service.RequestCreateListing, service.contractId, request);
    history.push(paths.app.listings.root);
  };

  const { step, placeholder } = preciseInputSteps(+tradedAssetPrecision);

  return (
    <div className="input-dialog">
      <BackButton />
      <Header as="h2">New Base Instrument</Header>
      <FormErrorHandled onSubmit={() => requestListing()}>
        <div className="form-select">
          <Form.Select
            className="select"
            label="Traded Asset"
            placeholder="Select..."
            required
            options={assets
              .filter(c => c.payload.assetId.label !== quotedAssetLabel)
              .map(c => ({
                key: c.payload.assetId.label,
                text: c.payload.assetId.label,
                value: c.payload.assetId.label,
              }))}
            onChange={(_, change) => setTradedAssetLabel(change.value as string)}
          />
          {showTradedAsset ? (
            <Icon name="eye slash" link onClick={() => setShowTradedAsset(false)} />
          ) : (
            <Icon name="eye" link onClick={() => setShowTradedAsset(true)} />
          )}
        </div>
        <Form.Input
          label="Traded Asset Precision"
          type="number"
          required
          onChange={(_, change) => setTradedAssetPrecision(change.value as string)}
        />
        <div className="form-select">
          <Form.Select
            className="select"
            label="Quoted Asset"
            placeholder="Select..."
            required
            options={assets
              .filter(c => c.payload.assetId.label !== tradedAssetLabel)
              .map(c => ({
                key: c.payload.assetId.label,
                text: c.payload.assetId.label,
                value: c.payload.assetId.label,
              }))}
            onChange={(_, change) => setQuotedAssetLabel(change.value as string)}
          />
          {showQuotedAsset ? (
            <Icon name="eye slash" link onClick={() => setShowQuotedAsset(false)} />
          ) : (
            <Icon name="eye" link onClick={() => setShowQuotedAsset(true)} />
          )}
        </div>
        <Form.Input
          label="Quoted Asset Precision"
          type="number"
          required
          onChange={(_, change) => setQuotedAssetPrecision(change.value as string)}
        />
        <Form.Input
          required
          label="Minimum Tradable Quantity"
          type="number"
          step={step}
          placeholder={placeholder}
          disabled={!tradedAssetPrecision || !tradedAssetLabel}
          onChange={(_, change) => setMinimumTradableQuantity(change.value as string)}
        />
        <Form.Input
          required
          label="Maximum Tradable Quantity"
          type="number"
          step={step}
          placeholder={placeholder}
          disabled={!tradedAssetPrecision || !tradedAssetLabel}
          onChange={(_, change) => setMaximumTradableQuantity(change.value as string)}
        />
        <Form.Input
          label="Symbol"
          required
          onChange={(_, change) => setListingId(change.value as string)}
        />
        <Form.Input
          label="Description"
          required
          onChange={(_, change) => setDescription(change.value as string)}
        />
        <Form.Select
          className="select"
          label="Cleared by"
          placeholder="Select..."
          required
          value={clearedBy}
          options={[
            createDropdownProp('-- Collateralized Market --', COLLATERALIZED_VALUE),
            ...clearedMarketServices.map(cms =>
              createDropdownProp(getName(cms.payload.provider), cms.payload.provider)
            ),
          ]}
          onChange={(_, change) => setClearedBy(change.value as string)}
        />
        <Form.Input label="Trading Calendar ID" required readOnly placeholder={calendarId} />
        <div className="submit-form">
          <Button type="submit" className="ghost" disabled={!canRequest} content="Submit" />
          <Button className="a a2" onClick={() => history.goBack()}>
            <IconClose /> Cancel
          </Button>
        </div>
      </FormErrorHandled>
      <div className="asset">
        {showTradedAsset && (
          <Tile header="Auctioned Asset">
            <div ref={el1} style={{ height: '100%' }} />
          </Tile>
        )}
        {showQuotedAsset && (
          <Tile header="Quoted Asset">
            <div ref={el2} style={{ height: '100%' }} />
          </Tile>
        )}
      </div>
    </div>
  );
};

export const New = withRouter(NewComponent);
