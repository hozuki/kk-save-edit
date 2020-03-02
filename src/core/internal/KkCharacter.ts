import FreeDict from "../../common/FreeDict";
import Guard from "../../common/Guard";
import ArgumentError from "../../common/errors/ArgumentError";
import InvalidOperationError from "../../common/errors/InvalidOperationError";
import Nullable from "../../common/types/Nullable";
import Gender from "../Gender";
import Personality from "../Personality";
import WeakPoint from "../WeakPoint";
import Enumerable from "../util/Enumerable";
import Coordinate from "./packed/Coordinate";
import Customization from "./packed/Customization";
import InfoList from "./packed/InfoList";
import ObjectHelper from "../../common/ObjectHelper";
import Percentage from "../Percentage";

export default class KkCharacter {

    masterVersion?: string;

    card?: Uint8Array;

    productNumber?: number;
    marker?: string;
    unknown1?: string;

    photo?: Uint8Array;

    infoList?: InfoList;

    customization?: Customization;
    coordinates?: Coordinate[];
    parameters?: FreeDict<any>;
    status?: FreeDict<any>;
    kkex?: object; // extra values used by BepInEx

    percentages?: FreeDict<Uint8Array>;

    extraData?: Uint8Array;
    intimacy?: number;
    eventAfterDay?: number;
    isFirstGirlfriend?: boolean;
    unknown2?: Uint8Array;
    unknownMark?: Uint8Array;
    dearName?: string;
    feeling?: number;
    loveGauge?: number;
    hCount?: number;
    isClubMember?: boolean;
    isLover?: boolean;
    isAngry?: boolean;
    unknown3?: Uint8Array;
    intelligence2?: number;
    strength?: number;
    hasDate?: boolean;
    ero?: number;
    unknown6?: Uint8Array;
    unknown7?: Uint8Array;
    beforeAdditional?: Uint8Array;
    afterAdditional?: Uint8Array;
    additionalKeys?: string[];
    additionalValueMap?: FreeDict<number>;

    // Helper functions and properties

    get firstName(): string {
        return this.parameters!["firstname"];
    }

    set firstName(v: string) {
        this.parameters!["firstname"] = v;
    }

    get lastName(): string {
        return this.parameters!["lastname"];
    }

    set lastName(v: string) {
        this.parameters!["lastname"] = v;
    }

    get nickname(): string {
        return this.parameters!["nickname"];
    }

    set nickname(v: string) {
        this.parameters!["nickname"] = v;
    }

    get gender(): Gender {
        return this.parameters!["sex"];
    }

    set gender(v: Gender) {
        this.parameters!["sex"] = v;
    }

    get personality(): Personality {
        return this.parameters!["personality"];
    }

    set personality(v) {
        this.parameters!["personality"] = v;
    }

    get weakPoint(): WeakPoint {
        return this.parameters!["weakPoint"];
    }

    set weakPoint(v: WeakPoint) {
        this.parameters!["weakPoint"] = v;
    }

    get answers(): FreeDict<boolean> {
        // Not my typo
        return this.parameters!["awnser"];
    }

    get denials(): FreeDict<boolean> {
        return this.parameters!["denial"];
    }

    get attributes(): FreeDict<boolean> {
        return this.parameters!["attribute"];
    }

    // ---

    get intelligence(): Nullable<number> {
        return this.getInt32StringParam("intelligence");
    }

    set intelligence(v: Nullable<number>) {
        this.setInt32StringParam("intelligence", v);
    }

    get physical(): Nullable<number> {
        return this.getInt32StringParam("physical");
    }

    set physical(v: Nullable<number>) {
        this.setInt32StringParam("physical", v);
    }

    get hentai(): Nullable<number> {
        return this.getInt32StringParam("hentai");
    }

    set hentai(v: Nullable<number>) {
        this.setInt32StringParam("hentai", v);
    }

    // tslint:disable-next-line:member-ordering
    getPercentage(key: string): number {
        const p = this.percentages!;

        if (!ObjectHelper.hasProp(p, key)) {
            throw new InvalidOperationError("cannot add percentage");
        }

        const k = p[key];

        if (!k || k.length === 0) {
            throw new InvalidOperationError("cannot get percentage value from a placeholder");
        }

        const s = new DataView(k.buffer);
        const v = s.getUint16(k.byteOffset + 2, true);

        for (const [i, level] of Enumerable.enumerate(PercentageMap)) {
            if (v < level) {
                return i > 0 ? i - 1 : 0;
            }
        }

        return Percentage.$100;
    }

    // tslint:disable-next-line:member-ordering
    setPercentage(key: string, value: number): void {
        value |= 0;
        Guard.ensure(0 <= value && value <= 10);

        const p = this.percentages!;

        if (!ObjectHelper.hasProp(p, key)) {
            throw new InvalidOperationError("cannot add percentage");
        }

        const k = p[key];

        if (!k || k.length === 0) {
            throw new InvalidOperationError("cannot set percentage value to a placeholder");
        }

        const v = PercentageMap[value];
        const s = new DataView(k.buffer);
        s.setUint16(k.byteOffset + 2, v, true);
    }

    private getInt32StringParam(key: string): Nullable<number> {
        const p = this.parameters!;

        if (!ObjectHelper.hasProp(p, key)) {
            return null;
        }

        const s = p[key] as string;

        return Number.parseInt(s);
    }

    private setInt32StringParam(key: string, value: Nullable<number>): void {
        const p = this.parameters!;

        if (!ObjectHelper.hasProp(p, key)) {
            throw new InvalidOperationError("cannot add new parameter");
        }

        if (value === null) {
            throw new ArgumentError("value cannot be null");
        }

        p[key] = value.toString();
    }

}

const PercentageMap: number[] = [
    0x3000,
    0x4120,
    0x41a0,
    0x41f4,
    0x4220,
    0x4248,
    0x4270,
    0x428c,
    0x42a0,
    0x42b4,
    0x42c8
];
