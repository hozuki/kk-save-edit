import SeekOrigin from "./SeekOrigin";

export default interface IByteArrayStream {

    seek(value: number, origin: SeekOrigin): void;

    toArray(): Uint8Array;

    length: number;

    position: number;

}
