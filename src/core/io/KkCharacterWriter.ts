import * as msgpack from "@msgpack/msgpack";
import FreeDict from "../../common/FreeDict";
import Guard from "../../common/Guard";
import ObjectHelper from "../../common/ObjectHelper";
import ArgumentOutOfRangeError from "../../common/errors/ArgumentOutOfRangeError";
import {IWriteableByteArrayStreamEx} from "../../io/IWriteableByteArrayStreamEx";
import WriteOnlyByteArrayStream from "../../io/WriteOnlyByteArrayStream";
import Gender from "../Gender";
import KkCharacter from "../internal/KkCharacter";
import KnownEntryName from "../internal/known/KnownEntryName";
import KnownPercentageKey from "../internal/known/KnownPercentageKey";
import Enumerable from "../util/Enumerable";

const DEFAULT_MSGPACK_ENCODE_OPTIONS: msgpack.EncodeOptions = {
    // FIXME:
    //   Looks like the genuine game does not set this flag,
    //   so they are potentially using float64...
    //   However, the deserialization library for .NET does not
    //   allow implicit conversion from float64 to float32.
    //   So, dead code.
    /* forceFloat32: true */
};

export default class KkCharacterWriter {

    write(stream: IWriteableByteArrayStreamEx, c: KkCharacter): void {
        stream.writeUInt32LE(c.productNumber!);
        stream.writeUtf8String(c.marker!);
        stream.writeUtf8String(c.unknown1!);

        stream.writeUInt32LE(c.photo!.length);
        stream.write(c.photo!);

        {
            const infoList = c.infoList!;
            const infoData: FreeDict<Uint8Array> = Object.create(null);

            infoData[KnownEntryName.Custom] = packCustomizationPart(c);
            infoData[KnownEntryName.Coordinate] = packCoordinatePart(c);
            infoData[KnownEntryName.Parameter] = packParametersPart(c);
            infoData[KnownEntryName.Status] = packStatusPart(c);

            if (c.kkex) {
                infoData[KnownEntryName.Extra] = packExtraPart(c);
            }

            const infoOrder = infoList.lstInfo.map(entry => entry.name);
            let position = 0;

            const memory = WriteOnlyByteArrayStream.new();

            for (const [i, key] of Enumerable.enumerate(infoOrder)) {
                const entry = infoList.lstInfo[i];

                entry.pos = position;

                const data = infoData[key];

                entry.size = data.length;

                memory.write(data);

                position += data.length;
            }

            const charaValues = memory.toArray();
            const infoListPacked = msgpack.encode(infoList, DEFAULT_MSGPACK_ENCODE_OPTIONS);

            stream.writeUInt32LE(infoListPacked.length);
            stream.write(infoListPacked);

            stream.writeUInt64LE(charaValues.length);
            stream.write(charaValues);
        }

        Guard.defined(c.extraData) && stream.write(c.extraData);
        Guard.defined(c.unknown2) && stream.write(c.unknown2);
        Guard.defined(c.unknownMark) && stream.write(c.unknownMark);
        Guard.defined(c.dearName) && stream.writeUtf8String(c.dearName);
        Guard.defined(c.feeling) && stream.writeUInt32LE(c.feeling);
        Guard.defined(c.loveGauge) && stream.writeUInt32LE(c.loveGauge);
        Guard.defined(c.hCount) && stream.writeUInt32LE(c.hCount);
        Guard.defined(c.isClubMember) && stream.writeByte(c.isClubMember ? 1 : 0);
        Guard.defined(c.isLover) && stream.writeByte(c.isLover ? 1 : 0);
        Guard.defined(c.isAngry) && stream.writeByte(c.isAngry ? 1 : 0);
        Guard.defined(c.unknown3) && stream.write(c.unknown3);

        if (Guard.defined(c.intelligence2)) {
            stream.writeUInt32LE(c.intelligence2);
        } else {
            let intel: number;

            if (Guard.defined(c.parameters)) {
                intel = c.parameters["intelligence"] || 0;
            } else {
                intel = 0;
            }

            stream.writeUInt32LE(intel);
        }

        {
            const bstr = new Uint8Array(4);

            switch (c.gender) {
                case Gender.Male:
                    new DataView(bstr.buffer).setUint32(bstr.byteOffset, c.strength || 0, true);
                    break;
                case Gender.Female:
                    bstr[0] = (c.hasDate || false) ? 1 : 0;
                    break;
                default:
                    throw new ArgumentOutOfRangeError(nameof.full(c.gender));
            }

            stream.write(bstr);
        }

        Guard.defined(c.ero) && stream.writeUInt32LE(c.ero);

        if (Guard.defined(c.percentages)) {
            const perc = c.percentages;

            Guard.defined(c.unknown6) && stream.write(c.unknown6);
            stream.write(perc[KnownPercentageKey.Mune]);
            stream.write(perc[KnownPercentageKey.Kokan]);
            stream.write(perc[KnownPercentageKey.Anal]);
            stream.write(perc[KnownPercentageKey.Siri]);
            stream.write(perc[KnownPercentageKey.Tikubi]);
            Guard.defined(c.unknown7) && stream.write(c.unknown7);
            stream.write(perc[KnownPercentageKey.KokanPiston]);
            stream.write(perc[KnownPercentageKey.AnalPiston]);
        }

        writeAdditionalData(stream, c);
    }

}

function packCustomizationPart(c: KkCharacter): Uint8Array {
    const memory = WriteOnlyByteArrayStream.new();

    let packed = msgpack.encode(c.customization!.face!, DEFAULT_MSGPACK_ENCODE_OPTIONS);
    memory.writeUInt32LE(packed.length);
    memory.write(packed);

    packed = msgpack.encode(c.customization!.body!, DEFAULT_MSGPACK_ENCODE_OPTIONS);
    memory.writeUInt32LE(packed.length);
    memory.write(packed);

    packed = msgpack.encode(c.customization!.hair!, DEFAULT_MSGPACK_ENCODE_OPTIONS);
    memory.writeUInt32LE(packed.length);
    memory.write(packed);

    return memory.toArray();
}

function packCoordinatePart(c: KkCharacter): Uint8Array {
    const coords = c.coordinates!;
    const o = new Array<Uint8Array>(coords.length);

    for (const [i, coord] of Enumerable.enumerate(coords)) {
        const memory = WriteOnlyByteArrayStream.new();

        let packed = msgpack.encode(coord.clothes, DEFAULT_MSGPACK_ENCODE_OPTIONS);
        memory.writeUInt32LE(packed.length);
        memory.write(packed);

        packed = msgpack.encode(coord.accessory, DEFAULT_MSGPACK_ENCODE_OPTIONS);
        memory.writeUInt32LE(packed.length);
        memory.write(packed);

        memory.writeByte(coord.makeupEnabled ? 1 : 0);

        packed = msgpack.encode(coord.makeup, DEFAULT_MSGPACK_ENCODE_OPTIONS);
        memory.writeUInt32LE(packed.length);
        memory.write(packed);

        o[i] = memory.toArray();
    }

    const result = msgpack.encode(o, DEFAULT_MSGPACK_ENCODE_OPTIONS);

    return result;
}

function packParametersPart(c: KkCharacter): Uint8Array {
    return msgpack.encode(c.parameters!, DEFAULT_MSGPACK_ENCODE_OPTIONS);
}

function packStatusPart(c: KkCharacter): Uint8Array {
    return msgpack.encode(c.status!, DEFAULT_MSGPACK_ENCODE_OPTIONS);
}

function packExtraPart(c: KkCharacter): Uint8Array {
    return msgpack.encode(c.kkex!, DEFAULT_MSGPACK_ENCODE_OPTIONS);
}

function writeAdditionalData(stream: IWriteableByteArrayStreamEx, c: KkCharacter): void {
    Guard.defined(c.beforeAdditional) && stream.write(c.beforeAdditional);

    if (Guard.defined(c.additionalKeys) && Guard.defined(c.additionalValueMap)) {
        for (const key of c.additionalKeys) {
            stream.writeUtf8String(key);
            stream.writeUInt32LE(c.additionalValueMap[key]);
        }
    }

    if (Guard.defined(c.percentages) && ObjectHelper.hasProp(c.percentages, KnownPercentageKey.Houshi)) {
        stream.write(c.percentages[KnownPercentageKey.Houshi]);
    }

    if (c.gender === Gender.Female) {
        if (c.masterVersion! >= "0.0.7") {
            Guard.defined(c.eventAfterDay) && stream.writeUInt32LE(c.eventAfterDay);
            Guard.defined(c.isFirstGirlfriend) && stream.writeByte(c.isFirstGirlfriend ? 1 : 0);
        }

        if (c.masterVersion! >= "1.0.1") {
            Guard.defined(c.intimacy) && stream.writeUInt32LE(c.intimacy);
        }
    }

    Guard.defined(c.afterAdditional) && stream.write(c.afterAdditional);
}
