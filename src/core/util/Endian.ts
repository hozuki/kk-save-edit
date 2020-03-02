import OmitFunction from "../../common/types/OmitFunction";

const $isLittleEndian = (() => {
    const buffer = new ArrayBuffer(2);
    new DataView(buffer).setInt16(0, 256, true);

    return new Int16Array(buffer)[0] === 256;
})();

class EndianClass {

    static get isLittleEndian(): boolean {
        return $isLittleEndian;
    }

}

const Endian = EndianClass as OmitFunction<EndianClass>;

export default Endian;
