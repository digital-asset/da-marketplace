import { CreateEvent } from '@daml/ledger';
import { DropdownItemProps, DropdownProps } from 'semantic-ui-react';
import { Map, emptyMap } from '@daml/types';
import React from 'react';
import { useAdminParty, usePublicParty as useHubPublicParty } from '@daml/hub-react';
import { deploymentMode, DeploymentMode } from '../config';

export type ServicePageProps<T extends object> = {
  services: Readonly<CreateEvent<T, any, any>[]>;
};

function isStringArray(strArr: any): strArr is string[] {
  if (Array.isArray(strArr)) {
    return strArr.reduce((acc, elem) => {
      return acc && typeof elem === 'string';
    }, true);
  } else {
    return false;
  }
}

export const handleSelectMultiple = (
  result: DropdownProps,
  current: string[],
  setter: React.Dispatch<React.SetStateAction<string[]>>
) => {
  if (typeof result.value === 'string') {
    setter([...current, result.value]);
  } else if (isStringArray(result.value)) {
    setter(result.value);
  }
};

export const createDropdownProp = (
  text: string,
  value?: string,
  key?: string
): DropdownItemProps => {
  value = value || text;
  key = key || value;
  return { key, value, text };
};

type DamlSet<T> = { map: Map<T, {}> };

export function makeDamlSet<T>(items: T[]): DamlSet<T> {
  return { map: items.reduce((map, val) => map.set(val, {}), emptyMap<T, {}>()) };
}

export function damlSetValues<T>(damlSet: DamlSet<T>): T[] {
  const r: T[] = [];
  const it = damlSet.map.keys();
  let i = it.next();
  while (!i.done) {
    r.push(i.value);
    i = it.next();
  }
  return r;
}

const PUBLIC_PARTY_ID_KEY = 'default_parties/public_party_id';

export function usePublicParty() {
  // Cache in localStorage to share across all tabs & restarts
  const { save, load } = cache({ permanent: true });

  const [publicParty, setPublicParty] = React.useState<string>();
  const hubPublicParty = useHubPublicParty();

  React.useEffect(() => {
    const cachedPublicParty = load(PUBLIC_PARTY_ID_KEY);
    if (cachedPublicParty) {
      setPublicParty(cachedPublicParty);
    }
  }, []);

  React.useEffect(() => {
    if (deploymentMode === DeploymentMode.DEV) {
      setPublicParty('Public');
    } else {
      if (!publicParty && hubPublicParty) {
        save(PUBLIC_PARTY_ID_KEY, hubPublicParty);
        setPublicParty(hubPublicParty);
      }
    }
  }, [publicParty, hubPublicParty]);

  return publicParty;
}

const USER_ADMIN_PARTY_ID_KEY = 'default_parties/user_admin_party_id';

export function useOperatorParty() {
  // Cache in localStorage to share across all tabs & restarts
  const { save, load } = cache({ permanent: true });

  const [operator, setOperator] = React.useState<string>();
  const hubAdminParty = useAdminParty();

  React.useEffect(() => {
    const cachedUserAdmin = load(USER_ADMIN_PARTY_ID_KEY);
    if (cachedUserAdmin) {
      setOperator(cachedUserAdmin);
    }
  }, []);

  React.useEffect(() => {
    if (deploymentMode === DeploymentMode.DEV) {
      setOperator('Operator');
    } else {
      if (!operator && hubAdminParty) {
        save(USER_ADMIN_PARTY_ID_KEY, hubAdminParty);
        setOperator(hubAdminParty);
      }
    }
  }, [operator, hubAdminParty]);

  return operator;
}
