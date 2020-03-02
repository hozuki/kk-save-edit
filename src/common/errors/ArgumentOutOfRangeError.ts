import ApplicationError from "./ApplicationError";

export default class ArgumentOutOfRangeError extends ApplicationError {

    constructor(paramName: string = "", message: string = "argument out of range") {
        super(message);
        this._paramName = paramName;
    }

    get paramName(): string {
        return this._paramName;
    }

    get name(): string {
        return "ArgumentOutOfRange";
    }

    private readonly _paramName: string;

}
