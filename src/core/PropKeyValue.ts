import PropBag from "./PropBag";

export default class PropKeyValue<T> {

    constructor(bag: PropBag<T>, key: string) {
        this._bag = bag;
        this.key = key;
    }

    get value(): T {
        return this._bag.get(this.key);
    }

    set value(v: T) {
        this._bag.set(this.key, v);
    }

    readonly key: string;

    private readonly _bag: PropBag<T>;

}
