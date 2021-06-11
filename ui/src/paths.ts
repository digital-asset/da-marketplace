const paths = {
  root: '/',
  login: '/login',
  quickSetup: {
    root: '/quick-setup',
    logInParties: '/quick-setup/log-in-parties',
  },
  app: {
    root: '/app',
    notifications: '/app/notifications',
    clearingServices: '/app/clearing',
    distributions: '/app/distributions',
    instruments: '/app/instruments',
    issuance: '/app/issuance',
    listings: '/app/listings',
    setup: {
      root: '/app/setup',
      clearing: {
        offer: '/app/setup/clearing/offer',
        market: { offer: '/app/setup/clearing/market/offer' },
      },
      custody: { offer: '/app/setup/custody/offer' },
      distribution: {
        new: { auction: '/app/setup/distribution/new/auction' },
      },
      identity: '/app/setup/identity',
      instrument: {
        new: {
          base: '/app/setup/instrument/new/base',
          convertiblenote: '/app/setup/instrument/new/convertiblenote',
          binaryoption: '/app/setup/instrument/new/binaryoption',
        },
      },
      issuance: { new: '/app/setup/issuance/new' },
      listing: { new: '/app/setup/listing/new' },
      trading: { offer: '/app/setup/trading/offer' },
    },
    clearing: {
      members: '/app/clearing/members',
      member: '/app/clearing/member',
    },
    custody: '/app/custody',
    wallet: {
      root: '/app/wallet',
      account: '/app/wallet/account',
      accounts: {
        root: '/app/wallet/accounts',
        new: '/app/wallet/accounts/new',
      },
      requests: '/app/wallet/requests',
    },
    distribution: {
      auctions: '/app/distribution/auctions',
      new: '/app/distribution/new',
      bidding: '/app/distribution/bidding',
    },
    instrument: {
      root: '/app/instrument',
      requests: '/app/instrument/requests',
    },
    trading: {
      root: '/app/trading',
      markets: '/app/trading/markets',
      order: '/app/trading/order',
    },
  },
};

export default paths;
