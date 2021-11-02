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
import { useDisplayErrorMessage } from '../../context/MessagesContext';
import { IconClose } from '../../icons/icons';
import paths from '../../paths';
import { makeDamlSet, ServicePageProps } from '../common';

const NewSimpleFutureComponent: React.FC<RouteComponentProps & ServicePageProps<CustodyService>> =
  ({ services, history }) => {
    const el = useRef<HTMLDivElement>(null);
    const emptyId = {
      signatories: makeDamlSet<string>([]),
      label: '',
      version: '0',
    };

    const displayErrorMessage = useDisplayErrorMessage();
    const [underlying, setUnderlying] = useState<Id>(emptyId);
    const [expiry, setExpiry] = useState<Date | null>(null);
    const [multiplier, setMultiplier] = useState('');
    const [label, setLabel] = useState('');
    const [description, setDescription] = useState('');
    const [registrar, setRegistrar] = useState('');

    const ledger = useLedger();
    const party = useParty();
    const issuanceServices = useStreamQueries(IssuanceService).contracts;
    const customerServices = issuanceServices.filter(s => s.payload.customer === party);
    const allAssets = useStreamQueries(AssetDescription).contracts;

    const parseDate = (d: Date | null) =>
      (!!d &&
        d.toString() !== 'Invalid Date' &&
        new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10)) ||
      '';

    const underlyingId: Id = allAssets
      .find(c => c.payload.assetId.label === underlying.label)?.payload.assetId || emptyId;

    const registrars = services
      .filter(
        s => !_.isEmpty(customerServices.find(i => i.payload.provider === s.payload.provider))
      )
      .map(s => s.payload.provider);

    const ineqExpiry: Inequality<DamlDate, Decimal, Id> = {
      tag: 'TimeGte',
      value: parseDate(expiry),
    };

    const obsMult: Observation<DamlDate, Decimal, Id> = { tag: 'Const', value: { value: multiplier } };

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

    if (_.isEmpty(services)) return <>No issuance service found</>;

    const requestOrigination = async () => {
      const service = customerServices.find(i => i.payload.provider === registrar);
      if (!service) {
        return displayErrorMessage({
          header: 'Failed to Create Instrument',
          message: `Couldn't find Issuance service for registrar ${registrar}`,
        });
      }
      await ledger.exercise(IssuanceService.RequestOrigination, service.contractId, {
        assetLabel: label,
        description,
        cfi: { code: 'FXXXXX' },
        claims,
        observers: [service.payload.provider, party],
      });
      history.push(paths.app.instruments.root);
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
            value={underlying.label}
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

export const NewSimpleFuture = withRouter(NewSimpleFutureComponent);
