import { inspect } from './util/constants';

/**
 * Stores unique values of any type, whether primitive values or object references
 *
 * @spec {@link https://tc39.es/ecma262/#sec-set-constructor ECMA-262}
 */
export class ExtendedSet<T> extends Set<T> {
	private readonly coerceValue: (value: T) => T;

	/**
	 * The number of (unique) elements in the `Set`
	 * @readonly
	 *
	 * @spec {@link https://tc39.es/ecma262/#sec-get-set.prototype.size ECMA-262}
	 */
	public readonly size: number;

	public constructor(iterable?: Iterable<T>);
	public constructor(values?: ReadonlyArray<T>);
	public constructor(entries: Iterable<T> | ReadonlyArray<T>, coerceValue: (value: T) => T);
	public constructor(entries?: Iterable<T> | ReadonlyArray<T>, coerceValue?: (value: T) => T) {
		super(entries);

		this.coerceValue = coerceValue;
	}

	private [inspect]() {
		return new Set(this);
	}

	public static from<U, T = any>(iterable: Iterable<U>): ExtendedSet<T>;
	public static from<U, T = any>(iterable: Iterable<U>, mapfn: (value: U, index: number) => T): ExtendedSet<T>;
	public static from<T>(iterable: Iterable<any>, mapfn?: (value: any, index: number) => T): ExtendedSet<T>;
	public static from<U, S, T = any>(iterable: Iterable<U>, mapfn: (value: U, index: number) => T, thisArg: S): ExtendedSet<T>;
	public static from<T = any>(iterable: Iterable<any>, mapfn?: (value: any, index: number) => T, thisArg: any = this): ExtendedSet<T> {
		const entries: T[] = [];
		let i = 0;

		for (const item of iterable) {
			if (mapfn) {
				entries.push(mapfn.call(thisArg, item, i++));
			} else {
				entries.push(item);
			}
		}

		return new ExtendedSet<T>(entries);
	}

	public static isSet(arg: any): arg is Set<any>;
	public static isSet<T>(arg: any): arg is Set<T>;
	public static isSet(arg: any): arg is Set<any> {
		const methods = ['has', 'add', 'forEach', 'delete', 'keys', 'values', 'entries', 'clear'];

		// prettier-ignore
		return (
			arg
			&& 'size' in arg
			&& typeof arg.size === 'number'
			&& arg[Symbol.toStringTag] === 'Set'
			&& methods.every((method) => method in arg && typeof arg[method] === 'function')
		)
	}

	public static of(...args: any[]): ExtendedSet<any>;
	public static of<T>(...args: T[]): ExtendedSet<T>;
	public static of<T>(...args: T[]): ExtendedSet<T> {
		return new ExtendedSet<T>(args);
	}

	/**
	 * Appends a new element with a specified value to the end of the `Set`
	 *
	 * @param value The value of the element to add to the `Set`
	 * @returns The `Set` with the added value
	 *
	 * @spec {@link https://tc39.es/ecma262/#sec-set.prototype.add ECMA-262}
	 */
	public add(value: T): this {
		return super.add(this.coerceValue?.(value) ?? value);
	}

	public at(index: number): T | undefined {
		index = Math.trunc(index) ?? 0;

		if (index < 0) {
			index += this.size;
		}

		if (index < 0 || index >= this.size) {
			return undefined;
		}

		return this.toArray()[index];
	}

	public addAll(...values: T[]): this {
		for (const value of values) {
			this.add(value);
		}

		return this;
	}

	/**
	 * Removes all elements from the `Set`
	 *
	 * @spec {@link https://tc39.es/ecma262/#sec-set.prototype.clear ECMA-262}
	 */
	public clear(): void {
		return super.clear();
	}

	public copyTo(target: T[]): T[];
	public copyTo(target: T[], start: number): T[];
	public copyTo(target: T[], start: number, count: number): T[];
	public copyTo(target: any[], start?: number, count?: number): T[] {
		return target.splice(start ?? target.length, 0, ...this.toArray().slice(0, count ?? this.size));
	}

	/**
	 * Removes a specified value from the `Set`, if it is in the set
	 *
	 * @param value The value to remove from the `Set`
	 * @returns `true` if `value` was already in the `Set`; otherwise `false`
	 *
	 * @spec {@link https://tc39.es/ecma262/#sec-set.prototype.delete ECMA-262}
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

	public difference(iterable: Iterable<T>): ExtendedSet<T>;
	public difference<U>(iterable: Iterable<U>): ExtendedSet<T>;
	public difference(iterable: Iterable<any>): ExtendedSet<T> {
		const set = new ExtendedSet<T>(this);

		for (const item of iterable) {
			set.delete(item);
		}

		return set;
	}

	public every(predicate: (value: T, key: T, set: this) => boolean): boolean;
	public every<T>(predicate: (value: T, key: T, set: this) => boolean, thisArg: T): boolean;
	public every(predicate: (value: T, key: T, set: this) => boolean, thisArg: any = this): boolean {
		for (const value of this) {
			if (!predicate.call(thisArg, value, value, this)) {
				return false;
			}
		}

		return true;
	}

	public filter(predicate: (value: T, key: T, set: this) => boolean): ExtendedSet<T>;
	public filter<U>(predicate: (value: T, key: T, set: this) => boolean, thisArg: U): ExtendedSet<T>;
	public filter(predicate: (value: T, key: T, set: this) => boolean, thisArg: any = this): ExtendedSet<T> {
		const set = new ExtendedSet<T>();

		for (const value of this) {
			if (predicate.call(thisArg, value, value, this)) {
				set.add(value);
			}
		}

		return set;
	}

	public filterOut(predicate: (value: T, key: T, set: this) => boolean): ExtendedSet<T>;
	public filterOut<U>(predicate: (value: T, key: T, set: this) => boolean, thisArg: U): ExtendedSet<T>;
	public filterOut(predicate: (value: T, key: T, set: this) => boolean, thisArg: any = this): ExtendedSet<T> {
		const set = new ExtendedSet<T>();

		for (const value of this) {
			if (!predicate.call(thisArg, value, value, this)) {
				set.add(value);
			}
		}

		return set;
	}

	public find(predicate: (value: T, key: T, set: this) => boolean): T | undefined;
	public find<U>(predicate: (value: T, key: T, set: this) => boolean, thisArg: U): T | undefined;
	public find(predicate: (value: T, key: T, set: this) => boolean, thisArg: any = this): T | undefined {
		for (const value of this) {
			if (predicate.call(thisArg, value, value, this)) {
				return value;
			}
		}

		return undefined;
	}

	/**
	 * Executes a provided function once for each value in the `Set`, in insertion order
	 *
	 * @param callbackfn Function to execute for each element, taking three arguments
	 * 		  - `value`, `key`: The current element being processed in the `Set`.
	 * 			 As there are no keys in `Set`, the value is passed for both arguments
	 * 		  - `set`: The `Set` which `forEach()` was called upon
	 * @param thisArg Value to use as `this` when executing `callback`
	 *
	 * @spec {@link https://tc39.es/ecma262/#sec-set.prototype.foreach ECMA-262}
	 */
	public forEach<U = any>(callbackfn: (value: T, key: T, set: this) => U): void;
	public forEach<U>(callbackfn: (value: T, key: T, set: this) => any, thisArg: U): void;
	public forEach<R, U>(callbackfn: (value: T, key: T, set: this) => R, thisArg: U): void;
	public forEach(callbackfn: (value: T, key: T, set: this) => any, thisArg: any = this): void {
		return super.forEach(callbackfn, thisArg);
	}

	/**
	 * Returns a boolean indicating whether an element with the specified value exists in the `Set` or not
	 *
	 * @param value The value to test for presence in the `Set`
	 * @returns `true` if an element with the specified value exists in the `Set`; otherwise `false`
	 *
	 * @spec {@link https://tc39.es/ecma262/#sec-set.prototype.has ECMA-262}
	 */
	public has(value: T): boolean {
		return super.has(this.coerceValue?.(value) ?? value);
	}

	public intersection(iterable: Iterable<T>): ExtendedSet<T>;
	public intersection<U>(iterable: Iterable<U>): ExtendedSet<T>;
	public intersection(iterable: Iterable<any>): ExtendedSet<T> {
		const set = new ExtendedSet<T>(this);

		for (const item of iterable) {
			if (this.has(item)) {
				set.add(item);
			}
		}

		return set;
	}

	public isDisjointFrom(iterable: Iterable<T>): boolean;
	public isDisjointFrom<U>(iterable: Iterable<U>): boolean;
	public isDisjointFrom(iterable: Iterable<any>): boolean {
		for (const item of iterable) {
			if (this.has(item)) {
				return false;
			}
		}

		return true;
	}

	public isSubsetOf(iterable: Iterable<T>): boolean;
	public isSubsetOf<U>(iterable: Iterable<U>): boolean;
	public isSubsetOf(iterable: Iterable<any>): boolean {
		const set = new Set([...iterable]);

		for (const item of iterable) {
			if (!set.has(item)) {
				return false;
			}
		}

		return true;
	}

	public isSupersetOf(iterable: Iterable<T>): boolean;
	public isSupersetOf<U>(iterable: Iterable<U>): boolean;
	public isSupersetOf(iterable: Iterable<any>): boolean {
		for (const item of iterable) {
			if (!this.has(item)) {
				return false;
			}
		}

		return true;
	}

	public join(separator: string = ','): string {
		return this.toArray().join(separator);
	}

	public map(callbackfn: (value: T, key: T, set: this) => any): ExtendedSet<T>;
	public map<T>(callbackfn: (value: T, key: T, set: this) => T): ExtendedSet<T>;
	public map<U>(callbackfn: (value: T, key: T, set: this) => any, thisArg: U): ExtendedSet<T>;
	public map<T, U>(callbackfn: (value: T, key: T, set: this) => T, thisArg: U): ExtendedSet<T>;
	public map(callbackfn: (value: T, key: T, set: this) => any, thisArg: any = this): ExtendedSet<T> {
		const set = new ExtendedSet<T>();

		for (const value of this) {
			set.add(callbackfn.call(thisArg, value, value, this));
		}

		return set;
	}

	public partition(predicate: (value: T, key: T, set: this) => boolean): [ExtendedSet<T>, ExtendedSet<T>];
	public partition<U>(predicate: (value: T, key: T, set: this) => boolean, thisArg: U): [ExtendedSet<T>, ExtendedSet<T>];
	public partition(predicate: (value: T, key: T, set: this) => boolean, thisArg: any = this): [ExtendedSet<T>, ExtendedSet<T>] {
		const [passed, failed] = [new ExtendedSet<T>(), new ExtendedSet<T>()];

		for (const value of this) {
			if (predicate.call(thisArg, value, value, this)) {
				passed.add(value);
			} else {
				failed.add(value);
			}
		}

		return [passed, failed];
	}

	public reduce<U>(callbackfn: (memo: U, value: T, key: T, set: this) => U): U;
	public reduce<U>(callbackfn: (memo: U, value: T, key: T, set: this) => U, initialValue: U): U;
	public reduce<U>(callbackfn: (memo: U, value: T, key: T, set: this) => U, initialValue?: U): U {
		let initial: boolean = !!initialValue;
		let accumulator = initial ? initialValue : undefined;

		for (const value of this) {
			if (initial) {
				accumulator = callbackfn(accumulator, value, value, this);
			} else {
				initial = false;
				accumulator = (value as unknown) as U;
			}
		}

		return accumulator;
	}

	public some(predicate: (value: T, key: T, set: this) => boolean): boolean;
	public some<T>(predicate: (value: T, key: T, set: this) => boolean, thisArg: T): boolean;
	public some(predicate: (value: T, key: T, set: this) => boolean, thisArg: any = this): boolean {
		for (const value of this) {
			if (predicate.call(thisArg, value, value, this)) {
				return true;
			}
		}

		return false;
	}

	public symmetricDifference(iterable: Iterable<T>): ExtendedSet<T>;
	public symmetricDifference<U>(iterable: Iterable<U>): ExtendedSet<T>;
	public symmetricDifference(iterable: Iterable<any>): ExtendedSet<T> {
		const set = new ExtendedSet<T>(this);

		for (const item of iterable) {
			set.delete(item) || set.add(item);
		}

		return set;
	}

	public toArray(): T[] {
		return [...this.values()];
	}

	public union(iterable: Iterable<T>): ExtendedSet<T>;
	public union<U>(iterable: Iterable<U>): ExtendedSet<T>;
	public union(iterable: Iterable<any>): ExtendedSet<T> {
		return new ExtendedSet<T>([...this, ...iterable]);
	}
}
