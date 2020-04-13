import FreeDict from "../../common/FreeDict";

export default interface SaveDataPanelState {

    values: FieldValues;
    errors: FieldErrors;

}

interface Fields<T> extends FreeDict<T | undefined> {

    schoolName?: T;

}

interface FieldValues extends Fields<string> {

}

interface FieldErrors extends Fields<string> {

}
