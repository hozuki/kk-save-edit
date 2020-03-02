import ArgumentError from "../../common/errors/ArgumentError";
import OmitFunction from "../../common/types/OmitFunction";

const EmptyBytes = new Uint8Array(0);

class ByteArrayClass {

    static get EMPTY(): Uint8Array {
        return EmptyBytes;
    }

    static getBlob(data: Uint8Array, mimeType: string = "image/png"): Blob {
        return new Blob([data], {type: mimeType});
        // Use URL.createObjectURL() to get blob URL
    }

    static find(data: Uint8Array, pattern: Uint8Array, startIndex: number = 0): number {
        const lps = computeLpsArray(pattern);

        return findPattern(data, pattern, startIndex, lps);
    }

    /**
     *
     *
     * @param {Uint8Array} data
     * @param {Uint8Array} pattern
     * @param {boolean} removeEmptyEntries
     * @returns {Uint8Array[]} Split result. These are views of original {@link data} array, so they share modifications.
     */
    static split(data: Uint8Array, pattern: Uint8Array, removeEmptyEntries: boolean = true): Uint8Array[] {
        if (data.length === 0) {
            return [EmptyBytes];
        }

        if (pattern.length === 0) {
            throw new ArgumentError("pattern cannot be empty");
        }

        const lps = computeLpsArray(pattern);

        let lastIndex = 0;
        let nextIndex = findPattern(data, pattern, lastIndex, lps);

        if (nextIndex < 0) {
            return [data.subarray()];
        }

        const result: Uint8Array[] = [];

        do {
            const subArray = data.subarray(lastIndex, nextIndex);

            if (subArray.length === 0) {
                if (!removeEmptyEntries) {
                    result.push(subArray);
                }
            } else {
                result.push(subArray);
            }

            lastIndex = nextIndex + pattern.length;
            nextIndex = findPattern(data, pattern, lastIndex, lps);
        } while (nextIndex >= 0);

        if (lastIndex < data.length) {
            const subArray = data.subarray(lastIndex, data.length);
            result.push(subArray);
        }

        return result;
    }

    static fromBinaryLiteral(s: string): Uint8Array {
        const length = s.length;
        const arr = new Array<number>(s.length);

        for (let i = 0; i < length; i += 1) {
            arr[i] = s.charCodeAt(i);
        }

        return new Uint8Array(arr);
    }

}

function computeLpsArray(pattern: Uint8Array): number[] {
    const patternLength = pattern.length;
    const lps: number[] = new Array<number>(patternLength);

    let len = 0;
    let i = 1;
    lps[0] = 0;

    while (i < patternLength) {
        if (pattern[i] === pattern[len]) {
            len += 1;
            lps[i] = len;
            i += 1;
        } else {
            if (len !== 0) {
                len = lps[len - 1];
            } else {
                lps[i] = len;
                i += 1;
            }
        }
    }

    return lps;
}

function findPattern(data: Uint8Array, pattern: Uint8Array, startIndex: number, lps: number[]): number {
    const dataLength = data.length;
    const patternLength = pattern.length;

    let dataIndex = startIndex;
    let patternIndex = 0;

    while (dataIndex < dataLength) {
        if (pattern[patternIndex] === data[dataIndex]) {
            patternIndex += 1;
            dataIndex += 1;
        }

        if (patternIndex === patternLength) {
            return dataIndex - patternIndex;
        }

        if (dataIndex < dataLength && pattern[patternIndex] !== data[dataIndex]) {
            if (patternIndex > 0) {
                patternIndex = lps[patternIndex - 1];
            } else {
                dataIndex += 1;
            }
        }
    }

    return -1;
}

const ByteArray = ByteArrayClass as OmitFunction<typeof ByteArrayClass>;

export default ByteArray;
