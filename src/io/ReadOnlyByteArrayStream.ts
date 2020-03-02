import PrototypeMixins from "../common/decorators/PrototypeMixins";
import ByteArrayStream from "./ByteArrayStream";
import IReadableByteArrayStream from "./IReadableByteArrayStream";
import {IReadableByteArrayStreamEx, ReadableByteArrayStreamExImpl} from "./IReadableByteArrayStreamEx";
import {stream$read} from "./private/RWHelper";

@PrototypeMixins(ReadableByteArrayStreamExImpl)
class ReadOnlyByteArrayStream extends ByteArrayStream implements IReadableByteArrayStream {

    private constructor(array: Uint8Array) {
        super(array);
    }

    static fromArray(array: Uint8Array): IReadableByteArrayStreamEx {
        return new ReadOnlyByteArrayStream(array) as unknown as IReadableByteArrayStreamEx;
    }

    read(buffer: Uint8Array): number;
    read(buffer: Uint8Array, offset: number, count: number): number;
    read(buffer: Uint8Array, offset: number = 0, count: number = buffer.length): number {
        return stream$read.call(this, buffer, offset, count);
    }

}

interface ReadOnlyByteArrayStream extends IReadableByteArrayStreamEx {

}

export default ReadOnlyByteArrayStream;
