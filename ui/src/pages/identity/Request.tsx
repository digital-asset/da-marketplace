import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { Button, Form, Header, Loader } from 'semantic-ui-react';

import { useLedger, useParty } from '@daml/react';

import { VerifiedIdentity } from '@daml.js/da-marketplace/lib/Marketplace/Regulator/Model';
import { Service } from '@daml.js/da-marketplace/lib/Marketplace/Regulator/Service';

import { useStreamQueries } from '../../Main';
import FormErrorHandled from '../../components/Form/FormErrorHandled';
import { IconCircledCheck, LockIcon, PublicIcon } from '../../icons/icons';
import { usePublicParty } from '../common';

const Request = () => {
  const history = useHistory();
  const party = useParty();
  const publicParty = usePublicParty();
  const ledger = useLedger();

  const { contracts, loading } = useStreamQueries(Service);
  const service = contracts.find(c => c.payload.customer === party);

  const identities = useStreamQueries(VerifiedIdentity).contracts;

  const [isPublic, setIsPublic] = useState(true);
  const [legalName, setLegalName] = useState('');
  const [location, setLocation] = useState('');
  const [observers, setObservers] = useState<string[]>([]);

  useEffect(() => {
    if (isPublic && publicParty) {
      setObservers([publicParty]);
    } else {
      setObservers([]);
    }
  }, [isPublic, publicParty]);

  if (loading) {
    return (
      <div>
        <Loader active indeterminate size="small"></Loader>
      </div>
    );
  }

  if (!service) {
    // TO-DO: Add MissingService modal
    return <h2>Not a Regulator customer.</h2>;
  }

  const onSubmit = async () => {
    await ledger.exercise(Service.RequestIdentityVerification, service.contractId, {
      legalName,
      location,
      observers,
    });

    history.goBack();
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
    <FormErrorHandled onSubmit={onSubmit}>
      <Form.Input
        required
        label="Legal Name"
        value={legalName}
        onChange={e => setLegalName(e.currentTarget.value as string)}
      ></Form.Input>

      <Form.Input
        required
        label="Location"
        value={location}
        onChange={e => setLocation(e.currentTarget.value as string)}
      ></Form.Input>

      <FormLabel label="Observers" subLabel="Make your identity known to the whole network?" />
      <div className="button-toggle">
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
          required
          className="issue-asset-form-field select-observer"
          disabled={isPublic}
          placeholder="Select..."
          options={identities.map(id => ({
            text: id.payload.legalName,
            value: id.payload.customer,
          }))}
          onChange={(event: React.SyntheticEvent, result: any) => {
            setObservers(result.value);
          }}
        />
      )}

      <Button
        type="submit"
        className="ghost"
        disabled={!legalName || !location || observers.length <= 0}
        content="Submit"
      />
    </FormErrorHandled>
  );
};

export default Request;
