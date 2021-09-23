import React, { useEffect, useRef, useState } from 'react';
import { useLedger, useParty } from '@daml/react';
import { useStreamQueries } from '../../Main';
import { AssetDescription } from '@daml.js/da-marketplace/lib/Marketplace/Issuance/AssetDescription';
import { render } from '../../components/Claims/render';
import { transformClaim } from '../../components/Claims/util';
import { Id } from '@daml.js/da-marketplace/lib/DA/Finance/Types';
import { Observation } from '@daml.js/da-marketplace/lib/ContingentClaims/Observation';
import { Claim, Inequality } from '@daml.js/da-marketplace/lib/ContingentClaims/Claim/Serializable';
import { Date as DamlDate, Decimal } from '@daml/types';
import { Service as IssuanceService } from '@daml.js/da-marketplace/lib/Marketplace/Issuance/Service';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import Tile from '../../components/Tile/Tile';
import FormErrorHandled from '../../components/Form/FormErrorHandled';
import { Button, Form, Header } from 'semantic-ui-react';
import CalendarInput from '../../components/Form/CalendarInput';
import { makeDamlSet, ServicePageProps } from '../common';
import BackButton from '../../components/Common/BackButton';
import { IconCircledCheck, IconClose } from '../../icons/icons';
import classNames from 'classnames';
import { Service as CustodyService } from '@daml.js/da-marketplace/lib/Marketplace/Custody/Service';

const NewBinaryOptionComponent: React.FC<RouteComponentProps & ServicePageProps<CustodyService>> =
  ({ services, history }) => {
    const el = useRef<HTMLDivElement>(null);

    const [isCall, setIsCall] = useState(true);
    const [underlying, setUnderlying] = useState('');
    const [strike, setStrike] = useState('');
    const [expiry, setExpiry] = useState<Date | null>(null);
    const [currency, setCurrency] = useState('');
    const [label, setLabel] = useState('');
    const [description, setDescription] = useState('');
    const [account, setAccount] = useState('');

    const ledger = useLedger();
    const party = useParty();
    const issuanceServices = useStreamQueries(IssuanceService).contracts;
    const customerServices = issuanceServices.filter(s => s.payload.customer === party);
    const allAssets = useStreamQueries(AssetDescription).contracts;
    const assets = allAssets.filter(
      c => c.payload.claims.tag === 'Zero' && c.payload.assetId.version === '0'
    );
    const accounts = services.map(c => c.payload.account);
    const ccy = assets.find(c => c.payload.assetId.label === currency);
    const ccyId: Id = ccy?.payload.assetId || {
      signatories: makeDamlSet<string>([]),
      label: '',
      version: '0',
    };

    const parseDate = (d: Date | null) =>
      (!!d &&
        d.toString() !== 'Invalid Date' &&
        new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10)) ||
      '';

    const ineqEuropean: Inequality<DamlDate, Id> = {
      tag: 'TimeGte',
      value: parseDate(expiry),
    };
    const obsStrike: Observation<DamlDate, Decimal> = { tag: 'Const', value: { value: strike } };
    const obsSpot: Observation<DamlDate, Decimal> = { tag: 'Observe', value: { key: underlying } };
    const ineqPayoff: Inequality<DamlDate, Decimal> = {
      tag: 'Lte',
      value: isCall ? { _1: obsStrike, _2: obsSpot } : { _1: obsSpot, _2: obsStrike },
    };

    const zero: Claim<DamlDate, Decimal, Id> = { tag: 'Zero', value: {} };
    const oneUsd: Claim<DamlDate, Decimal, Id> = { tag: 'One', value: ccyId };
    const cond: Claim<DamlDate, Decimal, Id> = {
      tag: 'Cond',
      value: { predicate: ineqPayoff, success: oneUsd, failure: zero },
    };
    const choice: Claim<DamlDate, Decimal, Id> = { tag: 'Or', value: { lhs: cond, rhs: zero } };
    const claims: Claim<DamlDate, Decimal, Id> = {
      tag: 'When',
      value: { predicate: ineqEuropean, claim: choice },
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
      await ledger.exercise(IssuanceService.RequestOrigination, service.contractId, {
        assetLabel: label,
        description,
        cfi: { code: 'MMMXXX' },
        claims,
        safekeepingAccount,
        observers: [service.payload.provider, party],
      });
    };

    return (
      <div className="input-dialog">
        <BackButton />
        <Header as="h2">New Binary Option</Header>{' '}
        <FormErrorHandled onSubmit={requestOrigination}>
          <div className="form-select">
            <Button
              type="button"
              className={classNames('ghost checked', { darken: !isCall })}
              onClick={() => setIsCall(true)}
            >
              {isCall && <IconCircledCheck />}
              <p>Call</p>
            </Button>
            <Button
              type="button"
              className={classNames('ghost checked', { darken: isCall })}
              onClick={() => setIsCall(false)}
            >
              {!isCall && <IconCircledCheck />}
              <p>Put</p>
            </Button>
          </div>

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
            label="Strike"
            placeholder="Strike"
            value={strike}
            className="issue-asset-form-field"
            onChange={e => setStrike(e.currentTarget.value)}
          />

          <CalendarInput
            label="Expiry Date"
            placeholder="Expiry Date"
            value={expiry}
            onChange={e => setExpiry(e)}
          />

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

          <Form.Input
            fluid
            label="Instrument ID"
            value={label}
            className="issue-asset-form-field"
            onChange={e => setLabel(e.currentTarget.value)}
          />

          <Form.Input
            fluid
            label="Description"
            value={description}
            className="issue-asset-form-field"
            onChange={e => setDescription(e.currentTarget.value)}
          />

          <Form.Select
            className="issue-asset-form-field select-account"
            placeholder="Safekeeping Account"
            label="Safekeeping Account"
            options={accounts.map(c => ({ text: c.id.label, value: c.id.label }))}
            onChange={(event: React.SyntheticEvent, result: any) => {
              setAccount(result.value);
            }}
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

export const NewBinaryOption = withRouter(NewBinaryOptionComponent);
