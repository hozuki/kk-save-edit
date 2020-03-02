import OmitFunction from "../common/types/OmitFunction";

class ValidationREClass {

    static readonly positiveInteger = /^\s*[+]?\d+\s*$/;

}

const ValidationRE = ValidationREClass as OmitFunction<typeof ValidationREClass>;

export default ValidationRE;
