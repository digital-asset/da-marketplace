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
    distributions: '/app/distributions',
    instruments: {
      root: '/app/instruments',
      instrument: {
        root: '/app/instruments/instrument',
        requests: '/app/instruments/instrument/requests',
        new: {
          base: '/app/instruments/instrument/new/base',
          convertiblenote: '/app/instruments/instrument/new/convertiblenote',
          binaryoption: '/app/instruments/instrumen t/new/binaryoption',
        },
      },
    },
    issuance: { root: '/app/issuance', new: '/app/issuance/new' },
    listings: { root: '/app/listings', new: '/app/listings/new' },
    setup: {
      root: '/app/setup',
      identity: '/app/setup/identity',
    },
    clearing: {
      root: '/app/clearing',
      members: '/app/clearing/members',
      member: '/app/clearing/member',
      offer: '/app/clearing/offer',
      market: { offer: '/app/clearing/market/offer' },
    },
    custody: {
      root: '/app/custody',
      offer: '/app/custody/offer',
    },
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
      new: {
        root: '/app/distribution/new',
        auction: '/app/distribution/new/auction',
      },
      bidding: '/app/distribution/bidding',
    },

    trading: {
      root: '/app/trading',
      markets: '/app/trading/markets',
      order: '/app/trading/order',
      offer: '/app/trading/offer',
    },
  },
};

export default paths;
