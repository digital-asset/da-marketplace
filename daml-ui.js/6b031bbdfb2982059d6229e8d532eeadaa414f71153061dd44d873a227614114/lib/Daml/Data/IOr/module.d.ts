// Generated from Daml/Data/IOr.daml
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-use-before-define */
import * as jtv from '@mojotech/json-type-validation';
import * as damlTypes from '@daml/types';
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
import * as damlLedger from '@daml/ledger';

export declare type IOr<a, b> =
  |  { tag: 'Left'; value: a }
  |  { tag: 'Right'; value: b }
  |  { tag: 'Both'; value: IOr.Both<a, b> }
;

export declare const IOr :
  (<a, b>(a: damlTypes.Serializable<a>, b: damlTypes.Serializable<b>) => damlTypes.Serializable<IOr<a, b>>) & {
  Both: (<a, b>(a: damlTypes.Serializable<a>, b: damlTypes.Serializable<b>) => damlTypes.Serializable<IOr.Both<a, b>>);
};


export namespace IOr {
  type Both<a, b> = {
    left: a;
    right: b;
  };
} //namespace IOr

