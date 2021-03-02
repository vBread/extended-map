import { inspect, IterableCallback, IterableElements, Reducer } from './util';

/**
 * Stores unique elements of any type.
 *
 * @spec {@link https://tc39.es/ecma262/#sec-set-constructor|ECMA-262}
 */
export class ExtendedSet<T> extends Set<T> {
	private readonly coerceValue: (value: T) => T;

	/**
	 * The number of unique elements in the Set.
	 * @readonly
	 *
	 * @spec {@link https://tc39.es/ecma262/#sec-get-set.prototype.size|ECMA-262}
	 */
	public readonly size: number;

	/**
	 * @param iterable - An array or other iterable object.
	 *
	 * @spec {@link https://tc39.es/ecma262/#sec-set-iterable|ECMA-262}
	 */
	public constructor(iterable?: IterableElements<T>);

	/**
	 * @param iterable - An array or other iterable object.
	 * @param handler - An object containing a callback to normalize the values in the Set.
	 * Normalization is applied when placing an element.
	 *
	 * @spec {@link https://tc39.es/proposal-collection-normalization/#sec-set-iterable|Stage 2 ECMAScript Proposal}
	 */
	public constructor(iterable: IterableElements<T>, coerceValue: (value: T) => T);
	public constructor(iterable?: IterableElements<T>, coerceValue?: (value: T) => T) {
		super(iterable);

		this.coerceValue = coerceValue ?? ((value) => value);
	}

	private [inspect](): Set<T> {
		return new Set(this);
	}

	/**
	 * Creates a new Set from a set-like or iterable object.
	 *
	 * @param iterable - A set-like or iterable object to convert.
	 *
	 * @spec {@link https://tc39.es/proposal-setmap-offrom/#sec-set.from|Stage 1 ECMAScript Proposal}
	 */
	public static from(iterable: Iterable<any>): ExtendedSet<unknown>;
	public static from<U, T>(iterable: Iterable<U>): ExtendedSet<T>;

	/**
	 * Creates a new Set from a set-like or iterable object.
	 *
	 * @param iterable - A set-like or iterable object to convert.
	 * @param mapfn - A function to execute on each element.
	 *
	 * @spec {@link https://tc39.es/proposal-setmap-offrom/#sec-set.from|Stage 1 ECMAScript Proposal}
	 */
	public static from<U, T>(iterable: Iterable<U>, mapfn: (value: U, index: number) => T): ExtendedSet<T>;

	/**
	 * Creates a new Set from a set-like or iterable object.
	 *
	 * @param iterable - A set-like or iterable object to convert to a set.
	 * @param mapfn - A function to execute on each element.
	 * @param thisArg - A value to use as `this` when executing the callback.
	 *
	 * @spec {@link https://tc39.es/proposal-setmap-offrom/#sec-set.from|Stage 1 ECMAScript Proposal}
	 */
	/* prettier-ignore */
	public static from<U, S, T>(iterable: Iterable<U>, mapfn: (value: U, index: number) => T, thisArg: S): ExtendedSet<T>;
	/* prettier-ignore */
	public static from(iterable: Iterable<any>, mapfn?: (value: any, index: number) => unknown, thisArg: any = this): ExtendedSet<unknown> {
		const elements: unknown[] = [];
		let i = 0;

		for (const item of iterable) {
			if (mapfn) {
				elements.push(mapfn.call(thisArg, item, i++));
			} else {
				elements.push(item);
			}
		}

		return new ExtendedSet(elements);
	}

	/**
	 * Determines whether the passed value is a Set.
	 *
	 * @param arg - The value to check.
	 * @returns `true` if the value is a Set; otherwise `false`.
	 */
	public static isSet(arg: any): arg is Set<any>;
	public static isSet<T>(arg: any): arg is Set<T>;
	public static isSet(arg: any): arg is Set<any> {
		return arg[Symbol.toStringTag] === 'Set' && arg.toString() === '[object Set]';
	}

	/**
	 * Creates a new Set from a number of arguments.
	 *
	 * @param args - The elements to use during creation.
	 *
	 * @spec {@link https://tc39.es/proposal-setmap-offrom/#sec-set.of|Stage 1 ECMAScript Proposal}
	 */
	public static of(...args: any[]): ExtendedSet<any>;
	public static of<T>(...args: T[]): ExtendedSet<T>;
	public static of(...args: any[]): ExtendedSet<unknown> {
		return new ExtendedSet(args);
	}

	/**
	 * Appends a new element with a specified value to the end of the Set.
	 *
	 * @param value - The value of the element to add.
	 *
	 * @spec {@link https://tc39.es/ecma262/#sec-set.prototype.add|ECMA-262}
	 */
	public add(value: T): this {
		return super.add(this.coerceValue?.(value) ?? value);
	}

	/**
	 * Appeneds a new element for each specified value to the end of the Set.
	 *
	 * @param values - The values of the elements to add.
	 */
	public addAll(...values: T[]): this {
		for (const value of values) {
			this.add(value);
		}

		return this;
	}

	/**
	 * Returns the element at the specified zero-based and negative inclusive index.
	 *
	 * @param index - The index of the element to return.
	 */
	public at(index: number): T | undefined {
		index = Math.trunc(index) ?? 0;

		if (index < 0) {
			index += this.size;
		}

		if (index < 0 || index >= this.size) {
			return undefined;
		}

		return [...this.keys()][index];
	}

	/**
	 * Removes all elements.
	 *
	 * @spec {@link https://tc39.es/ecma262/#sec-set.prototype.clear|ECMA-262}
	 */
	public clear(): void {
		return super.clear();
	}

	/**
	 * Copies the elements of a Set to an array.
	 *
	 * @param target - The one-dimensional array that is the destination of the elements copied
	 * from the Set.
	 */
	public copyTo(target: T[]): T[];

	/**
	 * Copies the elements of a Set to an array, starting at the specified array index.
	 *
	 * @param target - The one-dimensional array that is the destination of the elements copied
	 * from the Set.
	 * @param start - The zero-based index of `target` at which copying begins.
	 */
	public copyTo(target: T[], start: number): T[];

	/**
	 * Copies the specified number of elements of a Set to an array, starting at the specified array index.
	 *
	 * @param target - The one-dimensional array that is the destination of the elements copied
	 * from the Set.
	 * @param start - The zero-based index of `target` at which copying begins.
	 * @param count - The number of elements to copy to `target`.
	 */
	public copyTo(target: T[], start: number, count: number): T[];
	public copyTo(target: any[], start?: number, count?: number): T[] {
		return target.splice(start ?? target.length, 0, [...this.keys()].slice(0, count ?? this.size));
	}

	/**
	 * Removes the specified element.
	 *
	 * @param value - The element to remove.
	 * @returns `true` if the element existed and has been removed, or `false` if the element
	 * doesn't exist.
	 *
	 * @spec {@link https://tc39.es/ecma262/#sec-set.prototype.delete|ECMA-262}
	 */
	public delete(value: T): boolean {
		return super.delete(this.coerceValue?.(value) ?? value);
	}

	/**
	 * Removes the specified elements.
	 *
	 * @param values - The elements to remove.
	 * @returns `true` if each element existed and have been removed, or `false` if an element
	 * didn't exist.
	 */
	public deleteAll(...values: T[]): boolean {
		let finished = true;

		for (const value of values) {
			finished = finished && this.delete(value);
		}

		return !!finished;
	}

	/**
	 *
	 * @param iterable -
	 * @returns
	 */
	public difference(iterable: Iterable<T>): ExtendedSet<T>;
	public difference<U>(iterable: Iterable<U>): ExtendedSet<T>;
	public difference(iterable: Iterable<any>): ExtendedSet<T> {
		const set = new ExtendedSet<T>(this);

		for (const item of iterable) {
			set.delete(item);
		}

		return set;
	}

	/**
	 * Tests whether all elements pass the test implemented by a provided function.
	 *
	 * @param predicate - A function to execute on each element.
	 * @returns `true` if the callback returns truthy for at least one element; otherwise, `false`.
	 */
	public every(predicate: IterableCallback<T, T, this, boolean>): boolean;

	/**
	 * Tests whether all elements pass the test implemented by a provided function.
	 *
	 * @param predicate - A function to execute for each element.
	 * @param thisArg - A value to use as `this` when executing the callback.
	 * @returns `true` if the callback returns truthy for at least one element; otherwise, `false`.
	 */
	public every<T>(predicate: IterableCallback<T, T, this, boolean>, thisArg: T): boolean;
	public every(predicate: IterableCallback<T, T, this, boolean>, thisArg: any = this): boolean {
		for (const value of this) {
			if (!predicate.call(thisArg, value, value, this)) {
				return false;
			}
		}

		return true;
	}

	/**
	 * Creates a new Set with all elements that pass the test implemented by a provided function.
	 *
	 * @param predicate - A function to execute on each element.
	 */
	public filter(predicate: IterableCallback<T, T, this, boolean>): ExtendedSet<T>;

	/**
	 * Creates a new Set with all elements that pass the test implemented by a provided function.
	 *
	 * @param predicate - A function to execute on each element.
	 * @param thisArg - A value to use as `this` when executing the callback.
	 */
	public filter<U>(predicate: IterableCallback<T, T, this, boolean>, thisArg: U): ExtendedSet<T>;
	public filter(predicate: IterableCallback<T, T, this, boolean>, thisArg: any = this): ExtendedSet<T> {
		const set = new ExtendedSet<T>();

		for (const value of this) {
			if (predicate.call(thisArg, value, value, this)) {
				set.add(value);
			}
		}

		return set;
	}

	/**
	 * Returns the first element that satisfies a provided function.
	 *
	 * @param predicate - A function to excute on each element.
	 */
	public find(predicate: IterableCallback<T, T, this, boolean>): T | undefined;

	/**
	 * Returns the first element that satisfies a provided function.
	 *
	 * @param predicate - A function to excute on each element.
	 * @param thisArg - A value to use as `this` when executing the callback.
	 */
	public find<U>(predicate: IterableCallback<T, T, this, boolean>, thisArg: U): T | undefined;
	public find(predicate: IterableCallback<T, T, this, boolean>, thisArg: any = this): T | undefined {
		for (const value of this) {
			if (predicate.call(thisArg, value, value, this)) {
				return value;
			}
		}

		return undefined;
	}

	/**
	 * Executes a provided function once for each element, in insertion order.
	 *
	 * @param callbackfn - A function to execute on each element.
	 *
	 * @spec {@link https://tc39.es/ecma262/#sec-set.prototype.foreach|ECMA-262}
	 */
	public forEach(callbackfn: IterableCallback<T, T, this, void>): void;

	/**
	 * Executes a provided function once for each element, in insertion order.
	 *
	 * @param callbackfn - A function to execute on each element.
	 * @param thisArg - A value to use as `this` when executing the callback.
	 *
	 * @spec {@link https://tc39.es/ecma262/#sec-set.prototype.foreach|ECMA-262}
	 */
	public forEach<U>(callbackfn: IterableCallback<T, T, this, void>, thisArg: U): void;
	public forEach(callbackfn: IterableCallback<T, T, this, void>, thisArg: any = this): void {
		return super.forEach(callbackfn, thisArg);
	}

	/**
	 * Indicates if an element exists.
	 *
	 * @param value - The value of the element to test for presence.
	 * @returns `true` if an element exists; otherwise `false`.
	 *
	 * @spec {@link https://tc39.es/ecma262/#sec-set.prototype.has|ECMA-262}
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
		return [...this.keys()].join(separator);
	}

	/**
	 * Creates a new Set populated with the results of calling a provided function on each element.
	 *
	 * @param callbackfn - A function to execute on each element.
	 */
	public map(callbackfn: IterableCallback<T, T, this, any>): ExtendedSet<T>;
	public map<T>(callbackfn: IterableCallback<T, T, this, T>): ExtendedSet<T>;

	/**
	 * Creates a new Set populated with the results of calling a provided function on each element.
	 *
	 * @param callbackfn - A function to execute on each element.
	 * @param thisArg - A value to use as `this` when executing the callback.
	 */
	public map<U>(callbackfn: IterableCallback<T, T, this, any>, thisArg: U): ExtendedSet<T>;
	public map<T, U>(callbackfn: IterableCallback<T, T, this, T>, thisArg: U): ExtendedSet<T>;
	public map(callbackfn: IterableCallback<T, T, this, any>, thisArg: any = this): ExtendedSet<T> {
		const set = new ExtendedSet<T>();

		for (const value of this) {
			set.add(callbackfn.call(thisArg, value, value, this));
		}

		return set;
	}

	/**
	 * Creates two new Sets with elements that failed or passed a provided function respectively.
	 *
	 * @param predicate - A function to execute on each element.
	 */
	public partition(predicate: IterableCallback<T, T, this, boolean>): [ExtendedSet<T>, ExtendedSet<T>];

	/**
	 * Creates two new Sets with elements that failed or passed a provided function respectively.
	 *
	 * @param predicate - A function to execute on each element.
	 * @param thisArg - A value to use as `this` when executing the callback.
	 */
	/* prettier-ignore */
	public partition<U>(predicate: IterableCallback<T, T, this, boolean>, thisArg: U): [ExtendedSet<T>, ExtendedSet<T>];
	/* prettier-ignore */
	public partition(predicate: IterableCallback<T, T, this, boolean>, thisArg: any = this): [ExtendedSet<T>, ExtendedSet<T>] {
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

	/**
	 * Returns a random element.
	 */
	public random(): T;

	/**
	 * Returns a specified amount of random elements.
	 *
	 * @param amount - The amount of elements to return.
	 */
	public random(amount: number): T[];
	public random(amount: number = 1): T | T[] {
		const elements = [...this.values()];
		const results: T[] = [];

		for (let i = 0; i < amount; i++) {
			results.push(elements[Math.floor(Math.random() * elements.length)]);
		}

		if (results.length <= 1) {
			return results[1] ?? results[0];
		}

		return results;
	}

	/**
	 * Executes a provided function on each element, resulting in a single output value.
	 *
	 * @param callbackfn - A function to execute on each element excluding the first.
	 * @returns The single value that results from the reduction.
	 */
	public reduce(callbackfn: Reducer<T, T, this>): T;
	public reduce<U>(callbackfn: Reducer<T, T, this, U>): U;

	/**
	 * Executes a provided function on each element, resulting in a single output value.
	 *
	 * @param callbackfn - A function to execute on each element excluding the first.
	 * @param initialValue - A value to use as the first argument to the first call of the callback.
	 * If no `initialValue` is provided, the first value will be used as the initial accumulator
	 * value and skipped as `value`.
	 * @returns The single value that results from the reduction.
	 */
	public reduce(callbackfn: Reducer<T, T, this>, initialValue: T): T;
	public reduce<U>(callbackfn: Reducer<T, T, this, U>, initialValue: U): U;
	public reduce(callbackfn: Reducer<T, T, this>, initialValue?: T): T {
		if (this.size === 0 && !initialValue) {
			throw new TypeError('Cannot reduce an empty Set with no initialValue');
		}

		let accumulator = initialValue ?? undefined;

		for (const value of this) {
			if (accumulator) {
				accumulator = callbackfn(accumulator, value, value, this);
			} else {
				accumulator = value;
			}
		}

		return accumulator;
	}

	/**
	 * Tests whether at least one element passes the test implemented by a provided function.
	 *
	 * @param predicate - A function to execute on each element.
	 * @returns `true` if the callback returns truthy for at least one element; otherwise, `false`.
	 */
	public some(predicate: IterableCallback<T, T, this, boolean>): boolean;

	/**
	 * Tests whether at least one element passes the test implemented by a provided function.
	 *
	 * @param predicate - A function to execute on each element.
	 * @param thisArg - A value to use as `this` when executing the callback.
	 * @returns `true` if the callback returns truthy for at least one element; otherwise, `false`.
	 */
	public some<T>(predicate: IterableCallback<T, T, this, boolean>, thisArg: T): boolean;
	public some(predicate: IterableCallback<T, T, this, boolean>, thisArg: any = this): boolean {
		for (const value of this) {
			if (predicate.call(thisArg, value, value, this)) {
				return true;
			}
		}

		return false;
	}

	/**
	 * Creates a new Set with elements that are in either the original Set or `iterable`, but not in
	 * their intersection.
	 *
	 * @param iterable -
	 */
	public symmetricDifference(iterable: Iterable<T>): ExtendedSet<T>;
	public symmetricDifference<U>(iterable: Iterable<U>): ExtendedSet<T>;
	public symmetricDifference(iterable: Iterable<any>): ExtendedSet<T> {
		const set = new ExtendedSet<T>(this);

		for (const item of iterable) {
			set.delete(item) || set.add(item);
		}

		return set;
	}

	/**
	 * Creates a new Set from the unique elements in the original Set and `iterable`.
	 *
	 * @param iterable -
	 */
	public union(iterable: Iterable<T>): ExtendedSet<T>;
	public union<U>(iterable: Iterable<U>): ExtendedSet<T>;
	public union(iterable: Iterable<any>): ExtendedSet<T> {
		return new ExtendedSet<T>([...this, ...iterable]);
	}
}
