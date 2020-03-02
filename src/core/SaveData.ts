import ReadOnlyByteArrayStream from "../io/ReadOnlyByteArrayStream";
import WriteOnlyByteArrayStream from "../io/WriteOnlyByteArrayStream";
import Character from "./Character";
import KkSaveData from "./internal/KkSaveData";
import KkSaveDataReader from "./io/KkSaveDataReader";
import KkSaveDataWriter from "./io/KkSaveDataWriter";
import CharaHelper from "./util/CharaHelper";

export default class SaveData {

    private constructor(saveData: KkSaveData) {
        this._internal = saveData;

        const characters: Character[] = [];

        for (const chara of saveData.characters!) {
            const char = CharaHelper.create(chara);
            characters.push(char);
        }

        this._characters = characters;
    }

    static load(data: Uint8Array): SaveData {
        const reader = new KkSaveDataReader();
        const stream = ReadOnlyByteArrayStream.fromArray(data);
        const saveData = reader.read(stream);

        return new SaveData(saveData);
    }

    get schoolName(): string {
        return this._internal.schoolName!;
    }

    set schoolName(v: string) {
        this._internal.schoolName = v;
    }

    get characters(): ReadonlyArray<Character> {
        return this._characters;
    }

    save(): Uint8Array {
        const writer = new KkSaveDataWriter();
        const stream = WriteOnlyByteArrayStream.new();

        writer.write(stream, this._internal);

        const result = stream.toArray();

        return result;
    }

    private readonly _internal: KkSaveData;
    private readonly _characters: Character[];

}
