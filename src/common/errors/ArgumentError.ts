import ApplicationError from "./ApplicationError";

export default class ArgumentError extends ApplicationError {

    constructor(message: string = "invalid argument") {
        super(message);
    }

    get name(): string {
        return "ArgumentError";
    }

}
