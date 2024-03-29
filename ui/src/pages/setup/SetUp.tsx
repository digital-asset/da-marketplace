import React from 'react';

import { useParty } from '@daml/react';

import { Service as CustodyService } from '@daml.js/da-marketplace/lib/Marketplace/Custody/Service';

import { isHubDeployment } from '../../config';
import { useRoleRequestKinds } from '../../context/RequestsContext';
import { useRolesContext } from '../../context/RolesContext';
import { ServicePageProps } from '../common';
import RoleRequestMenu from '../landing/RoleRequestMenu';
import { SetupAutomation } from './SetupAutomation';

const RoleSetUp: React.FC<ServicePageProps<CustodyService>> = ({ services }) => {
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
      <SetupAutomation />
    </div>
  ) : null;
};
export default RoleSetUp;
