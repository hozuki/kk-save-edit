// https://stackoverflow.com/a/59906630

type ArrayLengthMutationKeys = 'splice' | 'push' | 'pop' | 'shift' | 'unshift';
type FixedLengthArray<T, L extends number, TObj = [T, ...T[]]> =
    Pick<TObj, Exclude<keyof TObj, ArrayLengthMutationKeys>>
    & {
    [I: number]: T;
    [Symbol.iterator](): IterableIterator<T>;
    readonly length: L;
};

export default FixedLengthArray;
