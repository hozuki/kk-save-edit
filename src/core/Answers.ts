import FreeDict from "../common/FreeDict";
import PropKeyValue from "./PropKeyValue";
import SimplePropBag from "./SimplePropBag";
import KnownAnswerKey from "./internal/known/KnownAnswerKey";

export default class Answers extends SimplePropBag<boolean> {

    constructor(dict: FreeDict<boolean>) {
        super(dict);

        this.likesAnimals = this.addKV(KnownAnswerKey.Animal);
        this.likesEating = this.addKV(KnownAnswerKey.Eat);
        this.cooksByHerself = this.addKV(KnownAnswerKey.Cook);
        this.likesExercising = this.addKV(KnownAnswerKey.Exercise);
        this.studiesHard = this.addKV(KnownAnswerKey.Study);
        this.chic = this.addKV(KnownAnswerKey.Fashionable);
        this.acceptsBlackCoffee = this.addKV(KnownAnswerKey.BlackCoffee);
        this.likesSpicyFood = this.addKV(KnownAnswerKey.Spicy);
        this.likesSweetFood = this.addKV(KnownAnswerKey.Sweet);
    }

    readonly likesAnimals: PropKeyValue<boolean>;
    readonly likesEating: PropKeyValue<boolean>;
    readonly cooksByHerself: PropKeyValue<boolean>;
    readonly likesExercising: PropKeyValue<boolean>;
    readonly studiesHard: PropKeyValue<boolean>;
    readonly chic: PropKeyValue<boolean>;
    readonly acceptsBlackCoffee: PropKeyValue<boolean>;
    readonly likesSpicyFood: PropKeyValue<boolean>;
    readonly likesSweetFood: PropKeyValue<boolean>;

}
