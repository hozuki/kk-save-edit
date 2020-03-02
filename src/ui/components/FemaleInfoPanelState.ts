import FreeDict from "../../common/FreeDict";

export default interface FemaleInfoPanelState {

    values: FieldValues;
    errors: FieldErrors;

}

interface Fields<T> extends FreeDict<T | undefined> {

    firstName?: T;
    lastName?: T;
    nickname?: T;
    personality?: T;
    weakPoint?: T;
    answers?: T;
    sexPrefs: T;
    traits: T;
    feeling?: T;
    isLover?: T;
    hDegree?: T;
    hCount?: T;
    intimacy?: T;
    isAngry?: T;
    isClubMember?: T;
    hasDate?: T;
    developments: T;

}

interface FieldValues extends Fields<any> {

}

interface FieldErrors extends Fields<string> {

}
