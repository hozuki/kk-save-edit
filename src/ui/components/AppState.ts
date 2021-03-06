import Nullable from "../../common/types/Nullable";
import SaveData from "../../core/SaveData";

export default interface AppState {

    rawData: Nullable<Uint8Array>;
    saveData: Nullable<SaveData>;
    fileName: string;

}
