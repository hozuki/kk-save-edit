import Nullable from "../common/types/Nullable";
import Gender from "./Gender";
import KkCharacter from "./internal/KkCharacter";

export default abstract class Character {

    protected constructor(chara: KkCharacter) {
        this._internal = chara;
    }

    get gender(): Gender {
        return this._internal.gender;
    }

    get card(): Nullable<Uint8Array> {
        return this._internal.card || null;
    }

    get photo(): Uint8Array {
        return this._internal.photo!;
    }

    get firstName(): string {
        return this._internal.firstName;
    }

    set firstName(v: string) {
        this._internal.firstName = v;
    }

    get lastName(): string {
        return this._internal.lastName;
    }

    set lastName(v: string) {
        this._internal.lastName = v;
    }

    get nickname(): string {
        return this._internal.nickname;
    }

    set nickname(v: string) {
        this._internal.nickname = v;
    }

    protected readonly _internal: KkCharacter;

}
