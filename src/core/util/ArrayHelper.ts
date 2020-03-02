import OmitFunction from "../../common/types/OmitFunction";

class ArrayHelperClass {

    static elementsEqual(array1: Uint8Array, array2: Uint8Array): boolean;
    static elementsEqual(array1: ArrayLike<number>, array2: ArrayLike<number>): boolean;
    static elementsEqual(array1: ArrayLike<number>, array2: ArrayLike<number>): boolean {
        if (array1.length !== array2.length) {
            return false;
        }

        const length = array1.length;

        for (let i = 0; i < length; i += 1) {
            if (array1[i] !== array2[i]) {
                return false;
            }
        }

        return true;
    }

}

const ArrayHelper = ArrayHelperClass as OmitFunction<typeof ArrayHelperClass>;

export default ArrayHelper;
