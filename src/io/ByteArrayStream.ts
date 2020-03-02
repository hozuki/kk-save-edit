import ArgumentOutOfRangeError from "../common/errors/ArgumentOutOfRangeError";
import InvalidOperationError from "../common/errors/InvalidOperationError";
import IByteArrayStream from "./IByteArrayStream";
import SeekOrigin from "./SeekOrigin";
import {stream$toArray} from "./private/RWHelper";

export default abstract class ByteArrayStream implements IByteArrayStream {

    protected constructor(array: Uint8Array) {
        this._array = array;
        this._position = 0;
    }

    seek(value: number, origin: SeekOrigin): void {
        switch (origin) {
            case SeekOrigin.Begin:
                this.position = value;
                break;
            case SeekOrigin.Current:
                this.position += value;
                break;
            case SeekOrigin.End:
                this.position = this.length - 1 - value;
                break;
            default:
                throw new ArgumentOutOfRangeError(nameof(origin));
        }
    }

    toArray(): Uint8Array {
        return stream$toArray.call(this);
    }

    get length(): number {
        return this.array.length;
    }

    set length(v: number) {
        throw new InvalidOperationError();
    }

    get position(): number {
        return this._position;
    }

    set position(v: number) {
        v |= 0;

        // Allows v == this.length (end of stream)
        if (v < 0 || v > this.length) {
            // eslint-disable-next-line no-undef
            throw new ArgumentOutOfRangeError(nameof(v));
        }

        this._position = v;
    }

    protected get array(): Uint8Array {
        return this._array;
    }

    protected set array(v: Uint8Array) {
        this._array = v;
    }

    private _array: Uint8Array;
    private _position: number;

}
