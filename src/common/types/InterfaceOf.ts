type InterfaceOf<T> = { [P in keyof T]: T[P] };

export default InterfaceOf;
