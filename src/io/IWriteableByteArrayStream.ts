import IByteArrayStream from "./IByteArrayStream";

export default interface IWriteableByteArrayStream extends IByteArrayStream {

    write(buffer: Uint8Array): void;

    write(buffer: Uint8Array, offset: number, count: number): void;

    length: number;

    readonly capacity: number;

}
