import FreeDict from "../common/FreeDict";
import ObjectHelper from "../common/ObjectHelper";
import ArgumentError from "../common/errors/ArgumentError";
import PropBag from "./PropBag";

export default abstract class SimplePropBag<T> extends PropBag<T> {

    protected constructor(dict: FreeDict<T>) {
        super();
        this._d = dict;
    }

    get(key: string): T {
        this.checkKey(key);

        return this._d[key];
    }

    set(key: string, value: T): void {
        this.checkKey(key);

        this._d[key] = value;
    }

    private checkKey(key: string): void {
        if (!ObjectHelper.hasProp(this._d, key)) {
            throw new ArgumentError(`key '${key}' is not in the dictionary`);
        }
    }

    private readonly _d: FreeDict<T>;

}
