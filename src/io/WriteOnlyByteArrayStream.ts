import PrototypeMixins from "../common/decorators/PrototypeMixins";
import ByteArrayStream from "./ByteArrayStream";
import IWriteableByteArrayStream from "./IWriteableByteArrayStream";
import {IWriteableByteArrayStreamEx, WriteableByteArrayStreamExImpl} from "./IWriteableByteArrayStreamEx";
import {stream$ensureCapacity, stream$setLength, stream$write} from "./private/RWHelper";

const DEFAULT_ARRAY_LENGTH = 32;

@PrototypeMixins(WriteableByteArrayStreamExImpl)
class WriteOnlyByteArrayStream extends ByteArrayStream implements IWriteableByteArrayStream {

    private constructor(array: Uint8Array, length: number, extensible: boolean) {
        super(array);
        this._length = length;
        this._extensible = extensible;
    }

    static new(): IWriteableByteArrayStreamEx {
        return new WriteOnlyByteArrayStream(new Uint8Array(DEFAULT_ARRAY_LENGTH), 0, true) as unknown as IWriteableByteArrayStreamEx;
    }

    static fromArray(array: Uint8Array, extensible: boolean = true): IWriteableByteArrayStreamEx {
        return new WriteOnlyByteArrayStream(array, array.length, extensible) as unknown as IWriteableByteArrayStreamEx;
    }

    write(buffer: Uint8Array): void;
    write(buffer: Uint8Array, offset: number, count: number): void;
    write(buffer: Uint8Array, offset: number = 0, count: number = buffer.length): void {
        stream$write.call(this, buffer, offset, count);
    }

    get capacity(): number {
        return this.array.length;
    }

    get length(): number {
        return this._length;
    }

    set length(v: number) {
        stream$setLength.call(this, v);
    }

    // Must be 'protected' (not private) to be called from extension 'this' function.
    protected ensureCapacity(value: number): void {
        stream$ensureCapacity.call(this, value);
    }

    // Again, must not be private.
    protected _length: number;

    protected _extensible: boolean;

}

interface WriteOnlyByteArrayStream extends IWriteableByteArrayStreamEx {

}

export default WriteOnlyByteArrayStream;
