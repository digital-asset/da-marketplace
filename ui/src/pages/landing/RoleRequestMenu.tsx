import React, { useEffect, useState, useMemo } from 'react';
import OverflowMenu, { OverflowMenuEntry } from '../page/OverflowMenu';

import { Template } from '@daml/types';
import { Request as CustodianRequest } from '@daml.js/da-marketplace/lib/Marketplace/Custody/Role';
import { Request as ExchangeRequest } from '@daml.js/da-marketplace/lib/Marketplace/Trading/Role';
import { Request as ClearingRequest } from '@daml.js/da-marketplace/lib/Marketplace/Clearing/Role';
import { Request as DistributionRequest } from '@daml.js/da-marketplace/lib/Marketplace/Distribution/Role';
import { Request as SettlementRequest } from '@daml.js/da-marketplace/lib/Marketplace/Settlement/Service';
import { Role as OperatorRole } from '@daml.js/da-marketplace/lib/Marketplace/Operator/Role';

import { Fields } from '../../components/InputDialog/Fields';
import {
  RoleKind,
  RoleRequest,
  RoleRequestTemplates,
  usePartyRoleKinds,
} from '../../context/RolesContext';
import { Account } from '@daml.js/da-marketplace/lib/DA/Finance/Types';
import { usePartyName, useVerifiedParties } from '../../config';
import { useParty, useStreamQueries } from '@daml/react';
import { AssetSettlementRule } from '@daml.js/da-marketplace/lib/DA/Finance/Asset/Settlement';
import { RoleRequestDialog } from '../../components/InputDialog/RoleDialog';
import { useRoleRequestKinds } from '../../context/RequestsContext';

interface RequestInterface {
  operator: string;
  provider: string;
  ccpAccount?: Account;
}

const RoleRequestMenu: React.FC = () => {
  const party = useParty();
  const { getName } = usePartyName(party);
  const operatorRoles = useStreamQueries(OperatorRole);

  const operators = useMemo(
    () => operatorRoles.contracts.map(o => o.payload.operator),
    [operatorRoles]
  );
  const requests = useRoleRequestKinds();
  const roles = usePartyRoleKinds(party);

  const { identities } = useVerifiedParties();

  const [request, setRequest] = useState<RoleRequest>();
  const [roleKind, setRoleKind] = useState<RoleKind>();
  const [openDialog, setOpenDialog] = useState(false);
  const [fields, setFields] = useState<object>({});
  const [dialogState, setDialogState] = useState<any>({});
  const [requestParams, setRequestParams] = useState<RequestInterface>({
    operator: '',
    provider: party,
  });

  const assetSettlementRules = useStreamQueries(AssetSettlementRule).contracts;
  const accounts = useMemo(
    () =>
      assetSettlementRules
        .filter(c => c.payload.account.owner === party)
        .map(c => c.payload.account),
    [party, assetSettlementRules]
  );

  useEffect(() => {
    const operator =
      identities.find(i => i.payload.legalName === dialogState?.operator)?.payload.customer || '';

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
  }, [dialogState, accounts, identities, party, operators]);

  const requestRole = <T extends RoleRequestTemplates>(
    role: Template<T, undefined, string>,
    kind: RoleKind,
    extraFields?: Fields
  ) => {
    setFields({
      operator: {
        label: 'Operator',
        type: 'selection',
        items: operators.map(o => getName(o)),
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
    <OverflowMenu>
      {canRequest(RoleKind.CUSTODY) && (
        <OverflowMenuEntry
          label="Request Custodian Role"
          onClick={() => requestRole(CustodianRequest, RoleKind.CUSTODY)}
        />
      )}
      {canRequest(RoleKind.TRADING) && (
        <OverflowMenuEntry
          label="Request Exchange Role"
          onClick={() => requestRole(ExchangeRequest, RoleKind.TRADING)}
        />
      )}

      {canRequest(RoleKind.DISTRIBUTION) && (
        <OverflowMenuEntry
          label="Request Distribution Role"
          onClick={() => requestRole(DistributionRequest, RoleKind.DISTRIBUTION)}
        />
      )}

      {canRequest(RoleKind.SETTLEMENT) && (
        <OverflowMenuEntry
          label="Request Settlement Role"
          onClick={() => requestRole(SettlementRequest, RoleKind.SETTLEMENT)}
        />
      )}

      {canRequest(RoleKind.CLEARING) && (
        <OverflowMenuEntry
          label="Request Clearinghouse Role"
          onClick={() =>
            requestRole(ClearingRequest, RoleKind.CLEARING, {
              ccpAccount: {
                label: 'CCP Account',
                type: 'selection',
                items: accounts.map(a => a.id.label),
              },
            })
          }
        />
      )}
    </OverflowMenu>
  );
};

export default RoleRequestMenu;
