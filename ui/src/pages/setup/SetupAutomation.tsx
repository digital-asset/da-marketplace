import React, { useEffect, useState } from 'react';
import { Button, DropdownItemProps, Form, Modal, Header } from 'semantic-ui-react';

import { Automation, Instance, useAutomationInstances, useAutomations } from '@daml/hub-react';

import { handleSelectMultiple } from '../common';
import StripedTable from '../../components/Table/StripedTable';

export const makeAutomationOptions = (automations?: Automation[]): DropdownItemProps[] => {
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
  isModal?: boolean;
  modalTrigger?: React.ReactNode;
};

export const SetupAutomation: React.FC<SetupAutomationProps> = ({
  title,
  modalTrigger,
  isModal,
}) => {
  const [open, setOpen] = React.useState(false);

  const [deployedAutomations, setDeployedAutomations] = useState<Instance[]>([]);
  const [toDeploy, setToDeploy] = useState<string[]>([]);
  const [undeploying, setUndeploying] = useState<Map<string, boolean>>(new Map());
  const [deploying, setDeploying] = useState<boolean>(false);

  const { automations } = useAutomations();
  const { instances, deployAutomation, deleteInstance } = useAutomationInstances();

  const triggerOptions: DropdownItemProps[] =
    (automations && makeAutomationOptions(automations)) || [];

  const handleDeployment = async () => {
    setDeploying(true);
    for (const auto of toDeploy) {
      const [name, hash] = auto.split('#');
      if (hash && deployAutomation) {
        await deployAutomation(hash, name);
      }
    }
    setToDeploy([]);
    setDeploying(false);
  };

  const handleUndeploy = async (instance: Instance) => {
    const instanceName = instance.config.value.name;
    if (deleteInstance && instanceName) {
      setUndeploying(prev => new Map(prev).set(instanceName, true));
      await deleteInstance(instance.id, instance.owner);
      setUndeploying(prev => new Map(prev).set(instanceName, false));
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setDeployedAutomations(instances || []);
    }, 1000);
    return () => clearInterval(timer);
  }, [instances]);

  const currentTriggerOptions = triggerOptions.filter(
    to =>
      !deployedAutomations
        .map(da => `${da.config.value.name}#${da.entityInfo.artifactHash}`)
        .includes(String(to.value))
  );

  const body = (
    <div className="automation-setup">
      <Header as="h2">Automation</Header>
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
            onClick={() => handleDeployment()}
          >
            Deploy
          </Button>
        </Form.Group>
      </Form>
      <StripedTable
        title={'Running Automation'}
        headings={['Automation', 'Action']}
        rows={deployedAutomations.map(da => {
          const instanceName = da.config.value.name;
          const elements = instanceName
            ? [
                instanceName.split(':')[0],
                <Button.Group size="mini">
                  <Button
                    negative
                    loading={undeploying.get(instanceName)}
                    className="ghost"
                    onClick={() => {
                      setUndeploying(prev => new Map(prev).set(instanceName, true));
                      handleUndeploy(da);
                    }}
                  >
                    Undeploy
                  </Button>
                </Button.Group>,
              ]
            : [];

          return { elements };
        })}
      />
    </div>
  );

  if (isModal) {
    return (
      <Modal
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        open={open}
        trigger={modalTrigger}
      >
        <Modal.Header as="h2">{title || 'Setup Automation'}</Modal.Header>
        <Modal.Content>{body}</Modal.Content>
        <Modal.Actions>
          <Button color="black" onClick={() => setOpen(false)}>
            Done
          </Button>
        </Modal.Actions>
      </Modal>
    );
  } else {
    return body;
  }
};
