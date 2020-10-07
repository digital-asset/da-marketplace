import { DepositInfo } from "./damlTypes";

const vowels = ['a', 'e', 'i', 'o', 'u'];

export const indefiniteArticle = (word: string): string => {
    return vowels.includes(word[0].toLowerCase()) ? `an ${word}` : `a ${word}`;
}

type StringToDepositInfoArray = {
    [key: string]: DepositInfo[];
}

export const groupDeposits = (deposits: DepositInfo[]): StringToDepositInfoArray => {
    return deposits.reduce((group, deposit) => {
        const label = deposit.contractData.asset.id.label;
        const existingValue = group[label] || [];

        return { ...group, [label]: [...existingValue, deposit] };
    }, {} as StringToDepositInfoArray);
}

const sumDepositArray = (deposits: DepositInfo[]): number =>
    deposits.reduce((sum, val) => sum + Number(val.contractData.asset.quantity), 0);

type StringToNumber = {
    [key: string]: number;
}

export const sumDeposits = (deposits: DepositInfo[]): StringToNumber => {
    const depositGroup = groupDeposits(deposits);

    return Object
        .entries(depositGroup)
        .reduce((acc, [label, deposits]) => ({
            ...acc,
            [label]: sumDepositArray(deposits)
        }), {} as StringToNumber)
}

export const depositSummary = (deposits: DepositInfo[]): string => {
    const depositSums = sumDeposits(deposits);

    return Object
        .entries(depositSums)
        .map(([label, total]) => `${label}: ${total}`)
        .join(", ");
}
