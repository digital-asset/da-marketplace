import React from 'react';
import { Button } from 'semantic-ui-react';
import { CreateEvent } from '@daml/ledger';
import { useLedger, useParty } from '@daml/react';
import { getTemplateId, usePartyName } from '../../config';
import { Service } from '@daml.js/da-marketplace/lib/Marketplace/Custody/Service';
import StripedTable from '../../components/Table/StripedTable';
import TitleWithActions from '../../components/Common/TitleWithActions';
import paths from '../../paths';

type Props = {
  services: Readonly<CreateEvent<Service, any, any>[]>;
};

export const CustodyServiceTable: React.FC<Props> = ({ services }) => {
  const party = useParty();
  const { getName } = usePartyName(party);
  const ledger = useLedger();

  const terminateService = async (c: CreateEvent<Service>) => {
    await ledger.exercise(Service.Terminate, c.contractId, { ctrl: party });
  };

  return (
    <>
      <TitleWithActions
        title="Custody Services"
        otherActions={[{ label: 'Offer Custody Service', path: paths.app.custody.offer }]}
      />
      <StripedTable
        headings={['Service', 'Operator', 'Provider', 'Consumer', 'Role', 'Action']}
        rows={services.map((c, i) => {
          return {
            elements: [
              getTemplateId(c.templateId),
              getName(c.payload.operator),
              getName(c.payload.provider),
              getName(c.payload.customer),
              party === c.payload.provider ? 'Provider' : 'Consumer',
              <Button
                className="ghost warning small"
                onClick={() => terminateService(c)}
                floated="right"
              >
                Terminate
              </Button>,
            ],
          };
        })}
      />
    </>
  );
};
