import React, { useState, useEffect } from 'react';
import { Form, Button } from 'semantic-ui-react';

import { DablPartiesInput, PartyDetails } from '@daml/hub-react';

import { ledgerId, isHubDeployment, publicParty } from '../../config';

import { useLedger, useStreamQueries } from '@daml/react';

import { computeCredentials } from '../../Credentials';

import { storeParties, retrieveParties } from '../../Parties';

import { Service as RegulatorService } from '@daml.js/da-marketplace/lib/Marketplace/Regulator/Service';

const AddPartiesPage = (props: {
  parties: PartyDetails[];
  operator: string;
  toNextPage: (parties: PartyDetails[]) => void;
}) => {
  const { parties, operator, toNextPage } = props;

  const ledger = useLedger();

  const [localParties, setLocalParties] = useState<PartyDetails[]>([]);
  const [inputValue, setInputValue] = useState<string>();
  const [error, setError] = useState<string>();
  const { contracts: regulatorServices, loading: regulatorServicesLoading } = useStreamQueries(
    RegulatorService
  );

  useEffect(() => {
    const storedParties = retrieveParties() || [];
    setLocalParties(storedParties);
  }, []);

  useEffect(() => {
    storeParties(localParties);
  }, [localParties]);

  return (
    <div className="setup-page add-parties">
      {isHubDeployment ? (
        parties.length === 0 ? (
          <>
            <p className="details">
              Download the .json file from the Users tab on Daml Hub, and upload it here.
            </p>
            <label className="custom-file-upload button ui">
              <DablPartiesInput
                ledgerId={ledgerId}
                onError={error => setError(error)}
                onLoad={storeParties}
              />
              <p>Upload .JSON file</p>
            </label>
            <span className="login-details dark">{error}</span>
          </>
        ) : (
          <div className="party-names">
            {parties.map(p => (
              <p className="party-name" key={p.party}>
                {p.partyName}
              </p>
            ))}
          </div>
        )
      ) : (
        <>
          <p className="details">Type a party name and press 'Enter'</p>
          <Form.Input
            placeholder="Username"
            value={inputValue}
            onChange={e => setInputValue(e.currentTarget.value)}
            onKeyDown={handleChangeParty}
          />
          {localParties.length > 0 && (
            <>
              <div className="party-names">
                {localParties.map(p => (
                  <p className="party-name">{p.partyName}</p>
                ))}
              </div>
            </>
          )}
        </>
      )}
      <Button className="ghost next" onClick={() => handleOnComplete()}>
        Next
      </Button>
    </div>
  );

  async function handleOnComplete() {
    if (isHubDeployment) {
      return toNextPage(parties);
    } else {
      return toNextPage(localParties);
    }
  }

  function handleChangeParty(event: any) {
    if (!inputValue) return;

    switch (event.key) {
      case 'Enter':
        const { ledgerId, party, token } = computeCredentials(inputValue);
        let newParty = {
          ledgerId,
          party,
          token,
          owner: operator,
          partyName: inputValue,
        };
        setLocalParties([...localParties, newParty]);
        setInputValue('');
        event.preventDefault();
        event.stopPropagation();
    }
  }
};

export default AddPartiesPage;
