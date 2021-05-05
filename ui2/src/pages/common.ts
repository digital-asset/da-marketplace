import {CreateEvent} from '@daml/ledger';
import {DropdownItemProps, DropdownProps} from 'semantic-ui-react';

export type ServicePageProps<T extends object> = {
  services: Readonly<CreateEvent<T, any, any>[]>;
};

export function isStringArray(strArr: any): strArr is string[] {
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
