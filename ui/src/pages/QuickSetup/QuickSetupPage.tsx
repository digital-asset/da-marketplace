import React from 'react';

import classNames from 'classnames';

import { Header } from 'semantic-ui-react';

import DamlLedger from '@daml/react';
import { PartyToken } from '@daml/hub-react';

import { httpBaseUrl, wsBaseUrl } from '../../config';
import QueryStreamProvider from '../../websocket/queryStream';

import { ServicesProvider } from '../../context/ServicesContext';
import { OffersProvider } from '../../context/OffersContext';
import { RolesProvider } from '../../context/RolesContext';

interface QuickSetupPageProps {
  adminCredentials: PartyToken;
  className?: string;
  title?: string;
}

const QuickSetupPage: React.FC<QuickSetupPageProps> = ({
  adminCredentials,
  children,
  className,
  title,
}) => {
  return (
    <DamlLedger
      party={adminCredentials.party}
      token={adminCredentials.token}
      httpBaseUrl={httpBaseUrl}
      wsBaseUrl={wsBaseUrl}
    >
      <QueryStreamProvider defaultPartyToken={adminCredentials.token}>
        <ServicesProvider>
          <RolesProvider>
            <OffersProvider>
              <div className={classNames('setup-page', className)}>
                {!!title && (
                  <Header as="h2" className="title">
                    {title}
                  </Header>
                )}
                {children}
              </div>
            </OffersProvider>
          </RolesProvider>
        </ServicesProvider>
      </QueryStreamProvider>
    </DamlLedger>
  );
};

export default QuickSetupPage;
