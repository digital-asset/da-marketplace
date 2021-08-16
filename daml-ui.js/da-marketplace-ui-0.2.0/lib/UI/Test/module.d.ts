// Generated from UI/Test.daml
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-use-before-define */
import * as jtv from '@mojotech/json-type-validation';
import * as damlTypes from '@daml/types';
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
import * as damlLedger from '@daml/ledger';

export declare type Parties = {
  operator: damlTypes.Party;
  public: damlTypes.Party;
  bank: damlTypes.Party;
  auctionhouse: damlTypes.Party;
  exchange: damlTypes.Party;
  issuer: damlTypes.Party;
  ccp: damlTypes.Party;
  alice: damlTypes.Party;
  bob: damlTypes.Party;
};

export declare const Parties:
  damlTypes.Serializable<Parties> & {
  }
;

