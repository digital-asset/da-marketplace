type DamlTuple<T> = {
    [key: string]: T;
}

function cmpUnderscoredKeys(keyA: string, keyB: string): number {
    const numA = Number(keyA.slice(1));
    const numB = Number(keyB.slice(1));

    if (numA > numB) {
        return 1;
    }
    if (numA < numB) {
        return -1;
    }
    return 0;
}

export function wrapDamlTuple<T>(items: T[]): DamlTuple<T> {
    let tuple: DamlTuple<T> = {};
    items.forEach((item, index) => tuple[`_${index+1}`] = item);

    return tuple;
}

export function unwrapDamlTuple<T>(tuple: DamlTuple<T>): T[] {
    // Make sure we don't run into sorting weirdness if there's a tuple with `_1` and `_10` or similar
    const sortedKeys = Object.keys(tuple).sort(cmpUnderscoredKeys);
    return sortedKeys.map(key => tuple[key]);
}
