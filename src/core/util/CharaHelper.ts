import ArgumentOutOfRangeError from "../../common/errors/ArgumentOutOfRangeError";
import OmitFunction from "../../common/types/OmitFunction";
import Character from "../Character";
import FemaleCharacter from "../FemaleCharacter";
import Gender from "../Gender";
import MaleCharacter from "../MaleCharacter";
import KkCharacter from "../internal/KkCharacter";

class CharaHelperClass {

    // solves circular dependency
    static create(chara: KkCharacter): Character {
        switch (chara.gender) {
            case Gender.Male:
                return new MaleCharacter(chara);
            case Gender.Female:
                return new FemaleCharacter(chara);
            default:
                throw new ArgumentOutOfRangeError(nameof.full(chara.gender));
        }
    }

}

const CharaHelper = CharaHelperClass as OmitFunction<typeof CharaHelperClass>;

export default CharaHelper;
