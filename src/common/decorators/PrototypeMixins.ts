import ObjectHelper from "../ObjectHelper";

type Injectable = Function | object;

function PrototypeMixins<TProto extends Function>(...baseCtors: Injectable[]): ProtoApplier<TProto>;
function PrototypeMixins<TProto extends Function>(canOverwrite: boolean, ...baseCtors: Injectable[]): ProtoApplier<TProto>;
function PrototypeMixins<TProto extends Function>(...args: any[]): ProtoApplier<TProto> {
    return (ctor: Function): void => {
        let canOverwrite: boolean;

        if (args.length > 0 && typeof args[0] === "boolean") {
            canOverwrite = args.shift();
        } else {
            canOverwrite = false;
        }

        for (const baseCtor of args) {
            let assignSource: object;

            if (typeof baseCtor === "function") {
                assignSource = baseCtor.prototype;
            } else if (typeof baseCtor === "object" && ctor !== null) {
                assignSource = baseCtor;
            } else {
                console.warn(`Cannot inject '${baseCtor}' to '${ctor}'.`);
                continue;
            }

            const propNames = Object.getOwnPropertyNames(assignSource);

            // We don't use Object.assign() so we can have our own collision handling logic.
            for (const propName of propNames) {
                // Avoid re-assigning overridden/assigned members.
                if (!ObjectHelper.hasProp(ctor.prototype, propName) || canOverwrite) {
                    ctor.prototype[propName] = (assignSource as any)[propName];
                }
            }
        }
    };
}

type ProtoApplier<TProto extends Function> = (ctor: TProto) => void;

export default PrototypeMixins;
