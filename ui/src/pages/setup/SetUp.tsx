import React from 'react';

import { useParty } from '@daml/react';

import { SetupAutomation } from './SetupAutomation';
import RoleRequestMenu from '../landing/RoleRequestMenu';

import { isHubDeployment, publicParty } from '../../config';

import { AutomationProvider } from '../../context/AutomationContext';
import { useRolesContext } from '../../context/RolesContext';
import { useRoleRequestKinds } from '../../context/RequestsContext';
import {ServicePageProps} from "../common";
import {Service as CustodyService} from "@daml.js/da-marketplace/lib/Marketplace/Custody/Service";

const RoleSetUp: React.FC<ServicePageProps<CustodyService>> = ({services}) => {
  const party = useParty();

  const roles = useRolesContext()
    .roles.filter(r => r.contract.payload.provider === party)
    .map(r => r.roleKind);

  const roleRequests = useRoleRequestKinds();

  return (
    <div className="set-up">
      <div className="setup-service">
        <div className="roles">
          {Array.from(roleRequests).map(rq => (
            <p className="p2 label" key={rq}>
              {rq} (Pending)
            </p>
          ))}
          {roles.map(s => (
            <p className="p2 label" key={s}>
              {s}
            </p>
          ))}
          <RoleRequestMenu services={services} />
        </div>
      </div>
    </div>
  );
};

export const AutomationSetup = () => {
  return isHubDeployment ? (
    <div className="link-tile">
      <AutomationProvider publicParty={publicParty}>
        <SetupAutomation />
      </AutomationProvider>
    </div>
  ) : null;
};
export default RoleSetUp;
