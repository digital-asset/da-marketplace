// Generated from ContingentClaims/Observation.daml
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-use-before-define */
import * as jtv from '@mojotech/json-type-validation';
import * as damlTypes from '@daml/types';
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
import * as damlLedger from '@daml/ledger';

import * as pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7 from '@daml.js/40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7';

export declare type ObservationF<t, x, b> =
  |  { tag: 'ConstF'; value: ObservationF.ConstF<t, x, b> }
  |  { tag: 'ObserveF'; value: ObservationF.ObserveF<t, x, b> }
  |  { tag: 'AddF'; value: pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2<b, b> }
  |  { tag: 'NegF'; value: b }
  |  { tag: 'MulF'; value: pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2<b, b> }
  |  { tag: 'DivF'; value: pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2<b, b> }
;

export declare const ObservationF :
  (<t, x, b>(t: damlTypes.Serializable<t>, x: damlTypes.Serializable<x>, b: damlTypes.Serializable<b>) => damlTypes.Serializable<ObservationF<t, x, b>>) & {
  ConstF: (<t, x, b>(t: damlTypes.Serializable<t>, x: damlTypes.Serializable<x>, b: damlTypes.Serializable<b>) => damlTypes.Serializable<ObservationF.ConstF<t, x, b>>);
  ObserveF: (<t, x, b>(t: damlTypes.Serializable<t>, x: damlTypes.Serializable<x>, b: damlTypes.Serializable<b>) => damlTypes.Serializable<ObservationF.ObserveF<t, x, b>>);
};


export namespace ObservationF {
  type ConstF<t, x, b> = {
    value: x;
  };
} //namespace ObservationF


export namespace ObservationF {
  type ObserveF<t, x, b> = {
    key: string;
  };
} //namespace ObservationF


export declare type Observation<t, x> =
  |  { tag: 'Const'; value: Observation.Const<t, x> }
  |  { tag: 'Observe'; value: Observation.Observe<t, x> }
  |  { tag: 'Add'; value: pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2<Observation<t, x>, Observation<t, x>> }
  |  { tag: 'Neg'; value: Observation<t, x> }
  |  { tag: 'Mul'; value: pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2<Observation<t, x>, Observation<t, x>> }
  |  { tag: 'Div'; value: pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2<Observation<t, x>, Observation<t, x>> }
;

export declare const Observation :
  (<t, x>(t: damlTypes.Serializable<t>, x: damlTypes.Serializable<x>) => damlTypes.Serializable<Observation<t, x>>) & {
  Const: (<t, x>(t: damlTypes.Serializable<t>, x: damlTypes.Serializable<x>) => damlTypes.Serializable<Observation.Const<t, x>>);
  Observe: (<t, x>(t: damlTypes.Serializable<t>, x: damlTypes.Serializable<x>) => damlTypes.Serializable<Observation.Observe<t, x>>);
};


export namespace Observation {
  type Const<t, x> = {
    value: x;
  };
} //namespace Observation


export namespace Observation {
  type Observe<t, x> = {
    key: string;
  };
} //namespace Observation

