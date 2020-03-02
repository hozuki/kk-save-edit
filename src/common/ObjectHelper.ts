import FreeDict from "./FreeDict";
import OmitFunction from "./types/OmitFunction";

const hasOwnProperty = Object.prototype.hasOwnProperty;

class ObjectHelperClass {

    static hasProp<T>(dict: FreeDict<T>, key: string): boolean;
    static hasProp(obj: any, name: PropertyKey): boolean {
        return hasOwnProperty.call(obj, name);
    }

}

const ObjectHelper = ObjectHelperClass as OmitFunction<typeof ObjectHelperClass>;

export default ObjectHelper;
