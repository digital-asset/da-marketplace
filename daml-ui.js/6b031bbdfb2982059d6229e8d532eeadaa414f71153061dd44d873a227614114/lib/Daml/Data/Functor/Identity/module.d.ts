// Generated from Daml/Data/Functor/Identity.daml
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-use-before-define */
import * as jtv from '@mojotech/json-type-validation';
import * as damlTypes from '@daml/types';
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
import * as damlLedger from '@daml/ledger';

export declare type Identity<a> = {
  unpack: a;
};

export declare const Identity :
  (<a>(a: damlTypes.Serializable<a>) => damlTypes.Serializable<Identity<a>>) & {
};

