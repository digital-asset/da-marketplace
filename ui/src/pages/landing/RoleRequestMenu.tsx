import React, { useEffect, useState, useMemo } from 'react';
import { Button } from 'semantic-ui-react';

import { useParty } from '@daml/react';
import { Template } from '@daml/types';

import { Account } from '@daml.js/da-marketplace/lib/DA/Finance/Types';
import { Request as ClearingRequest } from '@daml.js/da-marketplace/lib/Marketplace/Clearing/Role';
import { Request as CustodianRequest } from '@daml.js/da-marketplace/lib/Marketplace/Custody/Role';
import { Service as CustodyService } from '@daml.js/da-marketplace/lib/Marketplace/Custody/Service';
import { Request as DistributionRequest } from '@daml.js/da-marketplace/lib/Marketplace/Distribution/Role';
import { Role as OperatorRole } from '@daml.js/da-marketplace/lib/Marketplace/Operator/Role';
import { Request as SettlementRequest } from '@daml.js/da-marketplace/lib/Marketplace/Settlement/Service';
import { Request as ExchangeRequest } from '@daml.js/da-marketplace/lib/Marketplace/Trading/Role';

import { useStreamQueries } from '../../Main';
import { Fields } from '../../components/InputDialog/Fields';
import { RoleRequestDialog } from '../../components/InputDialog/RoleDialog';
import { usePartyName, useVerifiedParties } from '../../config';
import { useRoleRequestKinds } from '../../context/RequestsContext';
import {
  RoleKind,
  RoleRequest,
  RoleRequestTemplates,
  usePartyRoleKinds,
} from '../../context/RolesContext';
import { AddPlusIcon } from '../../icons/icons';
import { ServicePageProps } from '../common';

interface RequestInterface {
  operator: string;
  provider: string;
  ccpAccount?: Account;
}

const RoleRequestMenu: React.FC<ServicePageProps<CustodyService>> = ({ services }) => {
  const party = useParty();
  const { getName } = usePartyName(party);
  const operatorRoles = useStreamQueries(OperatorRole);

  const operators = useMemo(
    () =>
      operatorRoles.contracts.map(o => ({
        key: o.payload.operator,
        value: o.payload.operator,
        text: getName(o.payload.operator),
      })),
    [operatorRoles, getName]
  );

  const requests = useRoleRequestKinds();
  const roles = usePartyRoleKinds(party);

  const { identities } = useVerifiedParties();

  const [request, setRequest] = useState<RoleRequest>();
  const [roleKind, setRoleKind] = useState<RoleKind>();
  const [openDialog, setOpenDialog] = useState(false);
  const [fields, setFields] = useState<Fields<{ operator: string }>>({
    operator: {
      label: 'Operator',
      type: 'selection',
      items: [],
    },
  });
  const [dialogState, setDialogState] = useState<any>({});
  const [requestParams, setRequestParams] = useState<RequestInterface>({
    operator: '',
    provider: party,
  });

  const accounts = useMemo(
    () => services.filter(c => c.payload.account.owner === party).map(c => c.payload.account),
    [party, services]
  );

  useEffect(() => {
    const operator = dialogState?.operator;

    if (!!operator) {
      let params: RequestInterface = {
        operator,
        provider: party,
      };

      if (dialogState?.ccpAccount) {
        const ccpAccount = accounts.find(a => a.id.label === dialogState.ccpAccount);
        params = {
          ...params,
          ccpAccount,
        };
      }

      setRequestParams(params);
    }
  }, [dialogState, accounts, identities, party]);

  const requestRole = <T extends RoleRequestTemplates>(
    role: Template<T, undefined, string>,
    kind: RoleKind,
    extraFields?: Fields<{ ccpAccount?: string }>
  ) => {
    setFields({
      operator: {
        label: 'Operator',
        type: 'selection',
        items: operators,
      },
      ...extraFields,
    });

    setRequest(role as unknown as Template<RoleRequestTemplates, undefined, string>);
    setRoleKind(kind);
    setOpenDialog(true);
  };
  const [dialogDisabled, setDialogDisabled] = useState(false);

  useEffect(() => {
    setDialogDisabled(
      Object.values(dialogState).filter(v => v !== '').length !== Object.values(fields).length
    );
  }, [fields, dialogState]);

  if (roleKind && request) {
    return (
      <RoleRequestDialog
        open={openDialog}
        role={roleKind}
        fields={fields}
        params={requestParams}
        request={request}
        onChange={state => setDialogState(state)}
        disabled={dialogDisabled}
        onClose={() => {
          setRoleKind(undefined);
        }}
      />
    );
  }

  const canRequest = (kind: RoleKind) => !requests.has(kind) && !roles.has(kind);

  return (
    <>
      {canRequest(RoleKind.CUSTODY) && (
        <Button
          onClick={() => requestRole(CustodianRequest, RoleKind.CUSTODY)}
          className="ghost secondary-smaller"
        >
          <AddPlusIcon /> Add Custodian Role
        </Button>
      )}
      {canRequest(RoleKind.TRADING) && (
        <Button
          onClick={() => requestRole(ExchangeRequest, RoleKind.TRADING)}
          className="ghost secondary-smaller"
        >
          <AddPlusIcon /> Add Exchange Role
        </Button>
      )}

      {canRequest(RoleKind.DISTRIBUTION) && (
        <Button
          onClick={() => requestRole(DistributionRequest, RoleKind.DISTRIBUTION)}
          className="ghost secondary-smaller"
        >
          <AddPlusIcon /> Add Distribution Role
        </Button>
      )}

      {canRequest(RoleKind.SETTLEMENT) && (
        <Button
          onClick={() => requestRole(SettlementRequest, RoleKind.SETTLEMENT)}
          className="ghost secondary-smaller "
        >
          <AddPlusIcon /> Add Settlement Role
        </Button>
      )}

      {canRequest(RoleKind.CLEARING) && (
        <Button
          className="ghost secondary-smaller"
          onClick={() =>
            requestRole(ClearingRequest, RoleKind.CLEARING, {
              ccpAccount: {
                label: 'CCP Account',
                type: 'selection',
                items: accounts.map(a => a.id.label),
              },
            })
          }
        >
          <AddPlusIcon /> Add Clearing Role
        </Button>
      )}
    </>
  );
};

export default RoleRequestMenu;
