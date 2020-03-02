import KkCharacter from "./KkCharacter";

export default class KkSaveData {

    version?: string;
    schoolName?: string;
    unknown1?: Uint8Array;
    characters?: KkCharacter[];

}
