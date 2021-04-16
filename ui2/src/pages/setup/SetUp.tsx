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
import { useUserState } from '../../context/UserContext';
import { handleSelectMultiple } from '../common';
import StripedTable from '../../components/Table/StripedTable';
import Tile from '../../components/Tile/Tile';

type SetupServiceProps = {
  name: string;
  links: {
    label: string;
    path: string;
  }[];
};

const SetupService: React.FC<SetupServiceProps> = ({ name, links }) => (
  <div className="setup-service">
    <Header as="h2">{name}</Header>
    <div className="links">
      {links.map(link => (
        <NavLink key={link.path + link.label} to={link.path}>
          {link.label}
        </NavLink>
      ))}
    </div>
  </div>
);

const SetupAutomation: React.FC = () => {
  const [open, setOpen] = React.useState(false);
  const user = useUserState();

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
    await undeployTrigger(user.token, instance.id, instance.owner);
    // setUndeploying(prev => new Map(prev).set(instance.config.value.name, false));
  };

  useEffect(() => {
    const timer = setInterval(() => {
      getAutomationInstances(user.token).then(pd => {
        setDeployedAutomations(pd || []);
      });
      // console.log(undeploying);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const currentTriggerOptions = triggerOptions.filter(
    to => !deployedAutomations.map(da => da.config.value.name).includes(String(to.value))
  );

  return (
    <div className="setup-service">
      <Header as="h2">Setup Automation</Header>
      <div className="links">
        <Modal
          onClose={() => setOpen(false)}
          onOpen={() => setOpen(true)}
          open={open}
          trigger={<NavLink to="#">Setup Automation</NavLink>}
        >
          <Modal.Header>Setup Automation</Modal.Header>
          <Modal.Content>
            <Tile header={<h2>Running Automations</h2>}>
              <br />
              {!!deployedAutomations.length ? (
                <p>No running automations</p>
              ) : (
                <StripedTable
                  headings={['Trigger', 'Action']}
                  rows={[1,2,3,4].map(da => {
                    return [
                      da,
                      <Button.Group size="mini">
                        <Button
                          negative
                          className="ghost"
                          onClick={() => {
                          }}
                        >
                          Undeploy
                        </Button>
                      </Button.Group>,
                    ];
                  })}
                  // rows={deployedAutomations.map(da => {
                  //   return [
                  //     da.config.value.name.split(':')[0],
                  //     <Button.Group size="mini">
                  //       <Button
                  //         negative
                  //         loading={undeploying.get(da.config.value.name)}
                  //         className="ghost"
                  //         onClick={() => {
                  //           setUndeploying(prev => new Map(prev).set(da.config.value.name, true));
                  //           handleUndeploy(da);
                  //         }}
                  //       >
                  //         Undeploy
                  //       </Button>
                  //     </Button.Group>,
                  //   ];
                  // })}
                />
              )}{' '}
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
                    onClick={() => handleDeployment(user.token)}
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
      </div>
    </div>
  );
};

const SetUp: React.FC = () => (
  <div className="set-up">
    <SetupService
      name="Custody"
      links={[
        {
          label: 'Offer Custody Service',
          path: '/app/setup/custody/offer',
        },
      ]}
    />

    <SetupService
      name="Distributions"
      links={[
        {
          label: 'Create New Auction',
          path: '/app/setup/distribution/new/auction',
        },
      ]}
    />

    <SetupService
      name="Instruments"
      links={[
        {
          label: 'Create Base Instrument',
          path: '/app/setup/instrument/new/base',
        },
        {
          label: 'Create Binary Option',
          path: '/app/setup/instrument/new/binaryoption',
        },
        {
          label: 'Create Convertible Note',
          path: '/app/setup/instrument/new/convertiblenote',
        },
      ]}
    />

    <SetupService
      name="Issuance"
      links={[
        {
          label: 'Create New Issuance',
          path: '/app/setup/issuance/new',
        },
      ]}
    />

    <SetupService
      name="Listings"
      links={[
        {
          label: 'Create New Listing',
          path: '/app/setup/listing/new',
        },
      ]}
    />

    <SetupService
      name="Trading"
      links={[
        {
          label: 'Offer Trading Service',
          path: '/app/setup/trading/offer',
        },
      ]}
    />

    <SetupAutomation />
  </div>
);

export default SetUp;
