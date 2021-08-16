// Generated from Daml/Data/Functor/Const.daml
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-use-before-define */
import * as jtv from '@mojotech/json-type-validation';
import * as damlTypes from '@daml/types';
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
import * as damlLedger from '@daml/ledger';

export declare type Const<a, b> = {
  run: a;
};

export declare const Const :
  (<a, b>(a: damlTypes.Serializable<a>, b: damlTypes.Serializable<b>) => damlTypes.Serializable<Const<a, b>>) & {
};

