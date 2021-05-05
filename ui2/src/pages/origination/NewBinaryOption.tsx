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
import Tile from '../../components/Tile/Tile';
import FormErrorHandled from '../../components/Form/FormErrorHandled';
import { Button, Form } from 'semantic-ui-react';
import CalendarInput from '../../components/Form/CalendarInput';

const NewBinaryOptionComponent = ({ history }: RouteComponentProps) => {
  const classes = useStyles();

  const el = useRef<HTMLDivElement>(null);

  const [isCall, setIsCall] = useState(true);
  const [underlying, setUnderlying] = useState('');
  const [strike, setStrike] = useState('');
  const [expiry, setExpiry] = useState<Date | null>(null);
  const [currency, setCurrency] = useState('');
  const [label, setLabel] = useState('');
  const [description, setDescription] = useState('');
  const [account, setAccount] = useState('');

  const canRequest =
    !!underlying && !!strike && !!expiry && !!currency && !!label && !!description && !!account;

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

  const parseDate = (d: Date | null) =>
    (!!d &&
      d.toString() !== 'Invalid Date' &&
      new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10)) ||
    '';

  const obsToday: Observation<DamlDate, Id> = { tag: 'DateIdentity', value: {} };
  const obsExpiry: Observation<DamlDate, Id> = { tag: 'DateConst', value: parseDate(expiry) };
  const obsEuropean: Observation<DamlDate, Id> = {
    tag: 'DateEqu',
    value: { _1: obsToday, _2: obsExpiry },
  };
  const obsStrike: Observation<DamlDate, Id> = { tag: 'DecimalConst', value: strike };
  const obsSpot: Observation<DamlDate, Id> = { tag: 'DecimalObs', value: underlying };
  const obsPayoff: Observation<DamlDate, Id> = {
    tag: 'DecimalLte',
    value: isCall ? { _1: obsStrike, _2: obsSpot } : { _1: obsSpot, _2: obsStrike },
  };

  const zero: Claim<DamlDate, Id> = { tag: 'Zero', value: {} };
  const oneUsd: Claim<DamlDate, Id> = { tag: 'One', value: ccyId };
  const cond: Claim<DamlDate, Id> = {
    tag: 'Cond',
    value: { predicate: obsPayoff, success: oneUsd, failure: zero },
  };
  const choice: Claim<DamlDate, Id> = { tag: 'Or', value: { lhs: cond, rhs: zero } };
  const claims: Claim<DamlDate, Id> = {
    tag: 'When',
    value: { predicate: obsEuropean, claim: choice },
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
    <div className="new-binary-option">
      <h2>New Binary Option</h2>
      <Tile header={<h5>Details</h5>}>
        <FormErrorHandled onSubmit={requestOrigination}>
          <Button.Group>
            <Button active={isCall} onClick={() => setIsCall(true)}>
              Call
            </Button>
            <Button.Or />
            <Button active={!isCall} onClick={() => setIsCall(false)}>
              Put
            </Button>
          </Button.Group>

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
              label="Strike"
              placeholder="Strike"
              value={strike}
              className="issue-asset-form-field"
              onChange={e => setStrike(e.currentTarget.value)}
            />
          </div>

          <div className="asset-row">
            <CalendarInput
              label="Expiry Date"
              placeholder="Expiry Date"
              value={expiry}
              onChange={e => setExpiry(e)}
            />
          </div>

          <div className="asset-row">
            <Form.Select
              className="issue-asset-form-field select-account"
              placeholder="Payout Currency"
              label="Payout Currency"
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
              label="Instrument ID"
              value={label}
              className="issue-asset-form-field"
              onChange={e => setLabel(e.currentTarget.value)}
            />
          </div>

          <div className="asset-row">
            <Form.Input
              fluid
              label="Description"
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

export const NewBinaryOption = withRouter(NewBinaryOptionComponent);
