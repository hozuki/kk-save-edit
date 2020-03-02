import Answers from "./Answers";
import Character from "./Character";
import Developments from "./Developments";
import Personality from "./Personality";
import SexPrefs from "./SexPrefs";
import Traits from "./Traits";
import WeakPoint from "./WeakPoint";
import KkCharacter from "./internal/KkCharacter";

export default class FemaleCharacter extends Character {

    constructor(chara: KkCharacter) {
        super(chara);

        this.answers = new Answers(chara.answers);
        this.sexPrefs = new SexPrefs(chara.denials);
        this.traits = new Traits(chara.attributes);
        this.developments = new Developments(chara);
    }

    get personality(): Personality {
        return this._internal.personality;
    }

    set personality(v: Personality) {
        this._internal.personality = v;
    }

    get weakPoint(): WeakPoint {
        return this._internal.weakPoint;
    }

    set weakPoint(v: WeakPoint) {
        this._internal.weakPoint = v;
    }

    // "optional" ones

    get feeling(): number {
        return this._internal.feeling || 0;
    }

    set feeling(v: number) {
        this._internal.feeling = v;
    }

    get isLover(): boolean {
        return this._internal.isLover || false;
    }

    set isLover(v: boolean) {
        this._internal.isLover = v;
    }

    get eroticDegree(): number {
        return this._internal.loveGauge || 0;
    }

    set eroticDegree(v: number) {
        this._internal.loveGauge = v;
    }

    get hCount(): number {
        return this._internal.hCount || 0;
    }

    set hCount(v: number) {
        this._internal.hCount = v;
    }

    get intimacy(): number {
        return this._internal.intimacy || 0;
    }

    set intimacy(v: number) {
        this._internal.intimacy = v;
    }

    get isAngry(): boolean {
        return this._internal.isAngry || false;
    }

    set isAngry(v: boolean) {
        this._internal.isAngry = v;
    }

    get isClubMember(): boolean {
        return this._internal.isClubMember || false;
    }

    set isClubMember(v: boolean) {
        this._internal.isClubMember = v;
    }

    get hasDate(): boolean {
        return this._internal.hasDate || false;
    }

    set hasDate(v: boolean) {
        this._internal.hasDate = v;
    }

    readonly answers: Answers;
    readonly sexPrefs: SexPrefs;
    readonly traits: Traits;

    readonly developments: Developments;

}
