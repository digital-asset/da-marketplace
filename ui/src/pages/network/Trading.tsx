import React from 'react';
import { Button } from 'semantic-ui-react';
import { CreateEvent } from '@daml/ledger';
import { useLedger, useParty } from '@daml/react';
import { useStreamQueries } from '../../Main';
import { Role as ExchangeRole } from '@daml.js/da-marketplace/lib/Marketplace/Trading/Role';
import { Service as TradingService } from '@daml.js/da-marketplace/lib/Marketplace/Trading/Service/module';
import { getTemplateId, usePartyName } from '../../config';
import StripedTable from '../../components/Table/StripedTable';
import ManageFees from './Fees';
import { Service as CustodyService } from "@daml.js/da-marketplace/lib/Marketplace/Custody/Service";

type Props = {
  tradingServices: Readonly<CreateEvent<TradingService, any, any>[]>;
  custodyServices: Readonly<CreateEvent<CustodyService, any, any>[]>;
};

export const TradingServiceTable: React.FC<Props> = ({ tradingServices, custodyServices }) => {
  const party = useParty();
  const { getName } = usePartyName(party);
  const ledger = useLedger();

  const role = useStreamQueries(ExchangeRole).contracts.find(rl => rl.payload.provider === party);

  const terminateService = async (c: CreateEvent<TradingService>) => {
    await ledger.exercise(TradingService.Terminate, c.contractId, { ctrl: party });
  };

  return (
    <div>
      {!!role && <ManageFees role={role} custodyServices={custodyServices} />}
      <StripedTable
        title="Trading"
        headings={[
          'Service',
          'Operator',
          'Provider',
          'Consumer',
          'Role',
          'Trading Account',
        ]}
        rows={tradingServices.map((c, i) => {
          return {
            elements: [
              getTemplateId(c.templateId),
              getName(c.payload.operator),
              getName(c.payload.provider),
              getName(c.payload.customer),
              party === c.payload.provider ? 'Provider' : 'Consumer',
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
