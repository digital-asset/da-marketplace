import React, { useEffect, useRef, useState } from 'react';
import { useLedger, useParty } from '@daml/react';
import { render } from '../../components/Claims/render';
import { transformClaim } from '../../components/Claims/util';
import { Id } from '@daml.js/da-marketplace/lib/DA/Finance/Types';
import { Claim } from '@daml.js/da-marketplace/lib/ContingentClaims/Claim/Serializable';
import { Date as DamlDate, Decimal } from '@daml/types';
import { Service as IssuanceService } from '@daml.js/da-marketplace/lib/Marketplace/Issuance/Service';
import { Service as CustodyService } from '@daml.js/da-marketplace/lib/Marketplace/Custody/Service';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import FormErrorHandled from '../../components/Form/FormErrorHandled';
import { Button, Form, Header } from 'semantic-ui-react';
import classNames from 'classnames';
import { IconCircledCheck, LockIcon, PublicIcon, IconClose } from '../../icons/icons';
import { publicParty } from '../../config';
import BackButton from '../../components/Common/BackButton';
import paths from '../../paths';
import { createDropdownProp } from '../common';
import {CreateEvent} from "@daml/ledger";
import _ from "lodash";

enum AssetType {
  CURRENCY = 'TCXXXX',
  EQUITY = 'EXXXXX',
  OTHER = 'XXXXXX',
}

type Props = {
  custodyServices: Readonly<CreateEvent<CustodyService, any, any>[]>;
  issuanceServices: Readonly<CreateEvent<IssuanceService, any, any>[]>;
}

const NewBaseInstrumentComponent: React.FC<RouteComponentProps & Props> =
  ({ custodyServices, issuanceServices, history }) => {
    const el = useRef<HTMLDivElement>(null);

    const [observers, setObservers] = useState<string[]>([]);
    const [isPublic, setIsPublic] = useState(true);
    const [label, setLabel] = useState('');
    const [description, setDescription] = useState('');
    const [registrar, setRegistrar] = useState('');
    const [cfi, setCfi] = useState('');

    const canRequest = !!label && !!description && !!registrar;

    const ledger = useLedger();
    const party = useParty();
    const customerServices = issuanceServices.filter(s => s.payload.customer === party);
    const registrars = custodyServices
      .filter(s => !_.isEmpty(issuanceServices.find(i => i.payload.provider === s.payload.provider)))
      .map(s => s.payload.provider);

    const zero: Claim<DamlDate, Decimal, Id> = { tag: 'Zero', value: {} };

    useEffect(() => {
      if (isPublic) {
        setObservers(observers => [...observers, publicParty]);
      } else {
        setObservers(observers => observers.filter(o => o !== publicParty));
      }
    }, [isPublic]);

    useEffect(() => {
      if (!el.current) return;
      el.current.innerHTML = '';
      const data = transformClaim(zero, 'root');
      render(el.current, data);
    }, [el, zero]);

    if (_.isEmpty(customerServices)) return <></>;

    const requestOrigination = async () => {
      const service = customerServices.find(i => i.payload.provider === registrar);
      if (!service) {
        console.log(
          `Couldn't find issuance service for selected registrar ${registrar}`
        );
        return;
      }
      await ledger.exercise(IssuanceService.RequestOrigination, service.contractId, {
        assetLabel: label,
        description,
        cfi: { code: cfi },
        claims: zero,
        observers: [service.payload.provider, party, ...observers],
      });
      history.push(paths.app.instruments.root);
    };

    const FormLabel = (props: { label: string; subLabel?: string }) => (
      <div className="form-label">
        <Header as="h3">{props.label}</Header>
        <p>
          <i>{props.subLabel}</i>
        </p>
      </div>
    );

    return (
      <div className="input-dialog">
        <BackButton />
        <Header as="h2">New Base Instrument</Header>
        <FormErrorHandled onSubmit={requestOrigination}>
          <Form.Input
            fluid
            label={'Asset ID'}
            value={label}
            placeholder="Give this asset a name"
            className="issue-asset-form-field"
            onChange={e => setLabel(e.currentTarget.value)}
          />

          <Form.TextArea
            label={'Description'}
            className="issue-asset-form-field"
            value={description}
            placeholder="Describe the asset to potential investors"
            onChange={e => setDescription(e.currentTarget.value)}
          />

          <Form.Select
            label="Registrar"
            className="issue-asset-form-field select-account"
            placeholder="Select Registrar ..."
            options={registrars.map(r => ({ text: r, value: r }))}
            onChange={(_, result: any) => setRegistrar(result.value)}
          />

          <Form.Select
            label="Asset Type"
            className="issue-asset-form-field"
            placeholder="Select Asset Type..."
            options={[
              createDropdownProp('Currency', AssetType.CURRENCY),
              createDropdownProp('Equity', AssetType.EQUITY),
              createDropdownProp('Other', AssetType.OTHER),
            ]}
            value={cfi}
            onChange={(event: React.SyntheticEvent, result: any) => {
              setCfi(result.value);
            }}
          />
          <FormLabel label="Observers" />
          <div className="form-select">
            <Button
              type="button"
              className={classNames('ghost checked', { darken: !isPublic })}
              onClick={() => setIsPublic(true)}
            >
              {isPublic && <IconCircledCheck />}
              <PublicIcon />
              <p>Public</p>
            </Button>
            <Button
              type="button"
              className={classNames('ghost checked', { darken: isPublic })}
              onClick={() => setIsPublic(false)}
            >
              {!isPublic && <IconCircledCheck />}
              <LockIcon />
              <p>Private</p>
            </Button>
          </div>
          {!isPublic && (
            <Form.Select
              multiple
              className="issue-asset-form-field select-observer"
              disabled={isPublic}
              placeholder="Who should be aware that this has been issued?"
              options={[]}
              onChange={(event: React.SyntheticEvent, result: any) => {
                setObservers(result.value);
              }}
            />
          )}
          <div className="submit-form">
            <Button type="submit" className="ghost" disabled={!canRequest} content="Submit" />
            <Button className="a a2" onClick={() => history.goBack()}>
              <IconClose /> Cancel
            </Button>
          </div>
        </FormErrorHandled>
      </div>
    );
  };

export const NewBaseInstrument = withRouter(NewBaseInstrumentComponent);
