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
        convertiblenote: '/app/instruments/new/convertible-note',
        binaryoption: '/app/instruments/new/binary-option',
        simplefuture: '/app/instruments/new/simple-future',
      },
    },
    trading: '/app/trading',
    listings: { root: '/app/listings', new: '/app/listings/new' },
    issuance: { root: '/app/issuance', new: '/app/issuance/new' },
    identity: '/app/identity',
    requests: '/app/requests',
    clearing: {
      root: '/app/clearing',
      member: '/app/clearing/member',
    },
    clearingServices: {
      root: '/app/clearing-services',
      member: '/app/clearing/member',
      offer: '/app/clearing/offer',
      market: { offer: '/app/clearing-services/market/offer' },
    },
    clearingMembers: {
      root: '/app/clearing-members',
      member: '/app/clearing-members/member',
    },
    custody: {
      root: '/app/custody',
      offer: '/app/custody/offer',
    },
    wallet: {
      root: '/app/wallet',
    },
    auctions: {
      root: '/app/auctions',
      new: '/app/auctions/new',
    },
    biddingAuctions: '/app/bidding-auctions',
    markets: {
      root: '/app/markets',
      order: '/app/markets/order',
      offer: '/app/markets/offer',
    },
  },
};

export default paths;
