import React, { useState, useEffect } from 'react';
import { Form, Button } from 'semantic-ui-react';

import { DablPartiesInput, PartyDetails } from '@daml/hub-react';

import { ledgerId, isHubDeployment } from '../../config';

import { computeCredentials } from '../../Credentials';

import { storeParties, retrieveParties } from '../../Parties';

const AddPartiesPage = (props: { localOperator: string; onComplete: () => void }) => {
  const { localOperator, onComplete } = props;

  const [inputValue, setInputValue] = useState<string>();
  const [parties, setParties] = useState<PartyDetails[]>([]);
  const [error, setError] = useState<string>();
  const storedParties = retrieveParties() || [];

  useEffect(() => {
    setParties(storedParties);
  }, [storedParties.length]);

  const uploadButton = (
    <label className="custom-file-upload button ui">
      <DablPartiesInput
        ledgerId={ledgerId}
        onError={error => setError(error)}
        onLoad={(newParties: PartyDetails[]) => handleLoad(newParties)}
      />
      <p>Upload {parties.length > 0 ? 'a new ' : ''}.JSON file</p>
    </label>
  );

  function handleLoad(newParties: PartyDetails[]) {
    storeParties(newParties);
    setParties(newParties);
  }

  return (
    <div className="setup-page add-parties">
      {isHubDeployment ? (
        parties.length === 0 ? (
          <div className="upload-parties">
            <p className="details">
              Download the .json file from the Users tab on Daml Hub, and upload it here.
            </p>
            {uploadButton}
            <span className="login-details dark">{error}</span>
          </div>
        ) : (
          <div>
            <div className="page-row parties-title">
              <h4>Parties</h4>
              {uploadButton}
            </div>

            <div className="party-names uploaded">
              {parties.map(p => (
                <p className="party-name" key={p.party}>
                  {p.partyName}
                </p>
              ))}
            </div>
          </div>
        )
      ) : (
        <>
          <h4 className="details">Type a party name and press 'Enter'</h4>
          <Form.Input
            placeholder="Username"
            value={inputValue}
            onChange={e => setInputValue(e.currentTarget.value)}
            onKeyDown={handleAddParty}
          />
          {parties.length > 0 && (
            <div className="party-names">
              {parties.map(p => (
                <p className="party-name" key={p.party}>
                  {p.partyName}
                </p>
              ))}
            </div>
          )}
        </>
      )}
      <Button disabled={parties.length === 0} className="ghost next" onClick={() => onComplete()}>
        Next
      </Button>
    </div>
  );

  function handleAddParty(event: any) {
    if (!inputValue) return;

    switch (event.key) {
      case 'Enter':
        const { ledgerId, party, token } = computeCredentials(inputValue);
        let newLocalParty = {
          ledgerId,
          party,
          token,
          owner: localOperator,
          partyName: inputValue,
        };
        storeParties([...parties, newLocalParty]);
        setInputValue('');
        event.preventDefault();
        event.stopPropagation();
    }
  }
};

export default AddPartiesPage;
