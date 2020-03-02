import ApplicationError from "./ApplicationError";

export default class InvalidOperationError extends ApplicationError {

    constructor(message: string = "invalid operation") {
        super(message);
    }

    get name(): string {
        return "InvalidOperation";
    }

}
