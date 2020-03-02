import ApplicationError from "../../common/errors/ApplicationError";
import {IReadableByteArrayStreamEx} from "../../io/IReadableByteArrayStreamEx";
import ReadWriteByteArrayStream from "../../io/ReadWriteByteArrayStream";
import KkSaveData from "../internal/KkSaveData";
import ByteArray from "../util/ByteArray";
import Enumerable from "../util/Enumerable";
import KkCharacterReader from "./KkCharacterReader";

const KkCharaHeader = ByteArray.fromBinaryLiteral("\x64\x00\x00\x00\x12\xe3\x80\x90KoiKatuChara\xe3\x80\x91");
const KkpCharaHeader = ByteArray.fromBinaryLiteral("\x64\x00\x00\x00\x14\xe3\x80\x90KoiKatuCharaSP\xe3\x80\x91");

export default class KkSaveDataReader {

    read(stream: IReadableByteArrayStreamEx): KkSaveData {
        const r = new KkSaveData();

        r.version = stream.readUtf8String();
        r.schoolName = stream.readUtf8String();

        r.unknown1 = stream.readBytes(17);

        r.characters = [];

        const charaDataLump = stream.readRest();
        let charaHeader: Uint8Array;

        do {
            let index = ByteArray.find(charaDataLump, KkCharaHeader);

            if (index === 0) {
                charaHeader = KkCharaHeader;
                break;
            }

            index = ByteArray.find(charaDataLump, KkpCharaHeader);

            if (index === 0) {
                charaHeader = KkpCharaHeader;
                break;
            }

            throw new ApplicationError("cannot find known character header");
        } while (false);

        // TODO: For this implementation, it is not allowed to mix KK and KKP chara cards. But it is easy to rewrite.
        const charaParts = ByteArray.split(charaDataLump, charaHeader);
        const characterReader = new KkCharacterReader();

        for (const [counter, part] of Enumerable.enumerate(charaParts)) {
            const memory = ReadWriteByteArrayStream.new();
            memory.write(charaHeader);
            memory.write(part);
            memory.position = 0;

            const character = characterReader.read(memory, false, counter === 0, r.version);

            r.characters.push(character);
        }

        return r;
    }

}
