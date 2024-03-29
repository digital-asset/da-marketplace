import classNames from 'classnames';
import React from 'react';
import { Header } from 'semantic-ui-react';

import DamlLedger from '@daml/react';

import Credentials from '../../Credentials';
import { httpBaseUrl, wsBaseUrl } from '../../config';
import { MessagesProvider } from '../../context/MessagesContext';
import { OffersProvider } from '../../context/OffersContext';
import { RolesProvider } from '../../context/RolesContext';
import { ServicesProvider } from '../../context/ServicesContext';
import QueryStreamProvider from '../../websocket/queryStream';

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
        <MessagesProvider>
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
        </MessagesProvider>
      </QueryStreamProvider>
    </DamlLedger>
  );
};

export default QuickSetupPage;
