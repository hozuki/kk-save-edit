import * as msgpack from "@msgpack/msgpack";
import FreeDict from "../../common/FreeDict";
import Guard from "../../common/Guard";
import ArgumentOutOfRangeError from "../../common/errors/ArgumentOutOfRangeError";
import {IReadableByteArrayStreamEx} from "../../io/IReadableByteArrayStreamEx";
import ReadOnlyByteArrayStream from "../../io/ReadOnlyByteArrayStream";
import WriteOnlyByteArrayStream from "../../io/WriteOnlyByteArrayStream";
import Gender from "../Gender";
import KkCharacter from "../internal/KkCharacter";
import KnownEntryName from "../internal/known/KnownEntryName";
import KnownPercentageKey from "../internal/known/KnownPercentageKey";
import Coordinate from "../internal/packed/Coordinate";
import InfoList from "../internal/packed/InfoList";
import InfoListEntry from "../internal/packed/InfoListEntry";
import ArrayHelper from "../util/ArrayHelper";
import ByteArray from "../util/ByteArray";
import Enumerable from "../util/Enumerable";

const DEFAULT_MASTER_VERSION = "0.0.0";
const MarkerKkex = ByteArray.fromBinaryLiteral("KKEx");
const Idle = ByteArray.fromBinaryLiteral("Idle");

export default class KkCharacterReader {

    read(stream: IReadableByteArrayStreamEx, withCard: boolean = true, skipAdditional: boolean = true, masterVersion: string = DEFAULT_MASTER_VERSION): KkCharacter {
        const r = new KkCharacter();

        r.masterVersion = masterVersion;

        if (withCard) {
            r.card = readPngData(stream);
        }

        r.productNumber = stream.readUInt32LE();
        r.marker = stream.readUtf8String();

        r.unknown1 = stream.readUtf8String();

        stream.readUInt32LE(); // photo size in bytes
        r.photo = readPngData(stream);

        const listInfoSize = stream.readUInt32LE();
        const listInfoData = stream.readBytes(listInfoSize);

        r.infoList = msgpack.decode(listInfoData.buffer) as InfoList;

        const charaDataSize = stream.readUInt64LE();
        const charaData = stream.readBytes(charaDataSize);

        for (const entry of r.infoList.lstInfo) {
            let readFn: (c: KkCharacter, part: Uint8Array) => void;

            switch (entry.name) {
                case KnownEntryName.Custom:
                    readFn = readCustomizationPart;
                    break;
                case KnownEntryName.Coordinate:
                    readFn = readCoordinatePart;
                    break;
                case KnownEntryName.Parameter:
                    readFn = readParametersPart;
                    break;
                case KnownEntryName.Status:
                    readFn = readStatusPart;
                    break;
                case KnownEntryName.Extra:
                    readFn = readExtraPart;
                    break;
                default:
                    throw new ArgumentOutOfRangeError(nameof.full(entry.name), `Unknown entry name: '${entry.name}'`);
            }

            const part = getCharaDataBytes(charaData, entry);
            readFn(r, part);
        }

        if (!withCard) {
            {
                const len1 = stream.readByte();

                if (len1 === 4) {
                    const marker = stream.readBytes(len1);

                    if (ArrayHelper.elementsEqual(marker, MarkerKkex)) {
                        const version = stream.readUInt32LE();
                        const len2 = stream.readUInt32LE();
                        const exData = stream.readBytes(len2);

                        const memory = WriteOnlyByteArrayStream.new();

                        memory.writeByte(len1);
                        memory.write(marker);
                        memory.writeUInt32LE(version);
                        memory.writeUInt32LE(len2);
                        memory.write(exData);

                        r.extraData = memory.toArray();
                    }
                } else {
                    stream.position -= 1;
                }
            }

            r.unknown2 = stream.readBytes(4);
            r.unknownMark = stream.readBytes(4);

            r.dearName = stream.readUtf8String();

            r.feeling = stream.readUInt32LE();
            r.loveGauge = stream.readUInt32LE();
            r.hCount = stream.readUInt32LE();
            r.isClubMember = stream.readByte() !== 0;
            r.isLover = stream.readByte() !== 0;
            r.isAngry = stream.readByte() !== 0;

            r.unknown3 = stream.readBytes(1);

            r.intelligence2 = stream.readUInt32LE();

            switch (r.gender) {
                case Gender.Male:
                    r.strength = stream.readUInt32LE();
                    r.hasDate = false;
                    break;
                case Gender.Female:
                    r.hasDate = stream.readByte() !== 0;
                    stream.readBytes(3); // not used
                    r.strength = 0;
                    break;
                default:
                    throw new ArgumentOutOfRangeError(nameof.full(r.gender));
            }

            r.ero = stream.readUInt32LE();

            const percentages: FreeDict<Uint8Array> = Object.create(null);

            if (skipAdditional) {
                r.unknown6 = ByteArray.EMPTY;
                percentages[KnownPercentageKey.Mune] = ByteArray.EMPTY;
                percentages[KnownPercentageKey.Kokan] = ByteArray.EMPTY;
                percentages[KnownPercentageKey.Anal] = ByteArray.EMPTY;
                percentages[KnownPercentageKey.Siri] = ByteArray.EMPTY;
                percentages[KnownPercentageKey.Tikubi] = ByteArray.EMPTY;
                r.unknown7 = ByteArray.EMPTY;
                percentages[KnownPercentageKey.KokanPiston] = ByteArray.EMPTY;
                percentages[KnownPercentageKey.AnalPiston] = ByteArray.EMPTY;
                percentages[KnownPercentageKey.Houshi] = ByteArray.EMPTY;
            } else {
                r.unknown6 = stream.readBytes(14);
                percentages[KnownPercentageKey.Mune] = stream.readBytes(4);
                percentages[KnownPercentageKey.Kokan] = stream.readBytes(4);
                percentages[KnownPercentageKey.Anal] = stream.readBytes(4);
                percentages[KnownPercentageKey.Siri] = stream.readBytes(4);
                percentages[KnownPercentageKey.Tikubi] = stream.readBytes(4);
                r.unknown7 = stream.readBytes(14);
                percentages[KnownPercentageKey.KokanPiston] = stream.readBytes(4);
                percentages[KnownPercentageKey.AnalPiston] = stream.readBytes(4);
                percentages[KnownPercentageKey.Houshi] = ByteArray.EMPTY; // value is set later
            }

            r.percentages = percentages;

            readAdditionalData(stream, r);
        }

        return r;
    }

}

const SigPngHeader = ByteArray.fromBinaryLiteral("\x89\x50\x4e\x47\x0d\x0a\x1a\x0a");
const SigIdat = ByteArray.fromBinaryLiteral("IDAT");
const SigIend = ByteArray.fromBinaryLiteral("IEND");

interface IdatChunk {
    type: Uint8Array;
    data: Uint8Array;
    crc: Uint8Array;
}

function readPngData(stream: IReadableByteArrayStreamEx): Uint8Array {
    const signature = stream.readBytes(8);
    Guard.assert(ArrayHelper.elementsEqual(signature, SigPngHeader));

    const ihdr = stream.readBytes(25);

    const idatChunks: IdatChunk[] = [];
    let idatDataLength = stream.readUInt32BE();

    while (idatDataLength > 0) {
        const idatType = stream.readBytes(4);
        Guard.assert(ArrayHelper.elementsEqual(idatType, SigIdat));

        const idatData = stream.readBytes(idatDataLength);
        const idatCrc = stream.readBytes(4);

        idatChunks.push({
            type: idatType,
            data: idatData,
            crc: idatCrc
        });

        idatDataLength = stream.readUInt32BE();
    }

    // IEND
    const iendDataLength = idatDataLength;
    const iendType = stream.readBytes(4);
    Guard.assert(ArrayHelper.elementsEqual(iendType, SigIend));
    const iendCrc = stream.readBytes(4);

    const memory = WriteOnlyByteArrayStream.new();

    memory.write(signature);
    memory.write(ihdr);

    for (const chunk of idatChunks) {
        memory.writeUInt32BE(chunk.data.length);
        memory.write(chunk.type);
        memory.write(chunk.data);
        memory.write(chunk.crc);
    }

    memory.writeUInt32BE(iendDataLength);
    memory.write(iendType);
    memory.write(iendCrc);

    const result = memory.toArray();

    return result;
}

function getCharaDataBytes(data: Uint8Array, entry: InfoListEntry): Uint8Array {
    return data.subarray(entry.pos, entry.pos + entry.size);
}

function readCustomizationPart(c: KkCharacter, part: Uint8Array): void {
    const memory = ReadOnlyByteArrayStream.fromArray(part);

    let length = memory.readUInt32LE();
    let data = memory.readBytes(length);
    const face = msgpack.decode(data) as object;

    length = memory.readUInt32LE();
    data = memory.readBytes(length);
    const body = msgpack.decode(data) as object;

    length = memory.readUInt32LE();
    data = memory.readBytes(length);
    const hair = msgpack.decode(data) as object;

    c.customization = {
        face,
        body,
        hair
    };
}

function readCoordinatePart(c: KkCharacter, part: Uint8Array): void {
    const unpacked = msgpack.decode(part) as Uint8Array[];
    const coordinates: Coordinate[] = [];

    for (const coordinateData of unpacked) {
        const memory = ReadOnlyByteArrayStream.fromArray(coordinateData);

        let length = memory.readUInt32LE();
        let data = memory.readBytes(length);
        const clothes = msgpack.decode(data) as object;

        length = memory.readUInt32LE();
        data = memory.readBytes(length);
        const accessory = msgpack.decode(data) as object;

        const makeupEnabledByte = memory.readByte();

        length = memory.readUInt32LE();
        data = memory.readBytes(length);
        const makeup = msgpack.decode(data) as object;

        const coordinate: Coordinate = {
            clothes,
            accessory,
            makeupEnabled: makeupEnabledByte !== 0,
            makeup,
        };

        coordinates.push(coordinate);
    }

    c.coordinates = coordinates;
}

function readParametersPart(c: KkCharacter, part: Uint8Array): void {
    c.parameters = msgpack.decode(part) as FreeDict<any>;
}

function readStatusPart(c: KkCharacter, part: Uint8Array): void {
    c.status = msgpack.decode(part) as FreeDict<any>;
}

function readExtraPart(c: KkCharacter, part: Uint8Array): void {
    c.kkex = msgpack.decode(part) as object;
}

function readAdditionalData(data: IReadableByteArrayStreamEx, c: KkCharacter): void {
    const chunk = data.readRest();
    const start = ByteArray.find(chunk, Idle);

    if (start < 0) {
        c.beforeAdditional = chunk;
        c.eventAfterDay = 0;
        c.isFirstGirlfriend = false;
        c.intimacy = 0;
        c.afterAdditional = ByteArray.EMPTY;

        return;
    }

    c.beforeAdditional = chunk.subarray(0, start - 1);

    const additionalKeys: string[] = [];
    const additionalValues: number[] = [];

    const stream = ReadOnlyByteArrayStream.fromArray(chunk.subarray(start + Idle.length, chunk.length));

    {
        const idleValue = stream.readUInt32LE();
        additionalKeys.push("Idle");
        additionalValues.push(idleValue);
    }

    while (true) {
        const len = stream.readByte();

        if (len === 0) {
            stream.position -= 1;
            break;
        }

        stream.position -= 1;

        const key = stream.readUtf8String();
        const value = stream.readUInt32LE();

        additionalKeys.push(key);
        additionalValues.push(value);
    }

    {
        c.additionalKeys = additionalKeys;

        const map: FreeDict<number> = Object.create(null);

        for (const [key, value] of Enumerable.zip<[string, number]>([additionalKeys, additionalValues])) {
            map[key] = value;
        }

        c.additionalValueMap = map;
    }

    {
        const levelBytes = stream.readBytes(4);
        c.percentages![KnownPercentageKey.Houshi] = levelBytes;
    }

    if (c.masterVersion! >= "0.0.7") {
        c.eventAfterDay = stream.readUInt32LE();
        c.isFirstGirlfriend = stream.readByte() !== 0;
    }

    if (c.masterVersion! >= "1.0.1") {
        c.intimacy = stream.readUInt32LE();
    }

    c.afterAdditional = stream.readRest();
}
