import DEBUG_MODE from "./DEBUG_MODE";
import ApplicationError from "./errors/ApplicationError";
import Nullable from "./types/Nullable";
import OmitFunction from "./types/OmitFunction";

class GuardClass {

    static assert(condition: any, message?: string): void {
        if (!DEBUG_MODE) {
            return;
        }

        console.assert(condition, message || "Guard: condition is not met");
    }

    static ensure(condition: any, message?: string): void {
        if (!condition) {
            throw new ApplicationError(message || "Guard condition violated.");
        }
    }

    static isNull<T>(value: Nullable<T>): value is null {
        return value === null;
    }

    static ensureNotNull<T>(value: Nullable<T> | undefined): void {
        GuardClass.ensure(typeof (value) !== "undefined" && value !== null, "The value must not be null or undefined.");
    }

    static ensureDefined<T>(value: T): void {
        GuardClass.ensure(typeof (value) !== "undefined", "The value must not be undefined.");
    }

    static ensurePrimitive<T>(value: T): void {
        GuardClass.ensure(GuardClass.isPrimitive(value), "The given value is not of primitive type.");
    }

    static isPrimitive<T>(value: T | any): value is boolean | number | string {
        const t = typeof value;

        switch (t) {
            case "boolean":
            case "number":
            case "string":
                return true;
            default:
                // These are not recognized as primitives: symbol, bigint
                return false;
        }
    }

    static defined<T>(value: T | undefined): value is T {
        return typeof value !== "undefined";
    }

}

const Guard = GuardClass as OmitFunction<typeof GuardClass>;

export default Guard;
