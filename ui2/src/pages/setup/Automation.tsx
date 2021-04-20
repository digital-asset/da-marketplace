import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Header, Button, DropdownItemProps, Divider } from 'semantic-ui-react';
import { Form, Message, Modal } from 'semantic-ui-react';
import { deploymentMode, DeploymentMode } from '../../config';
import deployTrigger, {
  PublicAutomation,
  getPublicAutomation,
  PublishedInstance,
  getAutomationInstances,
  TRIGGER_HASH,
  MarketplaceTrigger,
  undeployTrigger,
} from '../../automation';
import { useWellKnownParties } from '@daml/hub-react/lib';
import { handleSelectMultiple } from '../common';
import StripedTable from '../../components/Table/StripedTable';
import Tile from '../../components/Tile/Tile';
import {useUserState} from '../../context/UserContext';

type SetupAutomationProps = {
  title?: string,
  token?: string,
  modalTrigger: React.ReactNode
}

export const SetupAutomation: React.FC<SetupAutomationProps> = ({title, token, modalTrigger}) => {
  const [open, setOpen] = React.useState(false);
  const user = useUserState();
  const userToken = token || user.token;

  const publicParty = useWellKnownParties().parties?.publicParty;

  const [deployedAutomations, setDeployedAutomations] = useState<PublishedInstance[]>([]);
  const [toDeploy, setToDeploy] = useState<string[]>([]);
  const [undeploying, setUndeploying] = useState<Map<string, boolean>>(new Map());
  const [deploying, setDeploying] = useState<boolean>(false);

  const triggerOptions: DropdownItemProps[] = Object.values(MarketplaceTrigger).map(tn => {
    return {
      key: tn,
      value: tn,
      text: tn.split(':')[0],
    };
  });

  const handleDeployment = async (token: string) => {
    setDeploying(true);
    for (const auto of toDeploy) {
      if (TRIGGER_HASH) {
        await deployTrigger(TRIGGER_HASH, auto, token, publicParty);
      }
    }
    setToDeploy([]);
    setDeploying(false);
  };

  const handleUndeploy = async (instance: PublishedInstance) => {
    setUndeploying(prev => new Map(prev).set(instance.config.value.name, true));
    await undeployTrigger(userToken, instance.id, instance.owner);
    setUndeploying(prev => new Map(prev).set(instance.config.value.name, false));
  };

  useEffect(() => {
    const timer = setInterval(() => {
      getAutomationInstances(userToken).then(pd => {
        setDeployedAutomations(pd || []);
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [undeploying, deploying]);

  const currentTriggerOptions = triggerOptions.filter(
    to => !deployedAutomations.map(da => da.config.value.name).includes(String(to.value))
  );

  return (
        <Modal
          onClose={() => setOpen(false)}
          onOpen={() => setOpen(true)}
          open={open}
          trigger={modalTrigger}
        >
          <Modal.Header>{title || "Setup Automation"}</Modal.Header>
          <Modal.Content>
            <Tile header={<h2>Running Automations</h2>}>
              <br />
              <StripedTable
                headings={['Trigger', 'Action']}
                rows={deployedAutomations.map(da => {
                  return {
                    elements: [
                      da.config.value.name.split(':')[0],
                      <Button.Group size="mini">
                        <Button
                          negative
                          loading={undeploying.get(da.config.value.name)}
                          className="ghost"
                          onClick={() => {
                            setUndeploying(prev => new Map(prev).set(da.config.value.name, true));
                            handleUndeploy(da);
                          }}
                        >
                          Undeploy
                        </Button>
                      </Button.Group>,
                    ],
                  };
                })}
              />{' '}
            </Tile>
            <Divider horizontal />
            <Tile header={<h2>Deploy New Triggers</h2>}>
              <br />
              <Form>
                <Form.Group inline widths="equal">
                  <Form.Select
                    fluid
                    placeholder="Select..."
                    multiple
                    value={toDeploy}
                    onChange={(_, result) => handleSelectMultiple(result, toDeploy, setToDeploy)}
                    options={currentTriggerOptions}
                  />
                  <Button
                    loading={deploying}
                    positive
                    type="submit"
                    className="ghost"
                    onClick={() => handleDeployment(userToken)}
                  >
                    Deploy
                  </Button>
                </Form.Group>
              </Form>
            </Tile>
          </Modal.Content>
          <Modal.Actions>
            <Button color="black" onClick={() => setOpen(false)}>
              Done
            </Button>
          </Modal.Actions>
        </Modal>
  );
};
