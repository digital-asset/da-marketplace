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
    distributions: {
      root: '/app/distributions',
    },
    instruments: {
      root: '/app/instruments',
      instrument: {
        root: '/app/instruments/instrument',
        requests: '/app/instruments/instrument/requests',
      },
      new: {
        base: '/app/instruments/new/base',
        convertiblenote: '/app/instruments/new/convertiblenote',
        binaryoption: '/app/instruments/new/binaryoption',
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
    auctions: {
      root: '/app/auctions',
      bidding: '/app/auctions/bidding',
      new: {
        root: '/app/auctions/new',
        auction: '/app/auctions/new/auction',
      },
    },
    trading: {
      root: '/app/trading',
    },
    markets: {
      root: '/app/markets',
      order: '/app/markets/order',
      offer: '/app/markets/offer',
    },
  },
};

export default paths;
