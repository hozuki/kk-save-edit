export default class ApplicationError extends Error {

    constructor(message: string = "application error occurred") {
        super(message);
    }

    get name(): string {
        return "ApplicationError";
    }

}
