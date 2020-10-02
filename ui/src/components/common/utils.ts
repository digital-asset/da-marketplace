const vowels = ['a', 'e', 'i', 'o', 'u'];

export const indefiniteArticle = (word: string): string => {
    return vowels.includes(word[0].toLowerCase()) ? `an ${word}` : `a ${word}`;
}

export function countDecimals(value: number) {
    if (Math.floor(value) !== value)
        return value.toString().split(".")[1].length || 0;
    return 0;
}
