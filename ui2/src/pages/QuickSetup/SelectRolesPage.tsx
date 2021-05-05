import React, { useState, useEffect } from 'react';

import { Button } from 'semantic-ui-react';

import { PartyDetails } from '@daml/hub-react';

import { ServiceKind } from './QuickSetup';

import { ArrowLeftIcon } from '../../icons/icons';

import OverflowMenu, { OverflowMenuEntry } from '../page/OverflowMenu';

import { IQuickSetupData } from './QuickSetup';
import { CreateEvent } from '@daml/ledger';

import { PageControls, usePagination } from './PaginationUtils';

import DamlLedger, { useLedger, useStreamQueries } from '@daml/react';

import { Role as OperatorService } from '@daml.js/da-marketplace/lib/Marketplace/Operator/Role';
import { Role as ClearingRole } from '@daml.js/da-marketplace/lib/Marketplace/Clearing/Role';
import { Role as CustodianRole } from '@daml.js/da-marketplace/lib/Marketplace/Custody/Role';
import { Role as DistributorRole } from '@daml.js/da-marketplace/lib/Marketplace/Distribution/Role';
import { Service as SettlementService } from '@daml.js/da-marketplace/lib/Marketplace/Settlement/Service';
import { Role as ExchangeRole } from '@daml.js/da-marketplace/lib/Marketplace/Trading/Role';
import { Service as MatchingService } from '@daml.js/da-marketplace/lib/Marketplace/Trading/Matching/Service';

import { Role as RegulatorRole } from '@daml.js/da-marketplace/lib/Marketplace/Regulator/Role';

import { Service as RegulatorService } from '@daml.js/da-marketplace/lib/Marketplace/Regulator/Service';
type Role = {
  contract: RoleContract;
  role: ServiceKind;
};

type RoleContract =
  | CreateEvent<ClearingRole>
  | CreateEvent<CustodianRole>
  | CreateEvent<ExchangeRole>
  | CreateEvent<DistributorRole>
  | CreateEvent<RegulatorRole>;

const SelectRolesPage = (props: { parties: PartyDetails[]; toNextPage: () => void }) => {
  const { parties, toNextPage } = props;

  const roleOptions = getRoleOptions();
  const ledger = useLedger();

  const page = usePagination(parties);
  const [roles, setRoles] = useState<Role[]>([]);

  const [loading, setLoading] = useState<boolean>(false);

  const { contracts: clearingRoles, loading: clearingRolesLoading } = useStreamQueries(
    ClearingRole
  );
  const { contracts: custodianRoles, loading: custodianRolesLoading } = useStreamQueries(
    CustodianRole
  );
  const { contracts: exchangeRoles, loading: exchangeRolesLoading } = useStreamQueries(
    ExchangeRole
  );
  const { contracts: distributorRoles, loading: distributorRolesLoading } = useStreamQueries(
    DistributorRole
  );
  const { contracts: regulatorRoles, loading: regulatorRolesLoading } = useStreamQueries(
    RegulatorRole
  );
  const { contracts: regulatorServices, loading: regulatorServicesLoading } = useStreamQueries(
    RegulatorService
  );
  const { contracts: settlementServices, loading: settlementServicesLoading } = useStreamQueries(
    SettlementService
  );
  const { contracts: matchingServices, loading: matchingServicesLoading } = useStreamQueries(
    MatchingService
  );
  const { contracts: operatorService, loading: operatorServiceLoading } = useStreamQueries(
    OperatorService
  );

  useEffect(() => {
    setLoading(
      custodianRolesLoading ||
        clearingRolesLoading ||
        regulatorRolesLoading ||
        regulatorServicesLoading ||
        distributorRolesLoading ||
        settlementServicesLoading ||
        exchangeRolesLoading ||
        matchingServicesLoading ||
        operatorServiceLoading
    );
  }, [
    custodianRolesLoading,
    clearingRolesLoading,
    regulatorRolesLoading,
    regulatorServicesLoading,
    distributorRolesLoading,
    settlementServicesLoading,
    exchangeRolesLoading,
    matchingServicesLoading,
    operatorServiceLoading,
  ]);

  useEffect(
    () =>
      setRoles([
        ...clearingRoles.map(c => ({ contract: c, role: ServiceKind.CLEARING })),
        ...custodianRoles.map(c => ({ contract: c, role: ServiceKind.CUSTODY })),
        ...exchangeRoles.map(c => ({ contract: c, role: ServiceKind.TRADING })),
        ...distributorRoles.map(c => ({ contract: c, role: ServiceKind.DISTRIBUTION })),
        ...regulatorRoles.map(c => ({ contract: c, role: ServiceKind.REGULATOR })),
      ]),
    [clearingRoles, custodianRoles, exchangeRoles, distributorRoles, regulatorRoles]
  );

  return (
    <div className="setup-page select-roles">
      <h4>Drag and Drop Roles to Parties</h4>
      <div className="page-body">
        <div>
          <p className="bold">Parties</p>
          <div className="party-names">
            {parties.slice(page.startingIndex, page.endingIndex).map((p, i) => (
              <PartyRowDropZone
                key={i}
                party={p}
                handleAddRole={createRoleContract}
                roles={roles
                  .filter(role => role.contract.payload.provider === p.party)
                  .map(role => role.role)}
              />
            ))}
          </div>
          <PageControls
            numberOfPages={page.numberOfPages}
            page={page.page}
            setPage={page.setPage}
          />
        </div>
        <div className="arrow">
          <ArrowLeftIcon color="black" />
        </div>
        <div>
          <p className="bold">Roles</p>
          <div className="role-tiles">
            {roleOptions.map((role, i) => (
              <DraggableItemTile key={i} item={role} />
            ))}
          </div>
        </div>
      </div>
      <Button className="ghost next" onClick={() => toNextPage()}>
        Next
      </Button>
    </div>
  );

  async function createRoleContract(party: PartyDetails, roles: ServiceKind) {
    const operatorServiceContract = operatorService[0];

    // if (!!party) {
    //   const token = party.token;
    //   await handleDeployment(token).then(_ => {
    //     if (roles?.length === 0) onComplete();
    //     setToDeploy([]);
    //   });
    // }

    const provider = party?.party;

    if (!provider || !operatorServiceContract || !roles) return undefined;

    const id = operatorServiceContract.contractId;

    // if (!findExistingOffer(provider, ServiceKind.REGULATOR)) {
    //   if (!regulatorServices.contracts.find(c => c.payload.customer === provider)) {
    //     const regId = regulatorRoles.contracts[0].contractId;
    //     await ledger.exercise(RegulatorRole.OfferRegulatorService, regId, {
    //       customer: provider,
    //     }); // trigger auto-approves
    //   }
    // }

    // Promise.all(
    //   roles.map(async role => {
    //     if (findExistingOffer(provider, role)) {
    //       return;
    //     }
    //     switch (role) {
    //       case ServiceKind.CUSTODY:
    //         return await ledger.exercise(OperatorService.OfferCustodianRole, id, { provider });
    //       case ServiceKind.CLEARING:
    //         return await ledger.exercise(OperatorService.OfferClearingRole, id, { provider });
    //       case ServiceKind.TRADING:
    //         return await ledger.exercise(OperatorService.OfferExchangeRole, id, { provider });
    //       case ServiceKind.MATCHING:
    //         return await ledger.exercise(OperatorService.OfferMatchingService, id, { provider });
    //       case ServiceKind.SETTLEMENT:
    //         return await ledger.exercise(OperatorService.OfferSettlementService, id, { provider });
    //       case ServiceKind.DISTRIBUTION:
    //         return await ledger.exercise(OperatorService.OfferDistributorRole, id, { provider });
    //       default:
    //         throw new Error(`Unsupported service: ${role}`);
    //     }
    //   })
    // );
    // onComplete();
  }

//   function findExistingOffer(provider: string, service: ServiceKind) {
//     switch (service) {
//       case ServiceKind.CLEARING:
//         return !!clearingOffers.contracts.find(c => c.payload.provider === provider);
//       case ServiceKind.CUSTODY:
//         return !!custodianOffers.contracts.find(c => c.payload.provider === provider);
//       case ServiceKind.TRADING:
//         return !!exhangeOffers.contracts.find(c => c.payload.provider === provider);
//       case ServiceKind.MATCHING:
//         return !!matchingOffers.contracts.find(c => c.payload.provider === provider);
//       case ServiceKind.DISTRIBUTION:
//         return !!distributorOffers.contracts.find(c => c.payload.provider === provider);
//       case ServiceKind.SETTLEMENT:
//         return !!settlementOffers.contracts.find(c => c.payload.provider === provider);
//       case ServiceKind.REGULATOR:
//         return !!regulatorServiceOffers.contracts.find(c => c.payload.provider === provider);
//       default:
//         throw new Error(`Unsupported service: ${service}`);
//     }
//   }
};

export const DraggableItemTile = (props: { item: string }) => {
  const { item } = props;

  function handleDragStart(evt: any, item: string) {
    evt.dataTransfer.setData('text', item);
  }

  return (
    <div className="role-tile" draggable={true} onDragStart={e => handleDragStart(e, item)}>
      <p>{item}</p>
    </div>
  );
};

const PartyRowDropZone = (props: {
  party: PartyDetails;
  handleAddRole: (party: PartyDetails, role: ServiceKind) => void;
  roles: ServiceKind[];
}) => {
  const { party, handleAddRole, roles } = props;

  const roleOptions = getRoleOptions(roles);

  return (
    <div
      className="party-name"
      onDrop={evt => handleAddRole(party, evt.dataTransfer.getData('text') as ServiceKind)}
      onDragOver={evt => evt.preventDefault()}
    >
      <div>
        <p>{party.partyName}</p>
        <p className="role-name">{roles.join(', ')}</p>
      </div>
      <OverflowMenu>
        {roleOptions.map(role => (
          <OverflowMenuEntry
            key={role}
            label={`Add ${role}`}
            onClick={() => handleAddRole(party, role)}
          />
        ))}
      </OverflowMenu>
    </div>
  );
};

function getRoleOptions(excludeOptions?: ServiceKind[]) {
  return Object.values(ServiceKind).filter(
    s => s !== ServiceKind.REGULATOR && !(excludeOptions || []).includes(s)
  );
}

export default SelectRolesPage;
