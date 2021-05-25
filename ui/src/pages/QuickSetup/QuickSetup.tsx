import React, { useEffect, useState } from 'react';

import { Button, Loader, Menu } from 'semantic-ui-react';

import { useHistory } from 'react-router-dom';

import classNames from 'classnames';

import DamlLedger, { useLedger } from '@daml/react';
import { PartyDetails } from '@daml/hub-react';
import { WellKnownPartiesProvider } from '@daml/hub-react/lib';

import { Role as OperatorService } from '@daml.js/da-marketplace/lib/Marketplace/Operator/Role';
import { Role as RegulatorRole } from '@daml.js/da-marketplace/lib/Marketplace/Regulator/Role';
import {
  IdentityVerificationRequest,
  Service as RegulatorService,
} from '@daml.js/da-marketplace/lib/Marketplace/Regulator/Service';
import { VerifiedIdentity } from '@daml.js/da-marketplace/lib/Marketplace/Regulator/Model';

import { httpBaseUrl, wsBaseUrl, ledgerId, publicParty, isHubDeployment } from '../../config';

import Credentials, { computeCredentials } from '../../Credentials';
import { retrieveParties, retrieveUserParties } from '../../Parties';

import { halfSecondPromise } from '../page/utils';

import { deployAutomation, MarketplaceTrigger, TRIGGER_HASH } from '../../automation';

import { ArrowLeftIcon, ArrowRightIcon, OpenMarketplaceLogo } from '../../icons/icons';
import QueryStreamProvider from '../../websocket/queryStream';
import { PublicDamlProvider, useStreamQueries } from '../../Main';

import AddPartiesPage from './AddPartiesPage';
import SelectRolesPage from './SelectRolesPage';
import SelectAutomationPage from './SelectAutomationPage';
import OfferServicesPage from './OfferServicesPage';
import ReviewPage from './ReviewPage';
import FinishPage from './FinishPage';
import { Offer as RegulatorOffer } from '@daml.js/da-marketplace/lib/Marketplace/Regulator/Service';

enum MenuItems {
  ADD_PARTIES = 'Add Parties',
  SELECT_ROLES = 'Select Roles',
  SELECT_AUTOMATION = 'Select Automation',
  OFFER_SERVICES = 'Offer Services',
  REVIEW = 'Review',
}

enum LoadingStatus {
  CREATING_ADMIN_CONTRACTS = 'Confirming Admin role....',
  WAITING_FOR_TRIGGERS = 'Waiting for auto-approve triggers to deploy. This may take up to 5 minutes....',
}

const QuickSetup = () => {
  const localCreds = computeCredentials('Operator');
  const history = useHistory();
  const parties = retrieveParties() || [];
  const userParties = retrieveUserParties() || [];

  const [adminCredentials, setAdminCredentials] = useState<Credentials>(localCreds);
  const [activeMenuItem, setActiveMenuItem] = useState<MenuItems | undefined>(
    MenuItems.ADD_PARTIES
  );

  const [loadingStatus, setLoadingStatus] = useState<LoadingStatus | undefined>();

  useEffect(() => {
    if (isHubDeployment) {
      const adminParty = parties.find(p => p.partyName === 'UserAdmin');
      if (adminParty) {
        setAdminCredentials({ token: adminParty.token, party: adminParty.party, ledgerId });
      }
    }
  }, [activeMenuItem]);

  useEffect(() => {
    // deploy auto-trigger for all parties
    async function deployAllTriggers() {
      if (isHubDeployment && parties.length > 0) {
        const artifactHash = TRIGGER_HASH;

        if (!artifactHash || !adminCredentials) {
          return;
        }

        Promise.all(
          [
            ...parties,
            {
              ...adminCredentials,
            },
          ].map(p => {
            return deployAutomation(
              artifactHash,
              MarketplaceTrigger.AutoApproveTrigger,
              p.token,
              publicParty
            );
          })
        );
      }
    }

    deployAllTriggers();
  }, [parties, adminCredentials]);

  let activePage;

  if (activeMenuItem === MenuItems.ADD_PARTIES) {
    activePage = (
      <AddPartiesPage
        localOperator={localCreds.party}
        onComplete={() => {
          setLoadingStatus(LoadingStatus.CREATING_ADMIN_CONTRACTS);
          setActiveMenuItem(MenuItems.SELECT_ROLES);
        }}
      />
    );
  } else if (activeMenuItem === MenuItems.SELECT_ROLES) {
    activePage = loadingStatus ? (
      <div className="setup-page loading">
        <LoadingWheel label={loadingStatus} />
      </div>
    ) : (
      <SelectRolesPage
        adminCredentials={adminCredentials}
        onComplete={() => setActiveMenuItem(MenuItems.SELECT_AUTOMATION)}
      />
    );
  } else if (activeMenuItem === MenuItems.SELECT_AUTOMATION) {
    activePage = isHubDeployment ? (
      <SelectAutomationPage
        adminCredentials={adminCredentials}
        onComplete={() => setActiveMenuItem(MenuItems.OFFER_SERVICES)}
      />
    ) : (
      <UnsupportedPageStep onComplete={() => setActiveMenuItem(MenuItems.OFFER_SERVICES)} />
    );
  } else if (activeMenuItem === MenuItems.OFFER_SERVICES) {
    activePage = (
      <OfferServicesPage
        adminCredentials={adminCredentials}
        onComplete={() => {
          setActiveMenuItem(MenuItems.REVIEW);
        }}
        backToSelectRoles={() => setActiveMenuItem(MenuItems.SELECT_ROLES)}
      />
    );
  } else if (activeMenuItem === MenuItems.REVIEW) {
    activePage = (
      <ReviewPage
        adminCredentials={adminCredentials}
        onComplete={() => {
          setActiveMenuItem(undefined);
        }}
      />
    );
  } else if (activeMenuItem === undefined) {
    activePage = <FinishPage adminCredentials={adminCredentials} />;
  }

  return (
    <WellKnownPartiesProvider>
      <div className="quick-setup">
        <div className="page-controls">
          <Button className="ghost dark control-button" onClick={() => history.push('/login')}>
            <ArrowLeftIcon color={'white'} />
            Back
          </Button>
          <Button
            className="ghost dark control-button"
            onClick={() => setActiveMenuItem(undefined)}
          >
            Skip to Log In
            <ArrowRightIcon color={'white'} />
          </Button>
        </div>

        <div className="quick-setup-header">
          <h1 className="logo-header">
            <OpenMarketplaceLogo size="32" /> Daml Open Marketplace
          </h1>
          {activeMenuItem ? <h2>Market Set-Up</h2> : <h2>Log In</h2>}
        </div>

        <div className="quick-setup-tile">
          {activeMenuItem && (
            <Menu pointing secondary className="quick-setup-menu page-row">
              {Object.values(MenuItems).map((item, i) => (
                <>
                  <Menu.Item
                    key={i}
                    disabled={checkIsDisabled(item)}
                    active={activeMenuItem === item}
                    onClick={() => setActiveMenuItem(item)}
                  >
                    <p className={classNames({ visited: !checkIsDisabled(item) })}>{item}</p>
                  </Menu.Item>
                  {i + 1 !== Object.values(MenuItems).length && (
                    <ArrowRightIcon
                      color={checkIsDisabled(Object.values(MenuItems)[i + 1]) ? 'grey' : 'blue'}
                    />
                  )}
                </>
              ))}
            </Menu>
          )}
          {activePage}
        </div>

        {loadingStatus === LoadingStatus.CREATING_ADMIN_CONTRACTS && (
          <DamlLedger
            token={adminCredentials.token}
            party={adminCredentials.party}
            httpBaseUrl={httpBaseUrl}
            wsBaseUrl={wsBaseUrl}
          >
            <QueryStreamProvider defaultPartyToken={adminCredentials.token}>
              <AdminLedger
                adminCredentials={adminCredentials}
                onComplete={() => setLoadingStatus(LoadingStatus.WAITING_FOR_TRIGGERS)}
              />
            </QueryStreamProvider>
          </DamlLedger>
        )}

        {loadingStatus === LoadingStatus.WAITING_FOR_TRIGGERS &&
          userParties.map(p => (
            <PublicDamlProvider
              party={p.party}
              token={p.token}
              httpBaseUrl={httpBaseUrl}
              wsBaseUrl={wsBaseUrl}
            >
              <QueryStreamProvider defaultPartyToken={p.token}>
                <CreateVerifiedIdentity party={p} onComplete={() => setLoadingStatus(undefined)} />
              </QueryStreamProvider>
            </PublicDamlProvider>
          ))}
      </div>
    </WellKnownPartiesProvider>
  );

  function checkIsDisabled(item: MenuItems) {
    if (!activeMenuItem) {
      return false;
    }
    const clickedItemIndex = Object.values(MenuItems).indexOf(item);
    const activeItemIndex = Object.values(MenuItems).indexOf(activeMenuItem);
    if (clickedItemIndex > activeItemIndex) {
      return true;
    }
    return false;
  }
};

const UnsupportedPageStep = (props: { onComplete: () => void }) => {
  return (
    <div className="setup-page not-supported">
      <p className="page-row">This step is not supported locally.</p>
      <Button className="ghost next" onClick={() => props.onComplete()}>
        Next
      </Button>
    </div>
  );
};

const CreateVerifiedIdentity = (props: { onComplete: () => void; party: PartyDetails }) => {
  const { onComplete, party } = props;
  const ledger = useLedger();
  const userParties = retrieveUserParties() || [];

  const { contracts: regulatorServices, loading: regulatorServicesLoading } =
    useStreamQueries(RegulatorService);

  const { contracts: verifiedIdentities, loading: verifiedIdentitiesLoading } =
    useStreamQueries(VerifiedIdentity);

  const { contracts: verifiedIdentityRequests, loading: verifiedIdentityRequestsLoading } =
    useStreamQueries(IdentityVerificationRequest);

  useEffect(() => {
    if (regulatorServicesLoading || verifiedIdentitiesLoading || verifiedIdentityRequestsLoading) {
      return;
    }

    const handleVerifiedIdentity = async () => {
      let retries = 0;

      const currentServices = regulatorServices.filter(s => s.payload.customer === party.party);

      while (retries < 3) {
        if (currentServices.length > 0) {
          await Promise.all(
            currentServices.map(async service => {
              await ledger.exercise(
                RegulatorService.RequestIdentityVerification,
                service.contractId,
                {
                  legalName: party.partyName,
                  location: '',
                  observers: [publicParty],
                }
              );
            })
          );
          break;
        } else {
          await halfSecondPromise();
          retries++;
        }
      }
    };

    if (
      !verifiedIdentities.find(id => id.payload.customer === party.party) &&
      !verifiedIdentityRequests.find(c => c.payload.customer === party.party)
    ) {
      handleVerifiedIdentity();
    }

    if (userParties.every(p => !!verifiedIdentities.find(v => v.payload.customer === p.party))) {
      return onComplete();
    }
  }, [
    verifiedIdentities,
    verifiedIdentitiesLoading,
    regulatorServices,
    regulatorServicesLoading,
    verifiedIdentityRequestsLoading,
    verifiedIdentityRequests,
    party,
  ]);

  return null;
};

const AdminLedger = (props: { adminCredentials: Credentials; onComplete: () => void }) => {
  const { adminCredentials, onComplete } = props;
  const userParties = retrieveUserParties() || [];

  const ledger = useLedger();

  const { contracts: operatorService, loading: operatorServiceLoading } =
    useStreamQueries(OperatorService);
  const { contracts: regulatorRoles, loading: regulatorRolesLoading } =
    useStreamQueries(RegulatorRole);
  const { contracts: regulatorServices, loading: regulatorServicesLoading } =
    useStreamQueries(RegulatorService);
  const { contracts: regulatorServiceOffers, loading: regulatorServiceOffersLoading } =
    useStreamQueries(RegulatorOffer);

  const createOperatorService = async () => {
    return await ledger.create(OperatorService, { operator: adminCredentials.party });
  };

  const createRegulatorRole = async () => {
    return await ledger.create(RegulatorRole, {
      operator: adminCredentials.party,
      provider: adminCredentials.party,
    });
  };

  const offerRegulatorService = async (party: string) => {
    const regulatorRoleId = regulatorRoles[0]?.contractId;
    if (regulatorRoleId) {
      return await ledger.exercise(RegulatorRole.OfferRegulatorService, regulatorRoleId, {
        customer: party,
      });
    }
  };

  const offerRegulatorServices = async () => {
    await Promise.all(
      userParties.map(async party => {
        if (
          !regulatorServices.find(c => c.payload.customer === party.party) &&
          !regulatorServiceOffers.find(c => c.payload.customer === party.party)
        ) {
          return await offerRegulatorService(party.party);
        }
      })
    );
  };

  useEffect(() => {
    if (
      operatorServiceLoading ||
      regulatorRolesLoading ||
      regulatorServicesLoading ||
      regulatorServiceOffersLoading
    ) {
      return;
    }

    if (
      userParties.every(
        p =>
          !!regulatorServiceOffers.find(c => c.payload.customer === p.party) ||
          !!regulatorServices.find(contract => contract.payload.customer === p.party)
      )
    ) {
      return onComplete();
    }
    if (operatorService.length === 0) {
      createOperatorService();
    } else if (regulatorRoles.length === 0) {
      createRegulatorRole();
    } else {
      offerRegulatorServices();
    }
  }, [
    regulatorRolesLoading,
    operatorServiceLoading,
    regulatorServicesLoading,
    regulatorServiceOffersLoading,
    regulatorServices,
    regulatorRoles,
    operatorService,
    regulatorServiceOffers,
  ]);

  return null;
};

export const LoadingWheel = (props: { label?: string }) => {
  return (
    <Loader active indeterminate size="small">
      <p>{props.label || 'Loading...'}</p>
    </Loader>
  );
};

export default QuickSetup;
