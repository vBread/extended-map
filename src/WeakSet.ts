/**
 * Stores weakly held objects in a collection
 *
 * @spec {@link https://tc39.es/ecma262/#sec-weakset-objects ECMA-262}
 */
export class ExtendedWeakSet<T extends object> extends WeakSet<T> {
	private readonly coerceValue: (value: T) => T;

	public constructor(iterable: Iterable<T>);
	public constructor(values?: ReadonlyArray<T>);
	public constructor(entries: ReadonlyArray<T> | Iterable<T>, coerceValue: (value: T) => T);
	public constructor(entries?: ReadonlyArray<T> | Iterable<T>, coerceValue?: (value: T) => T) {
		super(entries);

		this.coerceValue = coerceValue;
	}

	public static from<U, T extends object = object>(iterable: Iterable<U>): ExtendedWeakSet<T>;
	public static from<U, T extends object = object>(iterable: Iterable<U>, mapfn: (value: U, index: number) => T): ExtendedWeakSet<T>;
	public static from<T extends object = object>(iterable: Iterable<any>, mapfn?: (value: any, index: number) => T): ExtendedWeakSet<T>;
	public static from<U, S, T extends object = object>(iterable: Iterable<U>, mapfn: (value: U, index: number) => T, thisArg: S): ExtendedWeakSet<T>;
	// prettier-ignore
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

	/**
	 * Determines whether the passed value is a `WeakSet`.
	 *
	 * @param arg The value to be checked.
	 * @returns `true` if the value is a `WeakSet`; otherwise `false`.
	 */
	public static isWeakSet(arg: any): arg is WeakSet<any>;
	public static isWeakSet<T extends object>(arg: any): arg is WeakSet<T>;
	public static isWeakSet(arg: any): arg is WeakSet<any> {
		return arg[Symbol.toStringTag] === 'WeakSet' && arg.toString() === '[object WeakSet]';
	}

	public static of(...args: any[]): ExtendedWeakSet<any>;
	public static of<T extends object>(...args: T[]): ExtendedWeakSet<T>;
	public static of<T extends object>(...args: T[]): ExtendedWeakSet<T> {
		return new ExtendedWeakSet<T>(args);
	}

	/**
	 * Appends a new object to the end of the `WeakSet`
	 *
	 * @param value The object to add to the `WeakSet`
	 * @returns The `WeakSet`
	 *
	 * @spec {@link https://tc39.es/ecma262/#sec-weakset.prototype.add ECMA-262}
	 */
	public add(value: T): this {
		return super.add(this.coerceValue?.(value) ?? value);
	}

	public addAll(...values: T[]): ExtendedWeakSet<T> {
		for (const value of values) {
			this.add(value);
		}

		return this;
	}

	/**
	 * Removes the specified element from the `WeakSet`
	 *
	 * @param value The object remove from the `WeakSet`
	 * @returns
	 * `true` if an element in the `WeakSet` has been removed successfully
	 * `false` if the `value` is not found in the `WeakSet` or if the `value` is not an object
	 *
	 * @spec {@link https://tc39.es/ecma262/#sec-weakset.prototype.delete ECMA-262}
	 */
	public delete(value: T): boolean {
		return super.delete(this.coerceValue?.(value) ?? value);
	}

	public deleteAll(...values: T[]): boolean {
		let finished = true;

		for (const value of values) {
			finished = finished && this.delete(value);
		}

		return !!finished;
	}

	/**
	 * Returns a boolean indicating whether an object exists in the `WeakSet` or not
	 *
	 * @param value The object to test for presence in the `WeakSet`
	 * @returns `true` if an element with the specified value exists in the `WeakSet`; otherwise `false`
	 *
	 * @spec {@link https://tc39.es/ecma262/#sec-weakset.prototype.has ECMA-262}
	 */
	public has(value: T): boolean {
		return super.has(this.coerceValue?.(value) ?? value);
	}
}
