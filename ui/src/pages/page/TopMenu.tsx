import React, { useEffect, useMemo, useState } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { Button, Header, Menu } from 'semantic-ui-react';

import { LogoutIcon, NotificationIcon } from '../../icons/icons';
import { useStreamQueries } from '../../Main';

import classNames from 'classnames';
import { signOut, useUserDispatch } from '../../context/UserContext';
import paths from '../../paths';
import { usePartyName } from '../../config';

import { AllocationAccountRule } from '@daml.js/da-marketplace/lib/Marketplace/Rule/AllocationAccount';
import { AssetSettlementRule } from '@daml.js/da-marketplace/lib/DA/Finance/Asset/Settlement';
import { Service } from '@daml.js/da-marketplace/lib/Marketplace/Clearing/Service';
import { Auction } from '@daml.js/da-marketplace/lib/Marketplace/Distribution/Auction/Model';
import { Auction as BiddingAuctionContract } from '@daml.js/da-marketplace/lib/Marketplace/Distribution/Bidding/Model';
import { Order } from '@daml.js/da-marketplace/lib/Marketplace/Trading/Model';
import { AssetDescription } from '@daml.js/da-marketplace/lib/Marketplace/Issuance/AssetDescription';
import { Listing } from '@daml.js/da-marketplace/lib/Marketplace/Listing/Model';

type Props = {
  title?: React.ReactElement;
  activeMenuTitle?: boolean;
  showNotificationAlert?: boolean;
  buttons?: JSX.Element[];
};

const TopMenu: React.FC<Props> = ({ title, buttons, activeMenuTitle, showNotificationAlert }) => {
  const history = useHistory();
  const userDispatch = useUserDispatch();
  const { getName } = usePartyName('');

  const [contractTitle, setContractTitle] = useState<string>();
  const { contracts: accounts, loading: accountsLoading } = useStreamQueries(AssetSettlementRule);
  const { contracts: allocatedAccounts, loading: allocatedAccountsLoading } =
    useStreamQueries(AllocationAccountRule);
  const { contracts: services, loading: servicesLoading } = useStreamQueries(Service);
  const { contracts: auctions, loading: auctionsLoading } = useStreamQueries(Auction);
  const { contracts: biddingAuctions, loading: biddingAuctionsLoading } =
    useStreamQueries(BiddingAuctionContract);
  const { contracts: orders, loading: ordersLoading } = useStreamQueries(Order);
  const { contracts: instruments, loading: instrumentsLoading } =
    useStreamQueries(AssetDescription);
  const { contracts: listings, loading: listingsLoading } = useStreamQueries(Listing);

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

  const path = useLocation().pathname;

  const contractId = path.split('/')[4];

  useEffect(() => {
    setContractTitle(undefined);

    if (
      accountsLoading ||
      allocatedAccountsLoading ||
      servicesLoading ||
      auctionsLoading ||
      biddingAuctionsLoading ||
      ordersLoading ||
      instrumentsLoading ||
      listingsLoading
    ) {
      return;
    }

    if (hasContractId(path, paths.app.custody.account)) {
      const accountLabel = allAccounts.find(c => c.contractId === contractId)?.account.id.label;
      if (accountLabel) {
        return setContractTitle(accountLabel);
      }
    } else if (hasContractId(path, paths.app.clearing.member)) {
      const customer = services.find(c => c.contractId === contractId)?.payload.customer;
      if (customer) {
        return setContractTitle(getName(customer));
      }
    } else if (hasContractId(path, paths.app.distribution.auctions)) {
      const auctionId = auctions.find(c => c.contractId === contractId)?.payload.auctionId;
      if (auctionId) {
        return setContractTitle(auctionId);
      }
    } else if (hasContractId(path, paths.app.distribution.bidding)) {
      const biddingId = biddingAuctions.find(c => c.contractId === contractId)?.payload.auctionId;
      if (biddingId) {
        return setContractTitle(biddingId);
      }
    } else if (hasContractId(path, paths.app.trading.order)) {
      const orderLabel = orders.find(c => c.contractId === contractId)?.payload.details.id.label;
      if (orderLabel) {
        return setContractTitle(orderLabel);
      }
    } else if (hasContractId(path, paths.app.manage.instrument)) {
      const instrumentLabel = instruments.find(c => c.contractId === contractId)?.payload.assetId
        .label;
      if (instrumentLabel) {
        return setContractTitle(instrumentLabel);
      }
    } else if (hasContractId(path, paths.app.manage.listings)) {
      const listingLabel = listings.find(c => c.contractId === contractId)?.payload.listingId.label;
      if (listingLabel) {
        return setContractTitle(listingLabel);
      }
    }
  }, [
    path,
    contractId,
    accountsLoading,
    allocatedAccountsLoading,
    servicesLoading,
    auctionsLoading,
    biddingAuctionsLoading,
    ordersLoading,
    instrumentsLoading,
    listingsLoading,
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
            <Header as="h1">
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
              <div>
                <NotificationIcon />
              </div>
              <div className={classNames({ 'notifications-active': showNotificationAlert })}></div>
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
