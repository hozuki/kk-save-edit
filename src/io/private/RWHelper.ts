import Guard from "../../common/Guard";
import ByteArrayStream from "../ByteArrayStream";
import WriteOnlyByteArrayStream from "../WriteOnlyByteArrayStream";
import InvalidOperationError from "../../common/errors/InvalidOperationError";

const CAPACITY_EXPANSION_FACTOR = 1.5;
const CAPACITY_EXPANSION_BLOCK_LIMIT = 4 * 1024 * 1024;

export function stream$read(this: ByteArrayStream, buffer: Uint8Array, offset: number, count: number): number {
    offset |= 0;
    count |= 0;

    Guard.ensure(offset >= 0);
    Guard.ensure(count >= 0);

    if (buffer.length === 0 || count === 0 || this.position >= this.length) {
        return 0;
    }

    const toRead = computeMaxIoBytes.call(this, buffer, offset, count, false);

    if (toRead === 0) {
        return 0;
    }

    const view = this.array.subarray(this.position, this.position + toRead);
    buffer.set(view, offset);

    this.position += toRead;

    return toRead;
}

export function stream$write(this: WriteOnlyByteArrayStream, buffer: Uint8Array, offset: number, count: number): void {
    offset |= 0;
    count |= 0;

    Guard.ensure(offset >= 0);
    Guard.ensure(count >= 0);

    if (buffer.length === 0 || count === 0) {
        return;
    }

    // Fails silently when writing out of the fixed size buffer
    const toWrite = computeMaxIoBytes.call(this, buffer, offset, count, this._extensible);

    if (toWrite === 0) {
        return;
    }

    this.ensureCapacity(this.position + toWrite);

    const view = buffer.subarray(offset, offset + toWrite);
    this.array.set(view, this.position);

    this.length += toWrite;
    this.position += toWrite;
}

export function stream$ensureCapacity(this: WriteOnlyByteArrayStream, value: number): void {
    value = value | 0;

    Guard.ensure(value > 0);

    const currentCapacity = this.capacity;

    if (currentCapacity >= value) {
        return;
    }

    if (!this._extensible) {
        throw new InvalidOperationError("cannot extend a fixed size writeable stream");
    }

    let newCapacity = currentCapacity;

    while (newCapacity < value) {
        const estimatedExpanded = (newCapacity * CAPACITY_EXPANSION_FACTOR) | 0;
        let delta = estimatedExpanded - newCapacity;

        if (delta <= 0) {
            delta = 1;
        } else if (delta > CAPACITY_EXPANSION_BLOCK_LIMIT) {
            delta = newCapacity + CAPACITY_EXPANSION_BLOCK_LIMIT;
        }

        newCapacity += delta;
    }

    const oldArray = this.array;
    const newArray = new Uint8Array(newCapacity);

    // Copy old data
    newArray.set(oldArray, 0);

    this.array = newArray;
}

export function stream$setLength(this: WriteOnlyByteArrayStream, v: number): void {
    v |= 0;

    Guard.ensure(v >= 0);

    this.ensureCapacity(v);

    const oldLength = this._length;

    if (v < oldLength) {
        // Clear bytes that are after new visible window
        this.array.fill(0, v, oldLength);
    }

    if (this.position > v) {
        this.position = v;
    }

    this._length = v;
}

export function stream$toArray(this: ByteArrayStream): Uint8Array {
    const result = new Uint8Array(this.length);

    if (this.length > 0) {
        const view = this.array.subarray(0, this.length);
        result.set(view, 0);
    }

    return result;
}

function computeMaxIoBytes(this: ByteArrayStream, buffer: Uint8Array, offset: number, count: number, extensible: boolean): number {
    const bufferMax = Math.max(0, Math.min(buffer.length, buffer.length - offset, count));

    if (extensible) {
        return bufferMax;
    }

    const streamMax = Math.max(0, Math.min(this.length, this.length - this.position));

    return Math.min(bufferMax, streamMax);
}
