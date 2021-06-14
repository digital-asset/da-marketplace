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
      instrument: '/app/instruments/instrument',
      new: {
        base: '/app/instruments/new/base',
        convertiblenote: '/app/instruments/new/convertiblenote',
        binaryoption: '/app/instruments/new/binaryoption',
      },
    },
    trading: '/app/trading',
    listings: { root: '/app/listings', new: '/app/listings/new' },
    issuance: { root: '/app/issuance', new: '/app/issuance/new' },
    setup: {
      root: '/app/setup',
      identity: '/app/setup/identity',
    },
    // TODO: nest clearing structure
    clearing: {
      root: '/app/clearing',
      member: '/app/clearing/member',
    },
    clearingServices: {
      root: '/app/clearingServices',
      member: '/app/clearing/member',
      offer: '/app/clearing/offer',
      market: { offer: '/app/clearingServices/market/offer' },
    },
    clearingMembers: {
      root: '/app/clearingMembers',
      member: '/app/clearingMembers/member',
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
      new: '/app/auctions/new',
    },
    biddingAuctions: '/app/biddingAuctions',
    markets: {
      root: '/app/markets',
      order: '/app/markets/order',
      offer: '/app/markets/offer',
    },
  },
};

export default paths;
