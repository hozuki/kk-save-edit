import OmitFunction from "../../common/types/OmitFunction";

const $encoder = new TextEncoder();
const $decoder = new TextDecoder();

class Utf8StringClass {

    static fromBytes(bytes: Uint8Array): string {
        return $decoder.decode(bytes);
    }

    static toBytes(str: string): Uint8Array;
    static toBytes(str: string, buffer: Uint8Array): void;
    static toBytes(str: string, buffer?: Uint8Array): Uint8Array | void {
        if (buffer) {
            $encoder.encodeInto(str, buffer);
        } else {
            return $encoder.encode(str);
        }
    }

}

const Utf8String = Utf8StringClass as OmitFunction<typeof Utf8StringClass>;

export default Utf8String;
