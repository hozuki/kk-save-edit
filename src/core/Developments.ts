import ObjectHelper from "../common/ObjectHelper";
import Nullable from "../common/types/Nullable";
import Percentage from "./Percentage";
import PropBag from "./PropBag";
import PropKeyValue from "./PropKeyValue";
import KkCharacter from "./internal/KkCharacter";
import KnownPercentageKey from "./internal/known/KnownPercentageKey";

export default class Developments extends PropBag<Percentage> {

    constructor(c: KkCharacter) {
        super();
        this._c = c;

        this.breasts = this.addKV(KnownPercentageKey.Mune);
        this.vagina = this.addKV(KnownPercentageKey.Kokan);
        this.anal = this.addKV(KnownPercentageKey.Anal);
        this.butts = this.addKV(KnownPercentageKey.Siri);
        this.nipples = this.addKV(KnownPercentageKey.Tikubi);
        this.vaginaInsertion = this.addKV(KnownPercentageKey.KokanPiston);
        this.analInsertion = this.addKV(KnownPercentageKey.AnalPiston);

        if (ObjectHelper.hasProp(c.percentages!, KnownPercentageKey.Houshi)) {
            this.serving = this.addKV(KnownPercentageKey.Houshi);
        } else {
            this.serving = null;
        }
    }

    get(key: string): Percentage {
        // Manual fix (don't throw accessing exceptions)
        const percs = this._c.percentages;

        if (percs && ObjectHelper.hasProp(percs, key)) {
            const buf = percs[key];

            if (buf && buf.length > 0) {
                return this._c.getPercentage(key) || Percentage.$0;
            }
        }

        return Percentage.$0;
    }

    set(key: string, value: Percentage): void {
        // Manual fix (don't throw accessing exceptions)
        const percs = this._c.percentages;

        if (percs && ObjectHelper.hasProp(percs, key)) {
            const buf = percs[key];

            if (buf && buf.length > 0) {
                this._c.setPercentage(key, value);
            }
        }
    }

    readonly breasts: PropKeyValue<Percentage>;
    readonly vagina: PropKeyValue<Percentage>;
    readonly anal: PropKeyValue<Percentage>;
    readonly butts: PropKeyValue<Percentage>;
    readonly nipples: PropKeyValue<Percentage>;
    readonly vaginaInsertion: PropKeyValue<Percentage>;
    readonly analInsertion: PropKeyValue<Percentage>;
    readonly serving: Nullable<PropKeyValue<Percentage>>;

    private readonly _c: KkCharacter;

}
