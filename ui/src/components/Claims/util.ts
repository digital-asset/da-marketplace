import {
  Claim,
  Inequality,
} from '@daml.js/da-marketplace/lib/ContingentClaims/Claim/Serializable/module';
import { Observation } from '@daml.js/da-marketplace/lib/ContingentClaims/Observation/module';
import { Id } from '@daml.js/da-marketplace/lib/DA/Finance/Types/module';
import { Date, Decimal } from '@daml/types';

const transformObservation = (obs: Observation<Date, Decimal>, linkText: string): any => {
  console.log(obs);
  switch (obs.tag) {
    case 'Add': //TODO: collapse a + (-b) into a - b
      const left4 = transformObservation(obs.value._1, 'left');
      const right4 = transformObservation(obs.value._2, 'right');
      return {
        ...obs,
        linkText,
        type: 'Observation',
        text: '+',
        collapsedText: `${left4.text} + ${right4.text}`,
        children: [left4, right4],
      };
    case 'Neg':
      const left5 = transformObservation(obs.value, 'left');
      return {
        ...obs,
        linkText,
        type: 'Observation',
        text: '-',
        collapsedText: `-${left5}`,
        children: [left5],
      };
    case 'Mul':
      const left6 = transformObservation(obs.value._1, 'left');
      const right6 = transformObservation(obs.value._2, 'right');
      return {
        ...obs,
        linkText,
        type: 'Observation',
        text: '*',
        collapsedText: `${left6.text} * ${right6.text}`,
        children: [left6, right6],
      };
    case 'Div':
      const left7 = transformObservation(obs.value._1, 'left');
      const right7 = transformObservation(obs.value._2, 'right');
      return {
        ...obs,
        linkText,
        type: 'Observation',
        text: '/',
        collapsedText: `${left7.text} / ${right7.text}`,
        children: [left7, right7],
      };
    case 'Const':
      return { ...obs, linkText, type: 'Observation', text: obs.value.value, children: null };
    case 'Observe':
      return { ...obs, linkText, type: 'Observation', text: `Price(${obs.value.key})`, children: null };
  }
};

export const transformInequality = (
  inequality: Inequality<Date, Decimal>,
  linkText: string
): any => {
  switch (inequality.tag) {
    case 'TimeGte':
      return {
        ...inequality,
        linkText,
        type: 'Observation',
        text: `t >= ${inequality.value}`,
        collapsedText: `t >= ${inequality.value}`,
        children: null,
      };
    case 'Lte':
      const left2 = transformObservation(inequality.value._1, 'left');
      const right2 = transformObservation(inequality.value._2, 'right');
      return {
        ...inequality,
        linkText,
        type: 'Observation',
        text: '<=',
        collapsedText: `${left2.text} <= ${right2.text}`,
        children: [left2, right2],
      };
  }
};

export const transformClaim = (claim: Claim<Date, Decimal, Id>, linkText: string): any => {
  switch (claim.tag) {
    case 'When':
      return {
        ...claim,
        linkText,
        type: 'Claim',
        children: [
          transformInequality(claim.value.predicate, 'condition'),
          transformClaim(claim.value.claim, 'then'),
        ],
      };
    case 'Scale':
      return {
        ...claim,
        linkText,
        type: 'Claim',
        children: [
          transformObservation(claim.value.k, 'factor'),
          transformClaim(claim.value.claim, 'then'),
        ],
      };
    case 'Give':
      return {
        ...claim,
        linkText,
        type: 'Claim',
        children: [transformClaim(claim.value, 'claim')],
      };
    case 'Or':
      return {
        ...claim,
        linkText,
        type: 'Claim',
        children: [
          transformClaim(claim.value.lhs, 'left'),
          transformClaim(claim.value.rhs, 'right'),
        ],
      };
    case 'And':
      return {
        ...claim,
        linkText,
        type: 'Claim',
        children: claim.value.claims.reduce<any[]>((cs, c) => {
          cs.push(transformClaim(c, 'foo'));
          return cs;
        }, []),
      };
    case 'Cond':
      return {
        ...claim,
        linkText,
        type: 'Claim',
        children: [
          transformInequality(claim.value.predicate, 'if'),
          transformClaim(claim.value.success, 'then'),
          transformClaim(claim.value.failure, 'else'),
        ],
      };
    case 'Anytime':
      return {
        ...claim,
        linkText,
        type: 'Claim',
        children: [
          transformInequality(claim.value.predicate, 'condition'),
          transformClaim(claim.value.claim, 'then'),
        ],
      };
    case 'Until':
      return {
        ...claim,
        linkText,
        type: 'Claim',
        children: [
          transformInequality(claim.value.predicate, 'condition'),
          transformClaim(claim.value.claim, 'then'),
        ],
      };
    case 'Zero':
      return { ...claim, linkText, type: 'Claim', children: null };
    case 'One':
      return { ...claim, linkText, type: 'Claim', text: '1 ' + claim.value.label, children: null };
  }
};
