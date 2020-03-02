type OmitFunction<T> = Omit<T, keyof Function>;

export default OmitFunction;
