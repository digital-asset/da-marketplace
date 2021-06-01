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
    manage: {
      root: '/app/manage',
      custody: '/app/manage/custody',
      clearing: '/app/manage/clearing',
      distributions: '/app/manage/distributions',
      instrument: '/app/manage/instrument',
      instruments: '/app/manage/instruments',
      issuance: '/app/manage/issuance',
      trading: '/app/manage/trading',
      listings: '/app/manage/listings',
    },
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
    custody: {
      account: '/app/custody/account',
      accounts: {
        root: '/app/custody/accounts',
        new: '/app/custody/accounts/new',
      },
      assets: '/app/custody/assets',
      requests: '/app/custody/requests',
    },
    distribution: {
      auctions: '/app/distribution/auctions',
      new: '/app/distribution/new',
      bidding: '/app/distribution/bidding',
    },
    instrument: {
      requests: '/app/instrument/requests',
    },
    trading: {
      markets: '/app/trading/markets',
      order: '/app/trading/order',
    },
  },
};

export default paths;
