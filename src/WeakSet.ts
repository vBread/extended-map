export class ExtendedWeakSet<T extends object> extends WeakSet<T> {
	private readonly coerceValue: (value: T) => T;

	public constructor(iterable: Iterable<T>);
	public constructor(values?: ReadonlyArray<T>);
	public constructor(entries: ReadonlyArray<T> | Iterable<T>, coerceValue: (value: T) => T);
	public constructor(entries?: ReadonlyArray<T> | Iterable<T>, coerceValue?: (value: T) => T) {
		super(entries);

		this.coerceValue = coerceValue;
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

	public static isWeakSet(arg: any): arg is ExtendedWeakSet<any>;
	public static isWeakSet<T extends object>(arg: any): arg is ExtendedWeakSet<T>;
	public static isWeakSet(arg: any): arg is ExtendedWeakSet<any> {
		const methods = ['add', 'has', 'delete'];

		// prettier-ignore
		return (
			arg
			&& !('size' in arg)
			&& arg[Symbol.toStringTag] === 'WeakSet'
			&& methods.every((method) => method in arg && typeof arg[method] === 'function')
		)
	}

	public add(value: T): this {
		return super.add(this.coerceValue?.(value) ?? value);
	}
	public delete(value: T): boolean {
		return super.delete(this.coerceValue?.(value) ?? value);
	}

	public addAll() {

	}

	public deleteAll() {

	public has(value: T): boolean {
		return super.has(this.coerceValue?.(value) ?? value);
	}
}
