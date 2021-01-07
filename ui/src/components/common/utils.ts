import { DepositInfo } from './damlTypes'


const vowels = ['a', 'e', 'i', 'o', 'u'];

export const indefiniteArticle = (word: string): string => {
    return vowels.includes(word[0].toLowerCase()) ? `an ${word}` : `a ${word}`;
}

export type StringKeyedObject<T> = {
    [key: string]: T
}

export const groupDeposits = (deposits: DepositInfo[]): StringKeyedObject<DepositInfo[]> => {
    return deposits.reduce((group, deposit) => {
        const label = deposit.contractData.account.provider;
        const existingValue = group[label] || [];

        return { ...group, [label]: [...existingValue, deposit] };
    }, {} as StringKeyedObject<DepositInfo[]>);
}

const sumDepositArray = (deposits: DepositInfo[]): number =>
    deposits.reduce((sum, val) => sum + Number(val.contractData.asset.quantity), 0);

export const sumDeposits = (deposits: DepositInfo[]): StringKeyedObject<number> => {
    const depositGroup = groupDeposits(deposits);

    return Object
        .entries(depositGroup)
        .reduce((acc, [label, deposits]) => ({
            ...acc,
            [label]: sumDepositArray(deposits)
        }), {} as StringKeyedObject<number>)
}

export const depositSummary = (deposits: DepositInfo[]): string => {
    const depositSums = sumDeposits(deposits);

    return Object
        .entries(depositSums)
        .map(([label, total]) => `${label}: ${total}`)
        .join(", ");
}

export function countDecimals(value: number) {
    if (Math.floor(value) !== value)
        return value.toString().split(".")[1].length || 0;
    return 0;
}

type PreciseInputSteps = {
    step: string;
    placeholder: string;
}

export function preciseInputSteps(precision: number): PreciseInputSteps {
    const step = precision > 0
      ? `0.${"0".repeat(precision-1)}1`
      : '1';

    const placeholder = precision > 0
      ? `0.${"0".repeat(precision)}`
      : '0';

    return { step, placeholder };
}
