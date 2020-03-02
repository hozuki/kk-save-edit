import OmitFunction from "../../common/types/OmitFunction";

class EnumerableClass {

    static* enumerate<T>(e: Iterable<T>): Iterable<[number, T]> {
        let counter = 0;
        for (const o of e) {
            yield [counter, o];
            counter += 1;
        }
    }

    static range(count: number): Iterable<number>;
    static range(from: number, count: number): Iterable<number>;
    static range(from: number, count: number, step: number): Iterable<number>;
    static* range(v1: number, v2?: number, v3?: number): Iterable<number> {
        const step = typeof v3 === "number" ? v3 : 1;
        let from: number;
        let count: number;

        if (typeof v2 === "number") {
            from = v1;
            count = v2;
        } else {
            from = 0;
            count = v1;
        }

        const end = from + count;
        for (let i = from; i < end; i += step) {
            yield i;
        }
    }

    static* zip<TTuple extends any[]>(e: ZipParam<TTuple>): ZipResult<TTuple> {
        const count = e.length;
        const iterators = new Array<Iterator<any>>(count);
        const results = new Array<IteratorResult<any>>(count);

        for (let i = 0; i < count; i += 1) {
            iterators[i] = e[i][Symbol.iterator]();
        }

        let iterationDone = false;
        while (true) {
            for (let i = 0; i < count; i += 1) {
                const r = iterators[i].next();

                if (r.done) {
                    iterationDone = true;
                    break;
                }

                results[i] = r;
            }

            if (iterationDone) {
                break;
            }

            yield results.map(r => r.value) as unknown as ZipItem<TTuple>;
        }
    }

}

// I still can't get it auto deduced... :(
type ZipParam<TTuple extends any[]> = { readonly [I in keyof TTuple]: Iterable<TTuple[I]> };
type ZipItem<TTuple extends any[]> = { readonly [I in keyof TTuple]: TTuple[I] };
type ZipResult<TTuple extends any[]> = Iterable<ZipItem<TTuple>>;

const Enumerable = EnumerableClass as OmitFunction<typeof EnumerableClass>;

export default Enumerable;
