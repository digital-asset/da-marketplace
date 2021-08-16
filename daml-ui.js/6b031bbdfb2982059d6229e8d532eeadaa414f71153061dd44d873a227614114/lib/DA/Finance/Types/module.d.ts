// Generated from DA/Finance/Types.daml
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-use-before-define */
import * as jtv from '@mojotech/json-type-validation';
import * as damlTypes from '@daml/types';
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
import * as damlLedger from '@daml/ledger';

import * as pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657 from '@daml.js/97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657';

export declare type MasterAgreement = {
  id: Id;
  party1: damlTypes.Party;
  party2: damlTypes.Party;
};

export declare const MasterAgreement:
  damlTypes.Serializable<MasterAgreement> & {
  }
;


export declare type Asset = {
  id: Id;
  quantity: damlTypes.Numeric;
};

export declare const Asset:
  damlTypes.Serializable<Asset> & {
  }
;


export declare type Account = {
  id: Id;
  provider: damlTypes.Party;
  owner: damlTypes.Party;
};

export declare const Account:
  damlTypes.Serializable<Account> & {
  }
;


export declare type Id = {
  signatories: pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657.DA.Set.Types.Set<damlTypes.Party>;
  label: string;
  version: damlTypes.Int;
};

export declare const Id:
  damlTypes.Serializable<Id> & {
  }
;

