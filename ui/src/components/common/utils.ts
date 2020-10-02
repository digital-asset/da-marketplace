const vowels = ['a', 'e', 'i', 'o', 'u'];

export const indefiniteArticle = (word: string): string => {
    return vowels.includes(word[0].toLowerCase()) ? `an ${word}` : `a ${word}`;
}
