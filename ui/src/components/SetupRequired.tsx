import React, {useState} from 'react'
import { httpBaseUrl, deploymentMode, DeploymentMode } from "../config";
import { Tile, logoHeader } from './common/OnboardingTile'
import { PublicAutomation, usePublicAutomation } from '../websocket/queryStream';
import {Form, Button, Loader} from 'semantic-ui-react';
import {useDablParties} from './common/common';
import Ledger from '@daml/ledger';
import { Operator } from '@daml.js/da-marketplace/lib/Marketplace/Operator';
import deployTrigger, {TRIGGER_HASH, MarketplaceTrigger} from '../automation';

type Props = {
  automation?: PublicAutomation[];
}

const SetupRequired: React.FC<Props> = ({automation}) => {
  const [ deploying, setDeploying ] = useState(false);
  const [ setupError, setSetupError ] = useState(false);
  const [ adminJwt, setAdminJwt ] = useState('');
  const { parties, loading } = useDablParties();
  const automations = usePublicAutomation();

  const handleSetup = async (event: React.FormEvent) => {
    setDeploying(true);
    const ledger = new Ledger({token: adminJwt, httpBaseUrl})
    try {
      if (deploymentMode == DeploymentMode.PROD_DABL && TRIGGER_HASH) {
        deployTrigger(TRIGGER_HASH, MarketplaceTrigger.OperatorTrigger, adminJwt, automations);
      }
      const args = {
        operator: parties.userAdminParty,
        public: parties.publicParty
      }
      await ledger.create(Operator, args);
    } catch(e) {
      console.log("error exercising setup: " + e);
      setSetupError(true);
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
    <h4>Something went wrong with the setup. Please setup manually.</h4>
  )

  const setupForm = (
    <>
      <p className='login-details dark'>If you would like to have the setup happen automatically,
                                        please enter the JWT token for the UserAdmin party.</p>
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
        <div><p>Please make the "da-marketplace-triggers" artifact deployable and then refresh this page to continue and to perform automatic setup.</p></div>
      ) : setupError ? setupErrorScreen : setupForm }
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
