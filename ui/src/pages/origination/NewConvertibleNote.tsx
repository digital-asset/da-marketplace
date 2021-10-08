import _ from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Button, Form, Header } from 'semantic-ui-react';

import { useLedger, useParty } from '@daml/react';
import { Date as DamlDate, Decimal } from '@daml/types';

import { Claim, Inequality } from '@daml.js/da-marketplace/lib/ContingentClaims/Claim/Serializable';
import { Observation } from '@daml.js/da-marketplace/lib/ContingentClaims/Observation';
import { Id } from '@daml.js/da-marketplace/lib/DA/Finance/Types';
import { Service as CustodyService } from '@daml.js/da-marketplace/lib/Marketplace/Custody/Service';
import { AssetDescription } from '@daml.js/da-marketplace/lib/Marketplace/Issuance/AssetDescription';
import { Service as IssuanceService } from '@daml.js/da-marketplace/lib/Marketplace/Issuance/Service';

import { useStreamQueries } from '../../Main';
import { render } from '../../components/Claims/render';
import { transformClaim } from '../../components/Claims/util';
import BackButton from '../../components/Common/BackButton';
import CalendarInput from '../../components/Form/CalendarInput';
import FormErrorHandled from '../../components/Form/FormErrorHandled';
import Tile from '../../components/Tile/Tile';
import { IconClose } from '../../icons/icons';
import paths from '../../paths';
import { makeDamlSet, ServicePageProps } from '../common';

const NewConvertibleNoteComponent: React.FC<
  RouteComponentProps & ServicePageProps<CustodyService>
> = ({ services, history }) => {
  const el = useRef<HTMLDivElement>(null);

  const [underlying, setUnderlying] = useState('');
  const [principal, setPrincipal] = useState('');
  const [currency, setCurrency] = useState('');
  const [interest, setInterest] = useState('');
  const [discount, setDiscount] = useState('');
  const [cap, setCap] = useState('');
  const [maturity, setMaturity] = useState<Date | null>(null);
  const [label, setLabel] = useState('');
  const [description, setDescription] = useState('');
  const [registrar, setRegistrar] = useState('');

  const ledger = useLedger();
  const party = useParty();
  const issuanceServices = useStreamQueries(IssuanceService).contracts;
  const customerServices = issuanceServices.filter(s => s.payload.customer === party);
  const allAssets = useStreamQueries(AssetDescription).contracts;
  const assets = allAssets.filter(
    c => c.payload.claims.tag === 'Zero' && c.payload.assetId.version === '0'
  );
  const ccy = assets.find(c => c.payload.assetId.label === currency);
  const ccyId: Id = ccy?.payload.assetId || {
    signatories: makeDamlSet<string>([]),
    label: '',
    version: '0',
  };
  const asset = assets.find(c => c.payload.assetId.label === underlying);
  const assetId: Id = asset?.payload.assetId || {
    signatories: makeDamlSet<string>([]),
    label: '',
    version: '0',
  };
  const registrars = services
    .filter(s => !_.isEmpty(customerServices.find(i => i.payload.provider === s.payload.provider)))
    .map(s => s.payload.provider);

  const parseDate = (d: Date | null) =>
    (!!d &&
      d.toString() !== 'Invalid Date' &&
      new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10)) ||
    '';

  const ineqEuropean: Inequality<DamlDate, Decimal> = {
    tag: 'TimeGte',
    value: parseDate(maturity),
  };
  const obsPrincipal: Observation<DamlDate, Decimal> = {
    tag: 'Const',
    value: {
      value: (parseFloat(principal || '0') * (1.0 + parseFloat(interest || '0'))).toString(),
    },
  };
  const obsCap: Observation<DamlDate, Decimal> = { tag: 'Const', value: { value: cap } };
  const obsDiscount: Observation<DamlDate, Decimal> = {
    tag: 'Const',
    value: { value: (1.0 - parseFloat(discount || '0')).toFixed(2) },
  };
  const obsSpot: Observation<DamlDate, Decimal> = { tag: 'Observe', value: { key: underlying } };
  const ineqPayoff: Inequality<DamlDate, Decimal> = {
    tag: 'Lte',
    value: { _1: obsSpot, _2: obsCap },
  };
  const obsDiscounted: Observation<DamlDate, Decimal> = {
    tag: 'Mul',
    value: { _1: obsSpot, _2: obsDiscount },
  };
  const obsConversion: Observation<DamlDate, Decimal> = {
    tag: 'Div',
    value: { _1: obsPrincipal, _2: obsDiscounted },
  };

  const oneUsd: Claim<DamlDate, Decimal, Id> = { tag: 'One', value: ccyId };
  const oneAsset: Claim<DamlDate, Decimal, Id> = { tag: 'One', value: assetId };
  const notional: Claim<DamlDate, Decimal, Id> = {
    tag: 'Scale',
    value: { k: obsPrincipal, claim: oneUsd },
  };
  const conversion: Claim<DamlDate, Decimal, Id> = {
    tag: 'Scale',
    value: { k: obsConversion, claim: oneAsset },
  };
  const cond: Claim<DamlDate, Decimal, Id> = {
    tag: 'Cond',
    value: { predicate: ineqPayoff, success: conversion, failure: notional },
  };
  const claims: Claim<DamlDate, Decimal, Id> = {
    tag: 'When',
    value: { predicate: ineqEuropean, claim: cond },
  };

  useEffect(() => {
    if (!el.current) return;
    el.current.innerHTML = '';
    const data = transformClaim(claims, 'root');
    render(el.current, data);
  }, [el, claims]);

  if (_.isEmpty(customerServices)) return <></>;

  const requestOrigination = async () => {
    const service = customerServices.find(i => i.payload.provider === registrar);
    if (!service) return;

    await ledger.exercise(IssuanceService.RequestOrigination, service.contractId, {
      assetLabel: label,
      description,
      cfi: { code: 'ECXXXX' },
      claims,
      observers: [service.payload.provider, party],
    });
    history.push(paths.app.instruments.root);
  };

  return (
    <div className="input-dialog">
      <BackButton />
      <Header as="h2">New Convertible Note</Header>
      <FormErrorHandled onSubmit={requestOrigination}>
        <Form.Select
          className="issue-asset-form-field select-account"
          placeholder="Underlying"
          label="Underlying"
          value={underlying}
          options={assets.map(c => ({
            text: c.payload.assetId.label,
            value: c.payload.assetId.label,
          }))}
          onChange={(event: React.SyntheticEvent, result: any) => {
            setUnderlying(result.value);
          }}
        />

        <Form.Input
          fluid
          type="number"
          label="Principal"
          placeholder="Prinicipal"
          value={principal}
          className="issue-asset-form-field"
          onChange={e => setPrincipal(e.currentTarget.value)}
        />

        <Form.Select
          className="issue-asset-form-field select-account"
          placeholder="Principal Currency"
          label="Principal Currency"
          value={currency}
          options={assets.map(c => ({
            text: c.payload.assetId.label,
            value: c.payload.assetId.label,
          }))}
          onChange={(event: React.SyntheticEvent, result: any) => {
            setCurrency(result.value);
          }}
        />

        <Form.Input
          fluid
          type="number"
          label="Interest"
          placeholder="Interest"
          value={interest}
          className="issue-asset-form-field"
          onChange={e => setInterest(e.currentTarget.value)}
        />

        <Form.Input
          fluid
          type="number"
          label="Cap Price"
          placeholder="Cap Price"
          value={cap}
          className="issue-asset-form-field"
          onChange={e => setCap(e.currentTarget.value)}
        />

        <Form.Input
          fluid
          type="number"
          label="Discount"
          placeholder="Discount"
          value={discount}
          className="issue-asset-form-field"
          onChange={e => setDiscount(e.currentTarget.value)}
        />

        <CalendarInput
          label="Maturity Date"
          placeholder="Maturity Date"
          value={maturity}
          onChange={e => setMaturity(e)}
        />

        <Form.Input
          fluid
          label="Instrument ID"
          placeholder="Instrument ID"
          value={label}
          className="issue-asset-form-field"
          onChange={e => setLabel(e.currentTarget.value)}
        />

        <Form.Input
          fluid
          label="Description"
          placeholder="Description"
          value={description}
          className="issue-asset-form-field"
          onChange={e => setDescription(e.currentTarget.value)}
        />

        <Form.Select
          label="Registrar"
          className="issue-asset-form-field select-account"
          placeholder="Select Registrar..."
          options={registrars.map(r => ({ text: r, value: r }))}
          onChange={(_, result: any) => setRegistrar(result.value)}
        />

        <div className="submit-form">
          <Button className="ghost" type="submit" content="Request Origination" />
          <Button className="a a2" onClick={() => history.goBack()}>
            <IconClose /> Cancel
          </Button>
        </div>
      </FormErrorHandled>
      <Tile header="Payoff">
        <div ref={el} style={{ height: '100%' }} />
      </Tile>
    </div>
  );
};

export const NewConvertibleNote = withRouter(NewConvertibleNoteComponent);
