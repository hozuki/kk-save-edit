import Character from "./Character";
import KkCharacter from "./internal/KkCharacter";

export default class MaleCharacter extends Character {

    constructor(chara: KkCharacter) {
        super(chara);
    }

    get intelligence(): number {
        return this._internal.intelligence || 0;
    }

    set intelligence(v: number) {
        this._internal.intelligence = v;
    }

    get strength(): number {
        return this._internal.strength || 0;
    }

    set strength(v: number) {
        this._internal.strength = v;
    }

    get hentai(): number {
        return this._internal.ero || 0;
    }

    set hentai(v: number) {
        this._internal.ero = v;
    }

}
