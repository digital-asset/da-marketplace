// Generated from Daml/Control/Recursion.daml
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-use-before-define */
import * as jtv from '@mojotech/json-type-validation';
import * as damlTypes from '@daml/types';
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
import * as damlLedger from '@daml/ledger';

export declare type ListF<a, x> =
  |  { tag: 'Nil'; value: {} }
  |  { tag: 'Cons'; value: ListF.Cons<a, x> }
;

export declare const ListF :
  (<a, x>(a: damlTypes.Serializable<a>, x: damlTypes.Serializable<x>) => damlTypes.Serializable<ListF<a, x>>) & {
  Cons: (<a, x>(a: damlTypes.Serializable<a>, x: damlTypes.Serializable<x>) => damlTypes.Serializable<ListF.Cons<a, x>>);
};


export namespace ListF {
  type Cons<a, x> = {
    value: a;
    pattern: x;
  };
} //namespace ListF

