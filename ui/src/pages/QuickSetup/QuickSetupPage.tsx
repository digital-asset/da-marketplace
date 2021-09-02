import React from 'react';

import classNames from 'classnames';

import DamlLedger from '@daml/react';

import { Header } from 'semantic-ui-react';

import Credentials from '../../Credentials';

import { httpBaseUrl, wsBaseUrl, publicParty } from '../../config';
import QueryStreamProvider from '../../websocket/queryStream';

import { ServicesProvider } from '../../context/ServicesContext';
import { OffersProvider } from '../../context/OffersContext';
import { RolesProvider } from '../../context/RolesContext';
import { AutomationProvider } from '../../context/AutomationContext';

interface QuickSetupPageProps {
  adminCredentials: Credentials;
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
        <AutomationProvider publicParty={publicParty}>
          <ServicesProvider>
            <RolesProvider>
              <OffersProvider>
                <div className="setup-page">
                  <div className={classNames(className)}>
                    {!!title && (
                      <Header as="h2" className="title">
                        {title}
                      </Header>
                    )}
                    {children}
                  </div>
                </div>
              </OffersProvider>
            </RolesProvider>
          </ServicesProvider>
        </AutomationProvider>
      </QueryStreamProvider>
    </DamlLedger>
  );
};

export default QuickSetupPage;
