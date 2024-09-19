import * as R from 'ramda';

export const getRandomItem = <T>(list: T[]) => {
    const randomIndex = Math.floor(Math.random() * R.length(list));
    return R.nth(randomIndex, list);
};

export function prettyPrintArray<T>(arr: T[]) {
    return arr.length > 1
        ? arr
            .map((a) => (typeof a === 'object' ? JSON.stringify(a) : a))
            .slice(0, arr.length - 1)
            .join(', ') +
        ' and ' +
        arr[arr.length - 1]
        : arr[0];
}