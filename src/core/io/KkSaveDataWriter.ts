import {IWriteableByteArrayStreamEx} from "../../io/IWriteableByteArrayStreamEx";
import KkSaveData from "../internal/KkSaveData";
import KkCharacterWriter from "./KkCharacterWriter";

export default class KkSaveDataWriter {

    write(stream: IWriteableByteArrayStreamEx, save: KkSaveData): void {
        stream.writeUtf8String(save.version!);
        stream.writeUtf8String(save.schoolName!);
        stream.write(save.unknown1!);

        const charaWriter = new KkCharacterWriter();

        for (const chara of save.characters!) {
            charaWriter.write(stream, chara);
        }
    }

}
