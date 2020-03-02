import ArgumentOutOfRangeError from "../common/errors/ArgumentOutOfRangeError";
import Utf8String from "../core/util/Utf8String";
import IWriteableByteArrayStream from "./IWriteableByteArrayStream";

export abstract class WriteableByteArrayStreamExImpl {

    writeByte(this: IWriteableByteArrayStream, value: number): void {
        const buffer = new Uint8Array(1);
        buffer[0] = value;
        this.write(buffer);
    }

    writeUtf8String(this: IWriteableByteArrayStreamEx, str: string): void {
        const bytes = Utf8String.toBytes(str);
        const length = bytes.length;

        if (length > 0xff) {
            throw new ArgumentOutOfRangeError("string is too long");
        }

        this.writeByte(length);
        this.write(bytes);
    }

    writeUInt16LE(this: IWriteableByteArrayStreamEx, value: number): void {
        writeNumber.call(this, value, 2, DataView.prototype.setUint16, true);
    }

    writeUInt32LE(this: IWriteableByteArrayStreamEx, value: number): void {
        writeNumber.call(this, value, 4, DataView.prototype.setUint32, true);
    }

    writeUInt64LE(this: IWriteableByteArrayStreamEx, value: number): void {
        const buffer = new Uint8Array(8);
        const view = new DataView(buffer.buffer);

        setUint64(view, value, buffer.byteOffset, true);

        this.write(buffer);
    }

    writeUInt32BE(this: IWriteableByteArrayStreamEx, value: number): void {
        writeNumber.call(this, value, 4, DataView.prototype.setUint32, false);
    }

}

function writeNumber(this: IWriteableByteArrayStreamEx, value: number, byteSize: number, fn: (this: DataView, offset: number, value: number, isLittleEndian?: boolean) => void, isLittleEndian: boolean): void {
    const buffer = new Uint8Array(byteSize);
    const view = new DataView(buffer.buffer);

    fn.call(view, buffer.byteOffset, value, isLittleEndian);

    this.write(buffer);
}

// https://github.com/pocka/bitwise64/blob/master/index.js#L13
const ZEROS = "0000000000000000000000000000000000000000000000000000000000000000";

function decomposeUInt64(value: number): { hi: number; lo: number } {
    if (!Number.isSafeInteger(value)) {
        console.warn(value, `exceeds ${nameof(Number.MAX_SAFE_INTEGER)}. Precision may be lost.`);
    }

    const bitString = (`${ZEROS}${value.toString(2)}`).slice(-64);

    return {
        hi: parseInt(bitString.slice(0, 32), 2),
        lo: parseInt(bitString.slice(-32), 2)
    };
}

function setUint64(dataView: DataView, value: number, byteOffset: number, littleEndian: boolean): void {
    const d = decomposeUInt64(value);

    let left: number;
    let right: number;

    if (littleEndian) {
        left = d.lo;
        right = d.hi;
    } else {
        left = d.hi;
        right = d.lo;
    }

    dataView.setUint32(0, left, littleEndian);
    dataView.setUint32(4, right, littleEndian);
}

export interface IWriteableByteArrayStreamEx extends IWriteableByteArrayStream, WriteableByteArrayStreamExImpl {

}
