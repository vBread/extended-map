export class ExtendedWeakSet<T extends object> extends WeakSet<T> {
	public constructor(iterable: Iterable<T>)
	public constructor(values?: ReadonlyArray<T>)
	public constructor(entries?: Iterable<T> | ReadonlyArray<T>) {
		super(entries)
	}

	public static of(...args: any[]): ExtendedWeakSet<any>
    public static of<T extends object>(...args: T[]): ExtendedWeakSet<T>
    public static of<T extends object>(...args: T[]): ExtendedWeakSet<T> {
        return new ExtendedWeakSet<T>(args)
	}

	public static from<U, T extends object = object>(iterable: Iterable<U>): ExtendedWeakSet<T>
    public static from<U, T extends object = object>(iterable: Iterable<U>, mapfn: (value: U, index: number) => T): ExtendedWeakSet<T>
    public static from<T extends object = object>(iterable: Iterable<any>, mapfn?: (value: any, index: number) => T): ExtendedWeakSet<T>
    public static from<U, S, T extends object = object>(iterable: Iterable<U>, mapfn: (value: U, index: number) => T, thisArg: S): ExtendedWeakSet<T>
    public static from<T extends object = object>(iterable: Iterable<any>, mapfn?: (value: any, index: number) => T, thisArg: any = this): ExtendedWeakSet<T> {
        const entries: T[] = []
        let i = 0

        for (const item of iterable) {
            if (mapfn) {
                entries.push(mapfn.call(thisArg, item, i++))
            } else {
                entries.push(item)
            }
        }

        return new ExtendedWeakSet<T>(entries)
    }

	public static isWeakSet(arg: any): arg is ExtendedWeakSet<any>
	public static isWeakSet<T extends object>(arg: any): arg is ExtendedWeakSet<T>
	public static isWeakSet(arg: any): arg is ExtendedWeakSet<any> {
		return arg[Symbol.toStringTag] === 'WeakSet'
	}

	public addAll() {

	}

	public deleteAll() {

	}
}
