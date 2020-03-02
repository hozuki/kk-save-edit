import FreeDict from "../../common/FreeDict";

export default interface MaleInfoPanelState {

    values: FieldValues;
    errors: FieldErrors;

}

interface Fields<T> extends FreeDict<T | undefined> {

    firstName?: T;
    lastName?: T;
    nickname?: T;
    intelligence?: T;
    strength?: T;
    hentai?: T;

}

interface FieldValues extends Fields<string> {

}

interface FieldErrors extends Fields<string> {

}
