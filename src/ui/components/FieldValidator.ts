import FreeDict from "../../common/FreeDict";
import Guard from "../../common/Guard";
import OmitFunction from "../../common/types/OmitFunction";
import Utf8String from "../../core/util/Utf8String";
import ValidationRE from "../ValidationRE";

class FieldValidatorClass {

    static validateString(values: Fields<string>, errors: Fields<string>, key: string, setValueCallback: (value: string) => void): boolean {
        const v = values[key];
        let ok = true;

        if (Guard.defined(v)) {
            if (v.length > 0) {
                const bytes = Utf8String.toBytes(v!);

                if (bytes.length > 0xff) {
                    errors[key] = "String is too long";
                    ok = false;
                }
            }

            if (ok) {
                errors[key] = "";
                setValueCallback(v);
            }
        } else {
            ok = false;
        }

        return ok;
    }

    static validateInt(values: Fields<string>, errors: Fields<string>, key: string, min: number, max: number, setValueCallback: (value: number) => void): boolean {
        const v = values[key];
        let ok = true;

        if (Guard.defined(v)) {
            if (ValidationRE.positiveInteger.test(v)) {
                const n = Number.parseInt(v);

                if (n < min || n > max) {
                    errors[key] = `Should be between ${min} and ${max}`;
                    ok = false;
                }
            } else {
                errors[key] = "Should be an integer";
                ok = false;
            }

            if (ok) {
                errors[key] = "";
                setValueCallback(Number.parseInt(v));
            }
        } else {
            ok = false;
        }

        return ok;
    }

}

const FieldValidator = FieldValidatorClass as OmitFunction<typeof FieldValidatorClass>;

export default FieldValidator;

interface Fields<T> extends FreeDict<T | undefined> {

}
