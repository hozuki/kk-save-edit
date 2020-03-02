import PrototypeMixins from "../common/decorators/PrototypeMixins";
import InvalidOperationError from "../common/errors/InvalidOperationError";
import ByteArrayStream from "./ByteArrayStream";
import IReadableByteArrayStream from "./IReadableByteArrayStream";
import {IReadableByteArrayStreamEx, ReadableByteArrayStreamExImpl} from "./IReadableByteArrayStreamEx";
import IWriteableByteArrayStream from "./IWriteableByteArrayStream";
import {IWriteableByteArrayStreamEx, WriteableByteArrayStreamExImpl} from "./IWriteableByteArrayStreamEx";
import ReadOnlyByteArrayStream from "./ReadOnlyByteArrayStream";
import WriteOnlyByteArrayStream from "./WriteOnlyByteArrayStream";
import {stream$ensureCapacity, stream$read, stream$setLength, stream$write} from "./private/RWHelper";

type RWArrayInterface =
    IReadableByteArrayStream & IReadableByteArrayStreamEx & IWriteableByteArrayStream & IWriteableByteArrayStreamEx;

const DEFAULT_ARRAY_LENGTH = 32;

@PrototypeMixins(ReadOnlyByteArrayStream, WriteOnlyByteArrayStream, ReadableByteArrayStreamExImpl, WriteableByteArrayStreamExImpl)
class ReadWriteByteArrayStream extends ByteArrayStream implements IReadableByteArrayStream, IWriteableByteArrayStream {

    private constructor(array: Uint8Array, length: number, canWrite: boolean, extensible: boolean) {
        super(array);
        this._length = length;
        this.canWrite = canWrite;
        this._extensible = extensible;
    }

    static new(): RWArrayInterface {
        return new ReadWriteByteArrayStream(new Uint8Array(DEFAULT_ARRAY_LENGTH), 0, true, true);
    }

    static fromArray(array: Uint8Array, writeable: boolean = true, extensible: boolean = true): RWArrayInterface {
        return new ReadWriteByteArrayStream(array, array.length, writeable, extensible);
    }

    read(buffer: Uint8Array): number;
    read(buffer: Uint8Array, offset: number, count: number): number;
    read(buffer: Uint8Array, offset: number = 0, count: number = buffer.length): number {
        return stream$read.call(this as unknown as ReadOnlyByteArrayStream, buffer, offset, count);
    }

    write(buffer: Uint8Array): void;
    write(buffer: Uint8Array, offset: number, count: number): void;
    write(buffer: Uint8Array, offset: number = 0, count: number = buffer.length): void {
        if (!this.canWrite) {
            throw new InvalidOperationError("this stream is read-only");
        }

        stream$write.call(this as unknown as WriteOnlyByteArrayStream, buffer, offset, count);
    }

    get capacity(): number {
        return this.array.length;
    }

    get length(): number {
        return this._length;
    }

    set length(v: number) {
        stream$setLength.call(this as unknown as WriteOnlyByteArrayStream, v);
    }

    readonly canWrite: boolean;

    // Must sync visibility and signature with its WriteOnly counterpart.
    protected ensureCapacity(value: number): void {
        stream$ensureCapacity.call(this as unknown as WriteOnlyByteArrayStream, value);
    }

    // Must sync visibility and signature with its WriteOnly counterpart.
    protected _length: number;
    protected _extensible: boolean;

}

interface ReadWriteByteArrayStream extends IReadableByteArrayStreamEx, IWriteableByteArrayStreamEx {

}

export default ReadWriteByteArrayStream;
