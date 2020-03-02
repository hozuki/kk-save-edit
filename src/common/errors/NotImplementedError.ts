import ApplicationError from "./ApplicationError";

export default class NotImplementedError extends ApplicationError {

    constructor(message: string = "not implemented") {
        super(message);
    }

    get name(): string {
        return "NotImplemented";
    }

}
