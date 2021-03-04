import React, { useState, useEffect } from 'react'
import Ledger from '@daml/ledger';
import { Form, Button, Loader } from 'semantic-ui-react';

import { Operator } from '@daml.js/da-marketplace/lib/Marketplace/Operator';
import { httpBaseUrl, deploymentMode, DeploymentMode } from "../config";
import deployTrigger, { TRIGGER_HASH, MarketplaceTrigger, PublicAutomation, getPublicAutomation } from '../automation';
import { Tile, logoHeader } from './common/OnboardingTile'
import { useDablParties } from './common/common';

const SetupRequired  = () => {
  const [ deploying, setDeploying ] = useState(false);
  const [ setupError, setSetupError ] = useState<string | undefined>(undefined);
  const [ adminJwt, setAdminJwt ] = useState('');
  const { parties } = useDablParties();
  const [ automations, setAutomations ] = useState<PublicAutomation[] | undefined>([]);
  const publicParty = useDablParties().parties.publicParty;

  useEffect(() => {
    const timer = setInterval(() => {
      getPublicAutomation(publicParty).then(autos => {
        setAutomations(autos);
        if (!!automations && automations.length > 0) {
          clearInterval(timer);
        }
      });
    }, 3000);
    return () => clearInterval(timer);
  }, [publicParty]);

  const handleSetup = async (event: React.FormEvent) => {
    setDeploying(true);
    const ledger = new Ledger({token: adminJwt, httpBaseUrl})
    try {
      if (deploymentMode == DeploymentMode.PROD_DABL && TRIGGER_HASH) {
        deployTrigger(TRIGGER_HASH, MarketplaceTrigger.OperatorTrigger, adminJwt, publicParty);
      }
      const args = {
        operator: parties.userAdminParty,
        public: parties.publicParty
      }
      await ledger.create(Operator, args);
    } catch(e) {
      setSetupError(e);
    }
  }

  const setupWaiting = (
    <div className='button-row'>
      <div className='invite-indicator'>
        <p className='p2 dark'>Waiting for triggers to deploy...</p>
        <Loader active indeterminate size='small'/>
      </div>
    </div>
  )

  const setupErrorScreen = (
    <div>
      <h4>Something went wrong with the setup. Please setup manually.</h4>
      <p>Error: {setupError}</p>
    </div>
  )

  const setupForm = (
    <>
      <p className='login-details dark'>If you would like to have the setup happen automatically,
                                        please enter the JWT token found in the "Users" tab of the
                                        Daml Hub for the UserAdmin party.</p>
      <Form size='large' className='login-form'>
          <Form.Input
            fluid
            required
            label={<p className='dark'>UserAdmin JWT</p>}
            placeholder='JWT'
            value={adminJwt}
            onChange={e => setAdminJwt(e.currentTarget.value)}/>
        <Button
          fluid
          className='ghost dark'
          icon='right arrow'
          labelPosition='right'
          disabled={!adminJwt}
          content={<p className='dark bold'>Go!</p>}
          onClick={handleSetup}/>
      </Form>
    </>
  );
  const showMessage = (
    <>
      <p>
        It looks like you have not completed the necessary deployment steps to configure this app.
        Please create an Operator role contract for the UserAdmin party, and deploy the operator trigger.</p>
      <h4>Automatic setup</h4>
      { automations?.length === 0 || !automations ? (
        <div><p>Please make the "da-marketplace-triggers" artifact deployable to continue and to perform automatic setup.</p></div>
      ) : !!setupError ? setupErrorScreen : setupForm }
      <h4>See <a className='dark' href='https://github.com/digital-asset/da-marketplace#add-the-operator-role-contract'>here</a> for more information.</h4>
    </>
  );

  return (
    <Tile key='test' header={logoHeader}>
      <div className='setup-required'>
        <h3>Welcome to the Daml Open Marketplace!</h3>
        { deploying ? setupWaiting : showMessage }
      </div>
    </Tile>
  );
}

export default SetupRequired;
