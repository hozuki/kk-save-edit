import IByteArrayStream from "./IByteArrayStream";

export default interface IReadableByteArrayStream extends IByteArrayStream {

    read(buffer: Uint8Array): number;

    read(buffer: Uint8Array, offset: number, count: number): number;

}
