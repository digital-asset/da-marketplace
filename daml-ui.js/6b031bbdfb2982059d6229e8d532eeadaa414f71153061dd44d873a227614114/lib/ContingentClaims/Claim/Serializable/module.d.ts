// Generated from ContingentClaims/Claim/Serializable.daml
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-use-before-define */
import * as jtv from '@mojotech/json-type-validation';
import * as damlTypes from '@daml/types';
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
import * as damlLedger from '@daml/ledger';

import * as pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7 from '@daml.js/40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7';

import * as ContingentClaims_Observation from '../../../ContingentClaims/Observation/module';

export declare type ClaimF<t, x, a, b> =
  |  { tag: 'ZeroF'; value: {} }
  |  { tag: 'OneF'; value: a }
  |  { tag: 'GiveF'; value: b }
  |  { tag: 'AndF'; value: ClaimF.AndF<t, x, a, b> }
  |  { tag: 'OrF'; value: ClaimF.OrF<t, x, a, b> }
  |  { tag: 'CondF'; value: ClaimF.CondF<t, x, a, b> }
  |  { tag: 'ScaleF'; value: ClaimF.ScaleF<t, x, a, b> }
  |  { tag: 'WhenF'; value: ClaimF.WhenF<t, x, a, b> }
  |  { tag: 'AnytimeF'; value: ClaimF.AnytimeF<t, x, a, b> }
  |  { tag: 'UntilF'; value: ClaimF.UntilF<t, x, a, b> }
;

export declare const ClaimF :
  (<t, x, a, b>(t: damlTypes.Serializable<t>, x: damlTypes.Serializable<x>, a: damlTypes.Serializable<a>, b: damlTypes.Serializable<b>) => damlTypes.Serializable<ClaimF<t, x, a, b>>) & {
  AndF: (<t, x, a, b>(t: damlTypes.Serializable<t>, x: damlTypes.Serializable<x>, a: damlTypes.Serializable<a>, b: damlTypes.Serializable<b>) => damlTypes.Serializable<ClaimF.AndF<t, x, a, b>>);
  OrF: (<t, x, a, b>(t: damlTypes.Serializable<t>, x: damlTypes.Serializable<x>, a: damlTypes.Serializable<a>, b: damlTypes.Serializable<b>) => damlTypes.Serializable<ClaimF.OrF<t, x, a, b>>);
  CondF: (<t, x, a, b>(t: damlTypes.Serializable<t>, x: damlTypes.Serializable<x>, a: damlTypes.Serializable<a>, b: damlTypes.Serializable<b>) => damlTypes.Serializable<ClaimF.CondF<t, x, a, b>>);
  ScaleF: (<t, x, a, b>(t: damlTypes.Serializable<t>, x: damlTypes.Serializable<x>, a: damlTypes.Serializable<a>, b: damlTypes.Serializable<b>) => damlTypes.Serializable<ClaimF.ScaleF<t, x, a, b>>);
  WhenF: (<t, x, a, b>(t: damlTypes.Serializable<t>, x: damlTypes.Serializable<x>, a: damlTypes.Serializable<a>, b: damlTypes.Serializable<b>) => damlTypes.Serializable<ClaimF.WhenF<t, x, a, b>>);
  AnytimeF: (<t, x, a, b>(t: damlTypes.Serializable<t>, x: damlTypes.Serializable<x>, a: damlTypes.Serializable<a>, b: damlTypes.Serializable<b>) => damlTypes.Serializable<ClaimF.AnytimeF<t, x, a, b>>);
  UntilF: (<t, x, a, b>(t: damlTypes.Serializable<t>, x: damlTypes.Serializable<x>, a: damlTypes.Serializable<a>, b: damlTypes.Serializable<b>) => damlTypes.Serializable<ClaimF.UntilF<t, x, a, b>>);
};


export namespace ClaimF {
  type AndF<t, x, a, b> = {
    claims: b[];
  };
} //namespace ClaimF


export namespace ClaimF {
  type OrF<t, x, a, b> = {
    lhs: b;
    rhs: b;
  };
} //namespace ClaimF


export namespace ClaimF {
  type CondF<t, x, a, b> = {
    predicate: Inequality<t, x>;
    success: b;
    failure: b;
  };
} //namespace ClaimF


export namespace ClaimF {
  type ScaleF<t, x, a, b> = {
    k: ContingentClaims_Observation.Observation<t, x>;
    claim: b;
  };
} //namespace ClaimF


export namespace ClaimF {
  type WhenF<t, x, a, b> = {
    predicate: Inequality<t, x>;
    claim: b;
  };
} //namespace ClaimF


export namespace ClaimF {
  type AnytimeF<t, x, a, b> = {
    predicate: Inequality<t, x>;
    claim: b;
  };
} //namespace ClaimF


export namespace ClaimF {
  type UntilF<t, x, a, b> = {
    predicate: Inequality<t, x>;
    claim: b;
  };
} //namespace ClaimF


export declare type Inequality<t, x> =
  |  { tag: 'TimeGte'; value: t }
  |  { tag: 'Lte'; value: pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2<ContingentClaims_Observation.Observation<t, x>, ContingentClaims_Observation.Observation<t, x>> }
;

export declare const Inequality :
  (<t, x>(t: damlTypes.Serializable<t>, x: damlTypes.Serializable<x>) => damlTypes.Serializable<Inequality<t, x>>) & {
};


export declare type Claim<t, x, a> =
  |  { tag: 'Zero'; value: {} }
  |  { tag: 'One'; value: a }
  |  { tag: 'Give'; value: Claim<t, x, a> }
  |  { tag: 'And'; value: Claim.And<t, x, a> }
  |  { tag: 'Or'; value: Claim.Or<t, x, a> }
  |  { tag: 'Cond'; value: Claim.Cond<t, x, a> }
  |  { tag: 'Scale'; value: Claim.Scale<t, x, a> }
  |  { tag: 'When'; value: Claim.When<t, x, a> }
  |  { tag: 'Anytime'; value: Claim.Anytime<t, x, a> }
  |  { tag: 'Until'; value: Claim.Until<t, x, a> }
;

export declare const Claim :
  (<t, x, a>(t: damlTypes.Serializable<t>, x: damlTypes.Serializable<x>, a: damlTypes.Serializable<a>) => damlTypes.Serializable<Claim<t, x, a>>) & {
  And: (<t, x, a>(t: damlTypes.Serializable<t>, x: damlTypes.Serializable<x>, a: damlTypes.Serializable<a>) => damlTypes.Serializable<Claim.And<t, x, a>>);
  Or: (<t, x, a>(t: damlTypes.Serializable<t>, x: damlTypes.Serializable<x>, a: damlTypes.Serializable<a>) => damlTypes.Serializable<Claim.Or<t, x, a>>);
  Cond: (<t, x, a>(t: damlTypes.Serializable<t>, x: damlTypes.Serializable<x>, a: damlTypes.Serializable<a>) => damlTypes.Serializable<Claim.Cond<t, x, a>>);
  Scale: (<t, x, a>(t: damlTypes.Serializable<t>, x: damlTypes.Serializable<x>, a: damlTypes.Serializable<a>) => damlTypes.Serializable<Claim.Scale<t, x, a>>);
  When: (<t, x, a>(t: damlTypes.Serializable<t>, x: damlTypes.Serializable<x>, a: damlTypes.Serializable<a>) => damlTypes.Serializable<Claim.When<t, x, a>>);
  Anytime: (<t, x, a>(t: damlTypes.Serializable<t>, x: damlTypes.Serializable<x>, a: damlTypes.Serializable<a>) => damlTypes.Serializable<Claim.Anytime<t, x, a>>);
  Until: (<t, x, a>(t: damlTypes.Serializable<t>, x: damlTypes.Serializable<x>, a: damlTypes.Serializable<a>) => damlTypes.Serializable<Claim.Until<t, x, a>>);
};


export namespace Claim {
  type And<t, x, a> = {
    claims: Claim<t, x, a>[];
  };
} //namespace Claim


export namespace Claim {
  type Or<t, x, a> = {
    lhs: Claim<t, x, a>;
    rhs: Claim<t, x, a>;
  };
} //namespace Claim


export namespace Claim {
  type Cond<t, x, a> = {
    predicate: Inequality<t, x>;
    success: Claim<t, x, a>;
    failure: Claim<t, x, a>;
  };
} //namespace Claim


export namespace Claim {
  type Scale<t, x, a> = {
    k: ContingentClaims_Observation.Observation<t, x>;
    claim: Claim<t, x, a>;
  };
} //namespace Claim


export namespace Claim {
  type When<t, x, a> = {
    predicate: Inequality<t, x>;
    claim: Claim<t, x, a>;
  };
} //namespace Claim


export namespace Claim {
  type Anytime<t, x, a> = {
    predicate: Inequality<t, x>;
    claim: Claim<t, x, a>;
  };
} //namespace Claim


export namespace Claim {
  type Until<t, x, a> = {
    predicate: Inequality<t, x>;
    claim: Claim<t, x, a>;
  };
} //namespace Claim

