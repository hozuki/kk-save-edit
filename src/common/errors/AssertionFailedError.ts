import ApplicationError from "./ApplicationError";

export default class AssertionFailedError extends ApplicationError {

    constructor(message: string = "assertion failed") {
        super(message);
    }

    get name(): string {
        return "AssertionFailed";
    }

}
