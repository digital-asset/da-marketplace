import React from 'react';
import { CreateEvent } from '@daml/ledger';
import { useLedger, useParty } from '@daml/react';
import { useStreamQueries } from '../../Main';
import { getTemplateId, usePartyName } from '../../config';
import { Service as ClearingService } from '@daml.js/da-marketplace/lib/Marketplace/Clearing/Service';
import { Service as MarketService } from '@daml.js/da-marketplace/lib/Marketplace/Clearing/Market/Service';
import StripedTable from '../../components/Table/StripedTable';
import { Button } from 'semantic-ui-react';
import { FairValueRequest } from '../listing/Listing';
import TitleWithActions from '../../components/Common/TitleWithActions';
import paths from '../../paths';
import { ServicePageProps } from '../common';

const CLEARING_SERVICE_TEMPLATE = 'Marketplace.Clearing.Service.Service';

export const ClearingServiceTable: React.FC<ServicePageProps<ClearingService>> = ({ services }) => {
  const party = useParty();
  const { getName } = usePartyName(party);
  const ledger = useLedger();

  const { contracts: marketServices, loading: marketServicesLoading } =
    useStreamQueries(MarketService);

  const terminateService = async (c: CreateEvent<ClearingService> | CreateEvent<MarketService>) => {
    if (getTemplateId(c.templateId) === CLEARING_SERVICE_TEMPLATE) {
      await ledger.exercise(ClearingService.Terminate, c.contractId, { ctrl: party });
    } else {
      await ledger.exercise(MarketService.Terminate, c.contractId, { ctrl: party });
    }
  };

  return (
    <div>
      <TitleWithActions
        title="Clearing Services"
        otherActions={[
          {
            label: 'Offer Clearing Service',
            path: paths.app.clearingServices.offer,
          },
          {
            label: 'Offer Market Clearing Service',
            path: paths.app.clearingServices.market.offer,
          },
        ]}
      />

      <StripedTable
        headings={['Service', 'Operator', 'Provider', 'Consumer', 'Role', 'Action']}
        loading={marketServicesLoading}
        rows={[...services, ...marketServices].map(c => {
          return {
            elements: [
              getTemplateId(c.templateId),
              getName(c.payload.operator),
              getName(c.payload.provider),
              getName(c.payload.customer),
              party === c.payload.provider ? 'Provider' : 'Consumer',
              <Button.Group floated="right">
                {getTemplateId(c.templateId) !== CLEARING_SERVICE_TEMPLATE && (
                  <FairValueRequest service={c} />
                )}
                <Button negative className="ghost warning" onClick={() => terminateService(c)}>
                  Terminate
                </Button>
                ,
              </Button.Group>,
            ],
          };
        })}
      />
    </div>
  );
};
