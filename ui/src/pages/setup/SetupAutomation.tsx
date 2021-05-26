import React, { useEffect, useState } from 'react';
import { Button, Divider, DropdownItemProps, Form, Modal } from 'semantic-ui-react';
import { publicParty } from '../../config';
import {
  deployAutomation,
  getAutomationInstances,
  PublicAutomation,
  PublishedInstance,
  undeployAutomation,
} from '../../automation';
import { handleSelectMultiple } from '../common';
import StripedTable from '../../components/Table/StripedTable';
import Tile from '../../components/Tile/Tile';
import { useUserState } from '../../context/UserContext';
import { useAutomations } from '../../context/AutomationContext';

export const makeAutomationOptions = (automations?: PublicAutomation[]): DropdownItemProps[] => {
  return (
    automations?.flatMap(auto => {
      if (auto.automationEntity.tag === 'DamlTrigger') {
        return auto.automationEntity.value.triggerNames.map(tn => {
          return {
            key: tn,
            value: `${tn}#${auto.artifactHash}`,
            text: tn.split(':')[0],
          };
        });
      } else {
        const name = auto.automationEntity.value.entityName;
        const hash = auto.artifactHash;
        return [{ key: name, value: `${name}#${hash}`, text: name }];
      }
    }) || []
  );
};

type SetupAutomationProps = {
  title?: string;
  token?: string;
  modalTrigger: React.ReactNode;
};

export const SetupAutomation: React.FC<SetupAutomationProps> = ({ title, token, modalTrigger }) => {
  const [open, setOpen] = React.useState(false);
  const user = useUserState();
  const userToken = token || user.token;

  const [deployedAutomations, setDeployedAutomations] = useState<PublishedInstance[]>([]);
  const [toDeploy, setToDeploy] = useState<string[]>([]);
  const [undeploying, setUndeploying] = useState<Map<string, boolean>>(new Map());
  const [deploying, setDeploying] = useState<boolean>(false);

  const automations = useAutomations();

  const triggerOptions: DropdownItemProps[] = makeAutomationOptions(automations);

  const handleDeployment = async (token: string) => {
    setDeploying(true);
    for (const auto of toDeploy) {
      const [name, hash] = auto.split('#');
      if (hash) {
        await deployAutomation(hash, name, token, publicParty);
      }
    }
    setToDeploy([]);
    setDeploying(false);
  };

  const handleUndeploy = async (instance: PublishedInstance) => {
    setUndeploying(prev => new Map(prev).set(instance.config.value.name, true));
    await undeployAutomation(userToken, instance.id, instance.owner);
    setUndeploying(prev => new Map(prev).set(instance.config.value.name, false));
  };

  useEffect(() => {
    const timer = setInterval(() => {
      getAutomationInstances(userToken).then(pd => {
        setDeployedAutomations(pd || []);
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [token, userToken]);

  const currentTriggerOptions = triggerOptions.filter(
    to =>
      !deployedAutomations
        .map(da => `${da.config.value.name}#${da.entityInfo.artifactHash}`)
        .includes(String(to.value))
  );

  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={modalTrigger}
    >
      <Modal.Header as="h2">{title || 'Setup Automation'}</Modal.Header>
      <Modal.Content>
        <StripedTable
          title="Running Automation"
          headings={['Automation', 'Action']}
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
        />
        <Divider horizontal />
        <Tile header="Deploy New Automation">
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
