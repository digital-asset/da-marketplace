import React, { useEffect, useRef, useState } from 'react';
import { useLedger, useParty } from '@daml/react';
import { useStreamQueries } from '../../Main';
import { MenuProps } from '@material-ui/core';
import useStyles from '../styles';
import { AssetDescription } from '@daml.js/da-marketplace/lib/Marketplace/Issuance/AssetDescription';
import { render } from '../../components/Claims/render';
import { transformClaim } from '../../components/Claims/util';
import { Id } from '@daml.js/da-marketplace/lib/DA/Finance/Types';
import { Observation } from '@daml.js/da-marketplace/lib/ContingentClaims/Observation';
import { Claim } from '@daml.js/da-marketplace/lib/ContingentClaims/Claim/Serializable';
import { Date as DamlDate } from '@daml/types';
import { Service } from '@daml.js/da-marketplace/lib/Marketplace/Issuance/Service';
import { AssetSettlementRule } from '@daml.js/da-marketplace/lib/DA/Finance/Asset/Settlement';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import FormErrorHandled from '../../components/Form/FormErrorHandled';
import Tile from '../../components/Tile/Tile';
import { Button, Form } from 'semantic-ui-react';
import CalendarInput from '../../components/Form/CalendarInput';

const NewConvertibleNoteComponent = ({ history }: RouteComponentProps) => {
  const classes = useStyles();

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
  const [account, setAccount] = useState('');

  const canRequest =
    !!underlying &&
    !!principal &&
    !!currency &&
    !!discount &&
    !!interest &&
    !!cap &&
    !!maturity &&
    !!label &&
    !!description &&
    !!account;

  const ledger = useLedger();
  const party = useParty();
  const services = useStreamQueries(Service).contracts;
  const customerServices = services.filter(s => s.payload.customer === party);
  const allAssets = useStreamQueries(AssetDescription).contracts;
  const assets = allAssets.filter(
    c => c.payload.claims.tag === 'Zero' && c.payload.assetId.version === '0'
  );
  const assetSettlementRules = useStreamQueries(AssetSettlementRule).contracts;
  const accounts = assetSettlementRules.map(c => c.payload.account);
  const ccy = assets.find(c => c.payload.assetId.label === currency);
  const ccyId: Id = ccy?.payload.assetId || {
    signatories: { textMap: {} },
    label: '',
    version: '0',
  };
  const asset = assets.find(c => c.payload.assetId.label === underlying);
  const assetId: Id = asset?.payload.assetId || {
    signatories: { textMap: {} },
    label: '',
    version: '0',
  };

  const parseDate = (d: Date | null) =>
    (!!d &&
      d.toString() !== 'Invalid Date' &&
      new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10)) ||
    '';

  const obsToday: Observation<DamlDate, Id> = { tag: 'DateIdentity', value: {} };
  const obsExpiry: Observation<DamlDate, Id> = { tag: 'DateConst', value: parseDate(maturity) };
  const obsEuropean: Observation<DamlDate, Id> = {
    tag: 'DateEqu',
    value: { _1: obsToday, _2: obsExpiry },
  };
  const obsPrincipal: Observation<DamlDate, Id> = {
    tag: 'DecimalConst',
    value: (parseFloat(principal || '0') * (1.0 + parseFloat(interest || '0'))).toString(),
  };
  const obsCap: Observation<DamlDate, Id> = { tag: 'DecimalConst', value: cap };
  const obsDiscount: Observation<DamlDate, Id> = {
    tag: 'DecimalConst',
    value: (1.0 - parseFloat(discount || '0')).toFixed(2),
  };
  const obsSpot: Observation<DamlDate, Id> = { tag: 'DecimalObs', value: underlying };
  const obsPayoff: Observation<DamlDate, Id> = {
    tag: 'DecimalLte',
    value: { _1: obsSpot, _2: obsCap },
  };
  const obsDiscounted: Observation<DamlDate, Id> = {
    tag: 'DecimalMul',
    value: { _1: obsSpot, _2: obsDiscount },
  };
  const obsConversion: Observation<DamlDate, Id> = {
    tag: 'DecimalDiv',
    value: { _1: obsPrincipal, _2: obsDiscounted },
  };

  const oneUsd: Claim<DamlDate, Id> = { tag: 'One', value: ccyId };
  const oneAsset: Claim<DamlDate, Id> = { tag: 'One', value: assetId };
  const notional: Claim<DamlDate, Id> = {
    tag: 'Scale',
    value: { k: obsPrincipal, claim: oneUsd },
  };
  const conversion: Claim<DamlDate, Id> = {
    tag: 'Scale',
    value: { k: obsConversion, claim: oneAsset },
  };
  const cond: Claim<DamlDate, Id> = {
    tag: 'Cond',
    value: { predicate: obsPayoff, success: conversion, failure: notional },
  };
  const claims: Claim<DamlDate, Id> = {
    tag: 'When',
    value: { predicate: obsEuropean, claim: cond },
  };

  useEffect(() => {
    if (!el.current) return;
    el.current.innerHTML = '';
    const data = transformClaim(claims, 'root');
    render(el.current, data);
  }, [el, claims]);

  const service = customerServices[0];
  if (!service) return <></>;

  const requestOrigination = async () => {
    const safekeepingAccount = accounts.find(
      a => a.provider === service.payload.provider && a.id.label === account
    );
    if (!safekeepingAccount) {
      console.log(
        `Couldn't find account from provider ${service.payload.provider} with label ${account}`
      );
      return;
    }
    await ledger.exercise(Service.RequestOrigination, service.contractId, {
      assetLabel: label,
      description,
      claims,
      safekeepingAccount,
      observers: [service.payload.provider, party],
    });
    history.push('/app/instrument/requests');
  };

  const menuProps: Partial<MenuProps> = {
    anchorOrigin: { vertical: 'bottom', horizontal: 'left' },
    transformOrigin: { vertical: 'top', horizontal: 'left' },
    getContentAnchorEl: null,
  };
  return (
    <div className="new-convertible-note">
      <h2>New Convertible Note</h2>
      <Tile header={<h5>Details</h5>}>
        <FormErrorHandled onSubmit={requestOrigination}>
          <div className="asset-row">
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
          </div>

          <div className="asset-row">
            <Form.Input
              fluid
              type="number"
              label="Principal"
              placeholder="Prinicipal"
              value={principal}
              className="issue-asset-form-field"
              onChange={e => setPrincipal(e.currentTarget.value)}
            />
          </div>

          <div className="asset-row">
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
          </div>

          <div className="asset-row">
            <Form.Input
              fluid
              type="number"
              label="Interest"
              placeholder="Interest"
              value={interest}
              className="issue-asset-form-field"
              onChange={e => setInterest(e.currentTarget.value)}
            />
          </div>

          <div className="asset-row">
            <Form.Input
              fluid
              type="number"
              label="Cap Price"
              placeholder="Cap Price"
              value={cap}
              className="issue-asset-form-field"
              onChange={e => setCap(e.currentTarget.value)}
            />
          </div>

          <div className="asset-row">
            <Form.Input
              fluid
              type="number"
              label="Discount"
              placeholder="Discount"
              value={discount}
              className="issue-asset-form-field"
              onChange={e => setDiscount(e.currentTarget.value)}
            />
          </div>

          <div className="asset-row">
            <CalendarInput
              label="Maturity Date"
              placeholder="Maturity Date"
              value={maturity}
              onChange={e => setMaturity(e)}
            />
          </div>

          <div className="asset-row">
            <Form.Input
              fluid
              label="Instrument ID"
              placeholder="Instrument ID"
              value={label}
              className="issue-asset-form-field"
              onChange={e => setLabel(e.currentTarget.value)}
            />
          </div>

          <div className="asset-row">
            <Form.Input
              fluid
              label="Description"
              placeholder="Description"
              value={description}
              className="issue-asset-form-field"
              onChange={e => setDescription(e.currentTarget.value)}
            />
          </div>

          <div className="asset-row">
            <Form.Select
              className="issue-asset-form-field select-account"
              placeholder="Safekeeping Account"
              label="Safekeeping Account"
              options={accounts.map(c => ({ text: c.id.label, value: c.id.label }))}
              onChange={(event: React.SyntheticEvent, result: any) => {
                setAccount(result.value);
              }}
            />
          </div>

          <Button className="ghost submit" type="submit" content="Request Origination" />
        </FormErrorHandled>
      </Tile>
      <Tile header={<h5>Payoff</h5>}>
        <div ref={el} style={{ height: '100%' }} />
      </Tile>
    </div>
  );
};

export const NewConvertibleNote = withRouter(NewConvertibleNoteComponent);
