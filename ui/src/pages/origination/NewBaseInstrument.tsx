import React, { useEffect, useRef, useState } from 'react';
import { useLedger, useParty } from '@daml/react';
import { useStreamQueries } from '../../Main';
import { render } from '../../components/Claims/render';
import { transformClaim } from '../../components/Claims/util';
import { Id } from '@daml.js/da-marketplace/lib/DA/Finance/Types';
import { Claim } from '@daml.js/da-marketplace/lib/ContingentClaims/Claim/Serializable';
import { Date as DamlDate } from '@daml/types';
import { Service } from '@daml.js/da-marketplace/lib/Marketplace/Issuance/Service';
import { AssetSettlementRule } from '@daml.js/da-marketplace/lib/DA/Finance/Asset/Settlement';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import FormErrorHandled from '../../components/Form/FormErrorHandled';
import { Button, Form, Header } from 'semantic-ui-react';
import classNames from 'classnames';
import { IconCircledCheck, LockIcon, PublicIcon, IconClose } from '../../icons/icons';
import { publicParty } from '../../config';
import BackButton from '../../components/Common/BackButton';
import paths from '../../paths';

const NewBaseInstrumentComponent = ({ history }: RouteComponentProps) => {
  const el = useRef<HTMLDivElement>(null);

  const [observers, setObservers] = useState<string[]>([]);
  const [isPublic, setIsPublic] = useState(true);
  const [label, setLabel] = useState('');
  const [description, setDescription] = useState('');
  const [account, setAccount] = useState('');

  const canRequest = !!label && !!description && !!account;

  const ledger = useLedger();
  const party = useParty();
  const services = useStreamQueries(Service).contracts;
  const customerServices = services.filter(s => s.payload.customer === party);
  const assetSettlementRules = useStreamQueries(AssetSettlementRule).contracts;
  const accounts = assetSettlementRules.map(c => c.payload.account);

  const zero: Claim<DamlDate, Id> = { tag: 'Zero', value: {} };

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
      claims: zero,
      safekeepingAccount,
      observers: [service.payload.provider, party, ...observers],
    });
    history.push(paths.app.manage.instruments);
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
          label="Account"
          className="issue-asset-form-field select-account"
          placeholder="Select Safekeeping Account..."
          options={accounts.map(c => ({ text: c.id.label, value: c.id.label }))}
          onChange={(event: React.SyntheticEvent, result: any) => {
            setAccount(result.value);
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
