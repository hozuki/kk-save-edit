import FreeDict from "../common/FreeDict";
import PropKeyValue from "./PropKeyValue";
import SimplePropBag from "./SimplePropBag";
import KnownAttributeKey from "./internal/known/KnownAttributeKey";

export default class Traits extends SimplePropBag<boolean> {

    constructor(dict: FreeDict<boolean>) {
        super(dict);

        this.smallBladder = this.addKV(KnownAttributeKey.Hinnyo);
        this.starved = this.addKV(KnownAttributeKey.Harapeko);
        this.insensitive = this.addKV(KnownAttributeKey.Donkan);
        this.simple = this.addKV(KnownAttributeKey.Choroi);
        this.slutty = this.addKV(KnownAttributeKey.Bitch);
        this.promiscuous = this.addKV(KnownAttributeKey.Mutturi);
        this.bookworm = this.addKV(KnownAttributeKey.Dokusyo);
        this.likesMusic = this.addKV(KnownAttributeKey.Ongaku);
        this.lively = this.addKV(KnownAttributeKey.Kappatu);
        this.submissive = this.addKV(KnownAttributeKey.Ukemi);
        this.friendly = this.addKV(KnownAttributeKey.Friendly);
        this.neat = this.addKV(KnownAttributeKey.Kireizuki);
        this.lazy = this.addKV(KnownAttributeKey.Taida);
        this.elusive = this.addKV(KnownAttributeKey.Sinsyutu);
        this.loner = this.addKV(KnownAttributeKey.Hitori);
        this.sporty = this.addKV(KnownAttributeKey.Undo);
        this.diligent = this.addKV(KnownAttributeKey.Majime);
        this.likesGirls = this.addKV(KnownAttributeKey.LikeGirls);
    }

    readonly smallBladder: PropKeyValue<boolean>;
    readonly starved: PropKeyValue<boolean>;
    readonly insensitive: PropKeyValue<boolean>;
    readonly simple: PropKeyValue<boolean>;
    readonly slutty: PropKeyValue<boolean>;
    readonly promiscuous: PropKeyValue<boolean>;
    readonly bookworm: PropKeyValue<boolean>;
    readonly likesMusic: PropKeyValue<boolean>;
    readonly lively: PropKeyValue<boolean>;
    readonly submissive: PropKeyValue<boolean>;
    readonly friendly: PropKeyValue<boolean>;
    readonly neat: PropKeyValue<boolean>;
    readonly lazy: PropKeyValue<boolean>;
    readonly elusive: PropKeyValue<boolean>;
    readonly loner: PropKeyValue<boolean>;
    readonly sporty: PropKeyValue<boolean>;
    readonly diligent: PropKeyValue<boolean>;
    readonly likesGirls: PropKeyValue<boolean>;

}
