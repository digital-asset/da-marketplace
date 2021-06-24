import React, { useEffect, useMemo, useState } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { Button, Header, Menu } from 'semantic-ui-react';

import { LogoutIcon, NotificationIcon } from '../../icons/icons';
import { useStreamQueries } from '../../Main';

import classNames from 'classnames';
import { signOut, useUserDispatch } from '../../context/UserContext';
import paths from '../../paths';
import { usePartyName } from '../../config';
import { partitionArray } from '../../pages/common';

import { useParty } from '@daml/react';

import { AllocationAccountRule } from '@daml.js/da-marketplace/lib/Marketplace/Rule/AllocationAccount';
import { AssetSettlementRule } from '@daml.js/da-marketplace/lib/DA/Finance/Asset/Settlement';
import { Service } from '@daml.js/da-marketplace/lib/Marketplace/Clearing/Service';
import { Auction } from '@daml.js/da-marketplace/lib/Marketplace/Distribution/Auction/Model';
import { Auction as BiddingAuctionContract } from '@daml.js/da-marketplace/lib/Marketplace/Distribution/Bidding/Model';
import { Order } from '@daml.js/da-marketplace/lib/Marketplace/Trading/Model';
import { AssetDescription } from '@daml.js/da-marketplace/lib/Marketplace/Issuance/AssetDescription';
import { Listing } from '@daml.js/da-marketplace/lib/Marketplace/Listing/Model';
import { useAllNotifications } from '../../pages/notifications/Notifications';

type Props = {
  title?: React.ReactElement;
  activeMenuTitle?: boolean;
  buttons?: JSX.Element[];
};

const TopMenu: React.FC<Props> = ({ title, buttons, activeMenuTitle }) => {
  const history = useHistory();
  const party = useParty();

  const userDispatch = useUserDispatch();
  const { getName } = usePartyName('');
  const path = useLocation().pathname;

  const contractId = path.split('/')[4];

  const [contractTitle, setContractTitle] = useState<string>();

  const { contracts: accounts } = useStreamQueries(AssetSettlementRule);
  const { contracts: allocatedAccounts } = useStreamQueries(AllocationAccountRule);

  const allAccounts = useMemo(
    () =>
      accounts
        .map(a => {
          return { account: a.payload.account, contractId: a.contractId.replace('#', '_') };
        })
        .concat(
          allocatedAccounts.map(a => {
            return { account: a.payload.account, contractId: a.contractId.replace('#', '_') };
          })
        ),
    [accounts, allocatedAccounts]
  );

  const accountLabel = allAccounts.find(c => c.contractId === contractId)?.account.id.label;
  const customerId = useStreamQueries(Service).contracts.find(c => c.contractId === contractId)
    ?.payload.customer;
  const customer = customerId && getName(customerId);
  const auctionId = useStreamQueries(Auction).contracts.find(c => c.contractId === contractId)
    ?.payload.auctionId;
  const biddingId = useStreamQueries(BiddingAuctionContract).contracts.find(
    c => c.contractId === contractId
  )?.payload.auctionId;
  const orderLabel = useStreamQueries(Order).contracts.find(c => c.contractId === contractId)
    ?.payload.details.id.label;
  const instrumentLabel = useStreamQueries(AssetDescription).contracts.find(
    c => c.contractId === contractId
  )?.payload.assetId.label;
  const listingLabel = useStreamQueries(Listing).contracts.find(c => c.contractId === contractId)
    ?.payload.listingId.label;

  const allNotifications = useAllNotifications(party);
  const [notifications, pendingNotifications] = partitionArray(
    n => n.kind !== 'Pending',
    allNotifications
  );
  const notifCount = notifications.reduce((count, { contracts }) => count + contracts.length, 0);
  const pendingNotifCount = pendingNotifications.reduce(
    (count, { contracts }) => count + contracts.length,
    0
  );

  useEffect(() => {
    setContractTitle(undefined);
    if (path.includes('notifications')) {
      return setContractTitle('Notifications');
    }
    if (hasContractId(path, paths.app.wallet.account)) {
      return setContractTitle(accountLabel);
    } else if (hasContractId(path, paths.app.clearing.member)) {
      return setContractTitle(customer);
    } else if (hasContractId(path, paths.app.auctions.root)) {
      return setContractTitle(auctionId);
    } else if (hasContractId(path, paths.app.biddingAuctions)) {
      return setContractTitle(biddingId);
    } else if (hasContractId(path, paths.app.markets.order)) {
      return setContractTitle(orderLabel);
    } else if (hasContractId(path, paths.app.instruments.instrument)) {
      return setContractTitle(instrumentLabel);
    } else if (hasContractId(path, paths.app.listings.root)) {
      return setContractTitle(listingLabel);
    }
  }, [
    path,
    accountLabel,
    customer,
    auctionId,
    biddingId,
    orderLabel,
    instrumentLabel,
    listingLabel,
  ]);

  function hasContractId(path: string, matchPath: string) {
    return path.includes(matchPath) && path.split('/').length > 3;
  }

  return (
    <div className="top-section">
      <Menu className="top-menu">
        <Menu.Menu position="left">
          <Menu.Item
            as={!activeMenuTitle ? 'div' : undefined}
            disabled={!activeMenuTitle}
            onClick={history.goBack}
          >
            <Header className="bold icon-header" as="h1">
              <Header.Content>{contractTitle || title}</Header.Content>
            </Header>
          </Menu.Item>
          {buttons?.map(b => (
            <Menu.Item key={b.key} className="menu-button">
              {b}
            </Menu.Item>
          ))}
        </Menu.Menu>
        <Menu.Menu position="right">
          <Menu.Item className="notification-button">
            <Link className="ghost smaller" to={paths.app.notifications}>
              <NotificationIcon />
              <div
                className={classNames(
                  { 'notifications-icon active': notifCount > 0 },
                  {
                    'notifications-icon pending': notifCount === 0 && pendingNotifCount > 0,
                  }
                )}
              >
                {notifCount > 0 ? notifCount : pendingNotifCount > 0 ? pendingNotifCount : null}
              </div>
            </Link>
          </Menu.Item>
          <Menu.Item className="log-out-button">
            <Button className="ghost smaller" onClick={() => signOut(userDispatch, history)}>
              <div className="log-out">
                <p>Log out</p>
                <LogoutIcon />
              </div>
            </Button>
          </Menu.Item>
        </Menu.Menu>
      </Menu>
    </div>
  );
};

export default TopMenu;
