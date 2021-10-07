import React from 'react';
import { Form } from 'semantic-ui-react';

import { CreateEvent } from '@daml/ledger';

import { Id } from '@daml.js/da-marketplace/lib/DA/Finance/Types';
import { AssetDescription } from '@daml.js/da-marketplace/lib/Marketplace/Issuance/AssetDescription';

import { createDropdownProp } from '../common';

export const CurrencySelect: React.FC<{
  setter: React.Dispatch<React.SetStateAction<Id | undefined>>;
  assets: readonly CreateEvent<AssetDescription>[];
  label: string;
  selected?: string;
  readOnly?: boolean;
}> = ({ setter, assets, label, readOnly, selected }) => {
  const assetOptions = assets.map(a => createDropdownProp(a.payload.assetId.label));
  return (
    <Form.Select
      className="select"
      label={label}
      placeholder="Select..."
      required
      readOnly={readOnly}
      disabled={readOnly}
      value={assets.find(a => a.payload.assetId.label === selected)?.payload.assetId.label}
      options={assetOptions}
      onChange={(_, change) =>
        setter(
          assets.find(c => c.payload.assetId.label === (change.value as string))?.payload.assetId
        )
      }
    />
  );
};
