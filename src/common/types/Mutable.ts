type Mutable<T> = { -readonly [P in keyof T]: T[P] };

export default Mutable;
