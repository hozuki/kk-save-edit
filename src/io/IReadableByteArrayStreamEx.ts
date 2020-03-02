import Guard from "../common/Guard";
import Utf8String from "../core/util/Utf8String";
import IReadableByteArrayStream from "./IReadableByteArrayStream";

export abstract class ReadableByteArrayStreamExImpl {

    readBytes(this: IReadableByteArrayStream, count: number): Uint8Array {
        const toRead = Math.min(this.length - this.position, count);
        const result = new Uint8Array(toRead);

        if (toRead > 0) {
            const read = this.read(result, 0, toRead);
            Guard.assert(read === toRead);
        }

        return result;
    }

    readRest(this: IReadableByteArrayStreamEx): Uint8Array {
        const remained = this.length - this.position;

        return this.readBytes(remained);
    }

    readByte(this: IReadableByteArrayStream): number {
        const buffer = new Uint8Array(1);
        const read = this.read(buffer);
        Guard.assert(read === 1);

        return buffer[0];
    }

    readUtf8String(this: IReadableByteArrayStreamEx): string {
        const length = this.readByte();

        if (length === 0) {
            return "";
        }

        const buffer = new Uint8Array(length);
        const read = this.read(buffer);
        Guard.assert(read === length);

        const str = Utf8String.fromBytes(buffer);

        return str;
    }

    readUInt16LE(this: IReadableByteArrayStreamEx): number {
        return readNumber.call(this, 2, DataView.prototype.getUint16, true);
    }

    readUInt32LE(this: IReadableByteArrayStreamEx): number {
        return readNumber.call(this, 4, DataView.prototype.getUint32, true);
    }

    readUInt64LE(this: IReadableByteArrayStreamEx): number {
        const buffer = this.readBytes(8);
        Guard.assert(buffer.length === 8);
        const view = new DataView(buffer.buffer);

        return getUint64(view, buffer.byteOffset, true);
    }

    readUInt32BE(this: IReadableByteArrayStreamEx): number {
        return readNumber.call(this, 4, DataView.prototype.getUint32, false);
    }

}

function readNumber(this: IReadableByteArrayStreamEx, byteSize: number, fn: (this: DataView, offset: number, isLittleEndian?: boolean) => number, isLittleEndian: boolean): number {
    const buffer = this.readBytes(byteSize);
    Guard.assert(buffer.length === byteSize);
    const view = new DataView(buffer.buffer);

    return fn.call(view, buffer.byteOffset, isLittleEndian);
}

const UINT32_MAX = 2 ** 32;

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView
function getUint64(dataView: DataView, byteOffset: number, littleEndian: boolean): number {
    const left = dataView.getUint32(byteOffset, littleEndian);
    const right = dataView.getUint32(byteOffset + 4, littleEndian);

    const combined = littleEndian ? left + UINT32_MAX * right : UINT32_MAX * left + right;

    if (!Number.isSafeInteger(combined)) {
        console.warn(combined, `exceeds ${nameof(Number.MAX_SAFE_INTEGER)}. Precision may be lost.`);
    }

    return combined;
}

export interface IReadableByteArrayStreamEx extends IReadableByteArrayStream, ReadableByteArrayStreamExImpl {

}
