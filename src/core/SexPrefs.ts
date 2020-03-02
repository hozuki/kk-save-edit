import FreeDict from "../common/FreeDict";
import PropKeyValue from "./PropKeyValue";
import SimplePropBag from "./SimplePropBag";
import KnownDenialKey from "./internal/known/KnownDenialKey";

export default class SexPrefs extends SimplePropBag<boolean> {

    constructor(dict: FreeDict<boolean>) {
        super(dict);

        this.kissing = this.addKV(KnownDenialKey.Kiss);
        this.caress = this.addKV(KnownDenialKey.Aibu);
        this.anal = this.addKV(KnownDenialKey.Anal);
        this.vibrator = this.addKV(KnownDenialKey.Massage);
        this.rawInsertion = this.addKV(KnownDenialKey.NotCondom);
    }

    readonly kissing: PropKeyValue<boolean>;
    readonly caress: PropKeyValue<boolean>;
    readonly anal: PropKeyValue<boolean>;
    readonly vibrator: PropKeyValue<boolean>;
    readonly rawInsertion: PropKeyValue<boolean>;

}
