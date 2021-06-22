import React from 'react';
import { Button } from 'semantic-ui-react';
import { CreateEvent } from '@daml/ledger';
import { useLedger, useParty } from '@daml/react';
import { useStreamQueries } from '../../Main';
import { Role as ExchangeRole } from '@daml.js/da-marketplace/lib/Marketplace/Trading/Role';
import { Service } from '@daml.js/da-marketplace/lib/Marketplace/Trading/Service/module';
import { getTemplateId, usePartyName } from '../../config';
import StripedTable from '../../components/Table/StripedTable';
import {NewFee} from './Fees';

type Props = {
  services: Readonly<CreateEvent<Service, any, any>[]>;
};

export const TradingServiceTable: React.FC<Props> = ({ services }) => {
  const party = useParty();
  const { getName } = usePartyName(party);
  const ledger = useLedger();

  const role = useStreamQueries(ExchangeRole).contracts.find(rl => rl.payload.provider === party);

  const terminateService = async (c: CreateEvent<Service>) => {
    await ledger.exercise(Service.Terminate, c.contractId, { ctrl: party });
  };

  return (
    <div>
      {!!role && (
        <NewFee role={role}/>
      )}
      <StripedTable
        title="Trading"
        headings={[
          'Service',
          'Operator',
          'Provider',
          'Consumer',
          'Role',
          'Trading Account',
          'Allocation Account',
          'Action',
        ]}
        rows={services.map((c, i) => {
          return {
            elements: [
              getTemplateId(c.templateId),
              getName(c.payload.operator),
              getName(c.payload.provider),
              getName(c.payload.customer),
              party === c.payload.provider ? 'Provider' : 'Consumer',
              c.payload.tradingAccount.id.label,
              c.payload.allocationAccount.id.label,
              <Button className="ghost warning" onClick={() => terminateService(c)}>
                Terminate
              </Button>,
            ],
          };
        })}
      />
    </div>
  );
};
