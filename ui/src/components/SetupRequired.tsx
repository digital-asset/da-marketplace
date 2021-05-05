import React, {useEffect, useState} from 'react'
import Ledger from '@daml/ledger';
import {Button, Form, Loader} from 'semantic-ui-react';

import {useWellKnownParties} from '@daml/hub-react/lib';
import {Operator} from '@daml.js/da-marketplace/lib/Marketplace/Operator';
import {deploymentMode, DeploymentMode, httpBaseUrl} from "../config";
import deployTrigger, {getPublicAutomation, MarketplaceTrigger, PublicAutomation, TRIGGER_HASH} from '../automation';
import {logoHeader, Tile} from './common/OnboardingTile'
import {useDablParties} from './common/common';
import {parseError} from './common/errorTypes';

const SetupRequired  = () => {
  const [ deploying, setDeploying ] = useState(false);
  const [ setupError, setSetupError ] = useState<string | undefined>(undefined);
  const [ adminJwt, setAdminJwt ] = useState('');
  const { parties } = useWellKnownParties();
  const [ automations, setAutomations ] = useState<PublicAutomation[] | undefined>([]);
  const publicParty = useDablParties().parties.publicParty;

  useEffect(() => {
    getPublicAutomation(publicParty).then(autos => { setAutomations(autos) });
    const timer = setInterval(() => {
      getPublicAutomation(publicParty).then(autos => {
        setAutomations(autos);
        if (!!automations && automations.length > 0) {
          clearInterval(timer);
        }
      });
    }, 2000);
    return () => clearInterval(timer);
  }, [publicParty]);

  const handleSetup = async (event: React.FormEvent) => {
    setDeploying(true);
    if (!parties) { return }
    try {
      const ledger = new Ledger({token: adminJwt, httpBaseUrl})
      if (deploymentMode == DeploymentMode.PROD_DABL && TRIGGER_HASH) {
        deployTrigger(TRIGGER_HASH, MarketplaceTrigger.OperatorTrigger, adminJwt, publicParty);
      }
      const args = {
        operator: parties.userAdminParty,
        public: parties.publicParty
      }
      await ledger.create(Operator, args).catch(e => {
        setSetupError(`${parseError(e)?.message}`);
      });
    } catch(e) {
      setSetupError(`${parseError(e)?.message}`);
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
      <h4>Something went wrong with the setup. Please setup manually or refresh and try again.</h4>
      <p>{setupError}</p>
    </div>
  )

  const userAdminRequired = (
      <p className='login-details dark'>Please create the 'UserAdmin' party and refresh this page. You can create the party
                                        on the "Users" tab of the console.</p>
  );

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
        It looks like you have not completed the necessary deployment steps to configure this app.</p>
      <h4>Automatic setup</h4>
      { automations?.length === 0 || !automations ? (
        <div>
          <p>
            Please create a "UserAdmin" party and make the "da-marketplace-triggers" artifact deployable to continue and to perform automatic setup.<br/><br/>
            You can create the party on the "Users" tab and find the deployable option by clicking on the trigger in the "Deployments"
            tab in the console, then clicking on "Settings".
           </p>
        </div>
      ) : !!parties ? setupForm : userAdminRequired }
      <h4>See <a className='dark' href='https://github.com/digital-asset/da-marketplace#add-the-operator-role-contract'>here</a> for more information.</h4>
    </>
  );

  return (
    <Tile key='test' header={logoHeader}>
      <div className='setup-required'>
        <h3>Welcome to the Daml Open Marketplace!</h3>
        { !!setupError ? setupErrorScreen : deploying ? setupWaiting : showMessage }
      </div>
    </Tile>
  );
}

export default SetupRequired;
