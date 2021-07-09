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
import { Service } from '@daml.js/da-marketplace/lib/Marketplace/Issuance/Service';
import { AssetSettlementRule } from '@daml.js/da-marketplace/lib/DA/Finance/Asset/Settlement';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import Tile from '../../components/Tile/Tile';
import FormErrorHandled from '../../components/Form/FormErrorHandled';
import { Button, Form, Header } from 'semantic-ui-react';
import CalendarInput from '../../components/Form/CalendarInput';
import { makeDamlSet } from '../common';
import BackButton from '../../components/Common/BackButton';
import { IconClose } from '../../icons/icons';
import { useDisplayErrorMessage } from '../../context/MessagesContext';

const NewSimpleFutureComponent = ({ history }: RouteComponentProps) => {
  const el = useRef<HTMLDivElement>(null);

  const displayErrorMessage = useDisplayErrorMessage();
  const [underlying, setUnderlying] = useState('');
  const [expiry, setExpiry] = useState<Date | null>(null);
  const [multiplier, setMultiplier] = useState('');
  const [label, setLabel] = useState('');
  const [description, setDescription] = useState('');
  const [account, setAccount] = useState('');

  const ledger = useLedger();
  const party = useParty();
  const services = useStreamQueries(Service).contracts;
  const customerServices = services.filter(s => s.payload.customer === party);
  const allAssets = useStreamQueries(AssetDescription).contracts;
  const assetSettlementRules = useStreamQueries(AssetSettlementRule).contracts;
  const accounts = assetSettlementRules.map(c => c.payload.account);

  const parseDate = (d: Date | null) =>
    (!!d &&
      d.toString() !== 'Invalid Date' &&
      new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10)) ||
    '';

  const underlyingId: Id = allAssets.find(c => c.payload.assetId.label === underlying)?.payload
    .assetId || {
    signatories: makeDamlSet<string>([]),
    label: '',
    version: '0',
  };

  const ineqExpiry: Inequality<DamlDate, Id> = {
    tag: 'TimeGte',
    value: parseDate(expiry),
  };

  const obsMult: Observation<DamlDate, Decimal> = { tag: 'Const', value: { value: multiplier } };

  const oneUnderlying: Claim<DamlDate, Decimal, Id> = { tag: 'One', value: underlyingId };

  const scale: Claim<DamlDate, Decimal, Id> = {
    tag: 'Scale',
    value: { k: obsMult, claim: oneUnderlying },
  };

  const claims: Claim<DamlDate, Decimal, Id> = {
    tag: 'When',
    value: { predicate: ineqExpiry, claim: scale },
  };

  useEffect(() => {
    if (!el.current) return;
    el.current.innerHTML = '';
    const data = transformClaim(claims, 'root');
    render(el.current, data);
  }, [el, claims]);

  const service = customerServices[0];
  if (!service) return <>No issuance service found</>;

  const requestOrigination = async () => {
    const safekeepingAccount = accounts.find(
      a => a.provider === service.payload.provider && a.id.label === account
    );
    if (!safekeepingAccount) {
      return displayErrorMessage({
        header: 'Failed to Create Instrument',
        message: `Couldn't find account from provider ${service.payload.provider} with label ${account}`,
      });
    }
    await ledger.exercise(Service.RequestOrigination, service.contractId, {
      assetLabel: label,
      description,
      cfi: { code: 'FXXXXX' },
      claims,
      safekeepingAccount,
      observers: [service.payload.provider, party],
    });
  };

  return (
    <div className="input-dialog">
      <BackButton />
      <Header as="h2">New Simple Future</Header>{' '}
      <FormErrorHandled onSubmit={requestOrigination}>
        <Form.Select
          className="issue-asset-form-field select-account"
          placeholder="Underlying"
          label="Underlying"
          value={underlying}
          options={allAssets.map(c => ({
            text: c.payload.assetId.label,
            value: c.payload.assetId.label,
          }))}
          onChange={(event: React.SyntheticEvent, result: any) => {
            setUnderlying(result.value);
          }}
        />

        <Form.Input
          fluid
          number
          label="Multiplier"
          placeholder="Multiplier"
          value={multiplier}
          className="issue-asset-form-field"
          onChange={e => setMultiplier(e.currentTarget.value)}
        />

        <CalendarInput
          label="Expiry Date"
          placeholder="Expiry Date"
          value={expiry}
          onChange={e => setExpiry(e)}
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

export const NewSimpleFuture = withRouter(NewSimpleFutureComponent);
