import PropKeyValue from "./PropKeyValue";

export default abstract class PropBag<T> {

    protected constructor() {
        this._props = [];
    }

    getProps(): ReadonlyArray<PropKeyValue<T>> {
        return this._props;
    }

    abstract get(key: string): T;

    abstract set(key: string, value: T): void;

    protected addKV(key: string): PropKeyValue<T> {
        const prop = new PropKeyValue<T>(this, key);

        this._props.push(prop);

        return prop;
    }

    private readonly _props: PropKeyValue<T>[];

}
