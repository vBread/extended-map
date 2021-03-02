import { inspect } from './util/constants';
import {
	CoercionHandler,
	Comparator,
	EmplaceHandler,
	Indexer,
	IterableCallback,
	IterableEntries,
	Reducer,
	Resolver,
	ValueResolver,
} from './util/types';

/**
 * Holds key-value pairs and remembers the original insertion order of the keys.
 * @public
 *
 * @spec {@link https://tc39.es/ecma262/#sec-map-objects|ECMA-262}
 */
export class ExtendedMap<K, V> extends Map<K, V> {
	private readonly coerceKey: (key: K) => K;
	private readonly coerceValue: (value: V) => V;

	/**
	 * The number of entries in the Map.
	 * @readonly
	 *
	 * @spec {@link https://tc39.es/ecma262/#sec-get-map.prototype.size|ECMA-262}
	 */
	public readonly size: number;

	/**
	 * @param iterable - An array or other iterable object whose entries are key-value pairs.
	 *
	 * @spec {@link https://tc39.es/ecma262/#sec-map-iterable|ECMA-262}
	 */
	public constructor(iterable?: IterableEntries<K, V>);

	/**
	 * @param iterable - An array or other iterable object whose entries are key-value pairs.
	 * @param handler - An object containing callbacks to normalize the Map's entries. Normalization
	 * is applied when data is incoming to find the identity of a key location and when placing a
	 * value.
	 *
	 * @spec {@link https://tc39.es/proposal-collection-normalization/#sec-map-iterable|Stage 2 ECMAScript Proposal}
	 */
	public constructor(iterable: IterableEntries<K, V>, handler: CoercionHandler<K, V>);
	public constructor(iterable?: IterableEntries<K, V>, handler?: CoercionHandler<K, V>) {
		super(iterable);

		this.coerceKey = handler?.coerceKey ?? ((key) => key);
		this.coerceValue = handler?.coerceValue ?? ((value) => value);
	}

	private [inspect](): Map<K, V> {
		return new Map(this);
	}

	/**
	 * Creates a new Map from a map-like or iterable object.
	 *
	 * @param iterable - A map-like or iterable object to convert.
	 *
	 * @spec {@link https://tc39.es/proposal-setmap-offrom/#sec-map.from|Stage 1 ECMAScript Proposal}
	 */
	public static from(iterable: Iterable<any>): ExtendedMap<unknown, unknown>;
	public static from<T, K, V>(iterable: Iterable<T>): ExtendedMap<K, V>;

	/**
	 * Creates a new Map from a map-like or iterable object.
	 *
	 * @param iterable - A map-like or iterable object to convert.
	 * @param mapfn - A function to execute on each entry.
	 *
	 * @spec {@link https://tc39.es/proposal-setmap-offrom/#sec-map.from|Stage 1 ECMAScript Proposal}
	 */
	/* prettier-ignore */
	public static from<T, K, V>(iterable: Iterable<T>, mapfn: (value: T, index: number) => [K, V]): ExtendedMap<K, V>;

	/**
	 * Creates a new Map from a map-like or iterable object.
	 *
	 * @param iterable - A map-like or iterable object to convert to a map.
	 * @param mapfn - A function to execute on each entry.
	 * @param thisArg - A value to use as `this` when executing the callback.
	 *
	 * @spec {@link https://tc39.es/proposal-setmap-offrom/#sec-map.from|Stage 1 ECMAScript Proposal}
	 */
	/* prettier-ignore */
	public static from<T, U, K, V>(iterable: Iterable<T>, mapfn: (value: T, index: number) => [K, V], thisArg: U): ExtendedMap<K, V>;
	/* prettier-ignore */
	public static from(iterable: Iterable<any>, mapfn?: (value: any, index: number) => [unknown, unknown], thisArg: any = this): ExtendedMap<unknown, unknown> {
		const entries: [unknown, unknown][] = [];
		let i = 0;

		for (const item of iterable) {
			if (mapfn) {
				entries.push(mapfn.call(thisArg, item, i++));
			} else {
				entries.push(item);
			}
		}

		return new ExtendedMap(entries);
	}

	/**
	 * Creates a new Map with the keys derived from the results of a provided function and the values
	 * being an array of entries in `iterable` that created the key.
	 *
	 * @param iterable - An array or other iterable object for the keys to derive from.
	 * @param keyDerivative - A function to create the derived keys.
	 */
	/* prettier-ignore */
	public static groupBy(iterable: Iterable<any>, keyDerivative: (value: any) => any): ExtendedMap<unknown, unknown[]>
	/* prettier-ignore */
	public static groupBy<T>(iterable: Iterable<T>, keyDerivative: (value: T) => any): ExtendedMap<unknown, T[]>;
	public static groupBy<T, U>(iterable: Iterable<T>, keyDerivative: (value: T) => U): ExtendedMap<U, T[]>;
	/* prettier-ignore */
	public static groupBy(iterable: Iterable<any>, keyDerivative: (value: any) => any): ExtendedMap<unknown, unknown[]> {
		const map = new ExtendedMap<unknown, unknown[]>();

		for (const item of iterable) {
			map.emplace(keyDerivative(item), {
				insert: () => [item],
				update: (value: any[]) => {
					value.push(item);
					return value;
				}
			});
		}

		return map;
	}

	/**
	 * Determines whether the passed value is a Map.
	 *
	 * @param arg - The value to check.
	 * @returns `true` if the value is a Map; otherwise `false`.
	 */
	public static isMap(arg: any): arg is Map<any, any>;
	public static isMap<K, V>(arg: any): arg is Map<K, V>;
	public static isMap(arg: any): arg is Map<any, any> {
		return arg[Symbol.toStringTag] === 'Map' && arg.toString() === '[object Map]';
	}

	public static keyBy(iterable: Iterable<any>): ExtendedMap<unknown, unknown[]>;
	public static keyBy<T>(iterable: Iterable<T>): ExtendedMap<unknown, T[]>;
	/* prettier-ignore */
	public static keyBy<T>(iterable: Iterable<T>, keyDerivative: (value: T) => T[]): ExtendedMap<unknown, T[]>;
	/* prettier-ignore */
	public static keyBy(iterable: Iterable<any>, keyDerivative?: (value: any) => any): ExtendedMap<unknown, unknown[]> {
		const map = new ExtendedMap<unknown, unknown[]>();

		for (const item of iterable) {
			map.set(keyDerivative(item), item);
		}

		return map;
	}

	/**
	 * Creates a new Map from a number of arguments.
	 *
	 * @param args - The entries to use during creation.
	 *
	 * @spec {@link https://tc39.es/proposal-setmap-offrom/#sec-map.of|Stage 1 ECMAScript Proposal}
	 */
	public static of(...args: ReadonlyArray<[unknown, unknown]>): ExtendedMap<unknown, unknown>;
	public static of<K, V>(...args: ReadonlyArray<[K, V]>): ExtendedMap<K, V>;
	public static of(...args: ReadonlyArray<[unknown, unknown]>): ExtendedMap<unknown, unknown> {
		return new ExtendedMap(args);
	}

	/**
	 * Returns the entry at the specified zero-based and negative inclusive index.
	 *
	 * @param index - The index of the entry to return.
	 */
	public at(index: number): [K, V] | undefined {
		index = Math.trunc(index) ?? 0;

		if (index < 0) {
			index += this.size;
		}

		if (index < 0 || index >= this.size) {
			return undefined;
		}

		return [...this][index];
	}

	/**
	 * Removes all entries.
	 *
	 * @spec {@link https://tc39.es/ecma262/#sec-map.prototype.clear|ECMA-262}
	 */
	public clear(): void {
		return super.clear();
	}

	/**
	 * Removes the specified entry by key.
	 *
	 * @param key - The key of the entry to remove.
	 * @returns `true` if an entry existed and has been removed, or `false` if the entry doesn't
	 * exist.
	 *
	 * @spec {@link https://tc39.es/ecma262/#sec-map.prototype.delete|ECMA-262}
	 */
	public delete(key: K): boolean {
		return super.delete(this.coerceKey(key));
	}

	/**
	 * Removes the specified entries by their key.
	 *
	 * @param keys - The keys of the entries to remove.
	 * @returns `true` if each entry existed and have been removed, or `false` if an entry
	 * didn't exist.
	 */
	public deleteAll(...keys: K[]): boolean {
		let finished = true;

		for (const key of keys) {
			finished = finished && this.delete(key);
		}

		return !!finished;
	}

	/**
	 * Adds a value if something doesn't already exist at `key` or updates an existing
	 * value at `key`.
	 *
	 * @param key - The key of the entry to add or update.
	 * @param handler - An object containing callbacks defining the insertion and update behavior
	 * if the value exists or not.
	 * @returns The value inserted or updated.
	 */
	public emplace(key: K, handler: EmplaceHandler<K, V>): V {
		if (!Reflect.has(handler, 'update') && !Reflect.has(handler, 'insert')) {
			throw new ReferenceError('At least one callback must be provided.');
		}

		const value =
			this.has(key) && Reflect.has(handler, 'update')
				? handler.update(this.get(key), this.coerceKey(key), this as any)
				: handler.insert(this.coerceKey(key), this as any);

		this.set(key, value);

		return value;
	}

	/**
	 * Tests whether all entries pass the test implemented by a provided function.
	 *
	 * @param predicate - A function to execute for each entry.
	 * @returns `true` if the callback returns truthy for at least one entry; otherwise, `false`.
	 */
	public every(predicate: IterableCallback<K, V, this, boolean>): boolean;

	/**
	 * Tests whether all entries pass the test implemented by a provided function.
	 *
	 * @param predicate - A function to execute on each entry.
	 * @param thisArg - A value to use as `this` when executing the callback.
	 * @returns `true` if the callback returns truthy for at least one entry; otherwise, `false`.
	 */
	public every<T>(predicate: IterableCallback<K, V, this, boolean>, thisArg: T): boolean;
	public every(predicate: IterableCallback<K, V, this, boolean>, thisArg: any = this): boolean {
		for (const [key, value] of this) {
			if (!predicate.call(thisArg, value, key, this)) {
				return false;
			}
		}

		return true;
	}

	/**
	 * Creates a new Map with all entries that pass the test implemented by a provided function.
	 *
	 * @param predicate - A function to execute on each entry.
	 */
	public filter(predicate: IterableCallback<K, V, this, boolean>): ExtendedMap<K, V>;

	/**
	 * Creates a new Map with all entries that pass the test implemented by a provided function.
	 *
	 * @param predicate - A function to execute on each entry.
	 * @param thisArg - A value to use as `this` when executing the callback.
	 */
	public filter<T>(predicate: IterableCallback<K, V, this, boolean>, thisArg: T): ExtendedMap<K, V>;
	public filter(predicate: IterableCallback<K, V, this, boolean>, thisArg: any = this): ExtendedMap<K, V> {
		const map = new ExtendedMap<K, V>();

		for (const [key, value] of this) {
			if (predicate.call(thisArg, value, key, this)) {
				map.set(key, value);
			}
		}

		return map;
	}

	/**
	 * Returns the first value that satisfies a provided function.
	 *
	 * @param predicate - A function to execute on each entry.
	 * @returns The first value that satisfies the callback; otherwise `undefined`.
	 */
	public find(predicate: IterableCallback<K, V, this, boolean>): V | undefined;

	/**
	 * Returns the first value that satisfies a provided function.
	 *
	 * @param predicate - A function to execute on each entry.
	 * @param thisArg - A value to use as `this` when executing the callback.
	 * @returns The first value that satisfies the callback; otherwise `undefined`.
	 */
	public find<T>(predicate: IterableCallback<K, V, this, boolean>, thisArg: T): V | undefined;
	public find(predicate: IterableCallback<K, V, this, boolean>, thisArg: any = this): V | undefined {
		for (const [key, value] of this) {
			if (predicate.call(thisArg, value, key, this)) {
				return value;
			}
		}

		return undefined;
	}

	/**
	 * Returns the first key that satisfies a provided function.
	 *
	 * @param predicate - A function to execute on each entry.
	 * @returns The first key that satisfies the callback; otherwise `undefined`.
	 */
	public findKey(predicate: IterableCallback<K, V, this, boolean>): K | undefined;

	/**
	 * Returns the first key that satisfies a provided function.
	 *
	 * @param predicate - A function to execute on each entry.
	 * @param thisArg - A value to use as `this` when executing the callback.
	 * @returns The first key that satisfies the callback; otherwise `undefined`.
	 */
	public findKey<T>(predicate: IterableCallback<K, V, this, boolean>, thisArg: T): K | undefined;
	public findKey(predicate: IterableCallback<K, V, this, boolean>, thisArg: any = this): K | undefined {
		for (const [key, value] of this) {
			if (predicate.call(thisArg, value, key, this)) {
				return key;
			}
		}

		return undefined;
	}

	/**
	 * Executes a provided function once for each entry, in insertion order.
	 *
	 * @param callbackfn - A function to execute for each entry.
	 *
	 * @spec {@link https://tc39.es/ecma262/#sec-map.prototype.foreach|ECMA-262}
	 */
	public forEach(callbackfn: IterableCallback<K, V, this, void>): void;

	/**
	 * Executes a provided function once for each entry, in insertion order.
	 *
	 * @param callbackfn - A function to execute for each entry.
	 * @param thisArg - A value to use as `this` when executing the callback.
	 *
	 * @spec {@link https://tc39.es/ecma262/#sec-map.prototype.foreach|ECMA-262}
	 */
	public forEach<T>(callbackfn: IterableCallback<K, V, this, void>, thisArg: T): void;
	public forEach(callbackfn: IterableCallback<K, V, this, void>, thisArg: any = this): void {
		return super.forEach(callbackfn, thisArg);
	}

	/**
	 * Returns a specified value by its key.
	 *
	 * @param key - The key of the value to return.
	 * @returns The value associated with the specified key if found; otherwise `undefined`.
	 *
	 * @spec {@link https://tc39.es/ecma262/#sec-map.prototype.get|ECMA-262}
	 */
	public get(key: K): V | undefined {
		return super.get(this.coerceKey(key));
	}

	/**
	 * Indicates if a value with the specified key exists.
	 *
	 * @param key - The key of the value to test for presence.
	 * @returns `true` if a value with the specified key exists; otherwise `false`.
	 *
	 * @spec {@link https://tc39.es/ecma262/#sec-map.prototype.has|ECMA-262}
	 */
	public has(key: K): boolean {
		return super.has(this.coerceKey(key));
	}

	/**
	 * Indicates if a value with the specified `searchValue` exists.
	 *
	 * @param value - The value to test for presence.
	 * @returns `true` if a value with the specified `searchValue` exists; otherwise `false`.
	 */
	public includes(value: V): boolean {
		for (const _value of this.values()) {
			if (_value === value) {
				return true;
			}
		}

		return false;
	}

	/**
	 * Returns a specified key that is a key of `searchValue`.
	 *
	 * @param value - The value of the key to return.
	 * @returns The key associated with the specified value if it exists; otherwise `undefined`.
	 */
	public keyOf(value: V): K | undefined {
		for (const [key, _value] of this) {
			if (_value === value) {
				return key;
			}
		}

		return undefined;
	}

	/**
	 * Creates a new Map populated with the results of executing a provided function on each value.
	 *
	 * @param callbackfn - A function to execute on each value.
	 */
	public map(callbackfn: IterableCallback<K, V, this>): ExtendedMap<K, V>;
	public map<T>(callbackfn: IterableCallback<K, V, this, T>): ExtendedMap<K, V>;

	/**
	 * Creates a new Map populated with the results of executing a provided function on each value.
	 *
	 * @param callbackfn - A function to execute on each value.
	 * @param thisArg - A value to use as `this` when executing the callback.
	 */
	public map<U>(callbackfn: IterableCallback<K, V, this>, thisArg: U): ExtendedMap<K, V>;
	public map<T, U>(callbackfn: IterableCallback<K, V, this, T>, thisArg: U): ExtendedMap<K, V>;
	public map(callbackfn: IterableCallback<K, V, this>, thisArg: any = this): ExtendedMap<K, V> {
		const map = new ExtendedMap<K, V>();

		for (const [key, value] of this) {
			map.set(key, callbackfn.call(thisArg, value, key, this));
		}

		return map;
	}

	/**
	 * Creates a new Map populated with the results of calling the provided function on each key.
	 *
	 * @param callbackfn - A function to execute on each key.
	 */
	public mapKeys(callbackfn: IterableCallback<K, V, this>): ExtendedMap<K, V>;
	public mapKeys<T>(callbackfn: IterableCallback<K, V, this, T>): ExtendedMap<K, V>;

	/**
	 * Creates a new Map populated with the results of calling the provided function on each key.
	 *
	 * @param callbackfn - A function to execute on each key.
	 * @param thisArg - A value to use as `this` when executing the callback.
	 */
	public mapKeys<U>(callbackfn: IterableCallback<K, V, this>, thisArg: U): ExtendedMap<K, V>;
	public mapKeys<T, U>(callbackfn: IterableCallback<K, V, this, T>, thisArg: U): ExtendedMap<K, V>;
	public mapKeys(callbackfn: IterableCallback<K, V, this>, thisArg: any = this): ExtendedMap<K, V> {
		const map = new ExtendedMap<K, V>();

		for (const [key, value] of this) {
			map.set(callbackfn.call(thisArg, value, key, this), value);
		}

		return map;
	}

	/**
	 * Merges two or more Maps or other iterable objects. This modifies the original Map that
	 * `.merge()` was invoked with.
	 *
	 * @param iterables - Maps or other iterable objects to merge.
	 */
	public merge(...iterables: Iterable<[K, V]>[]): this;
	public merge<T>(...iterables: Iterable<T>[]): this;
	public merge(...iterables: Iterable<any>[]): this {
		for (const iterable of iterables) {
			for (const [key, value] of iterable) {
				this.set(key, value);
			}
		}

		return this;
	}

	/**
	 * Creates two new Maps with entries that failed or passed a provided function respectively.
	 *
	 * @param predicate - A function to execute on each entry.
	 */
	/* prettier-ignore */
	public partition(predicate: IterableCallback<K, V, this, boolean>): [ExtendedMap<K, V>, ExtendedMap<K, V>];

	/**
	 * Creates two new Maps with entries that failed or passed a provided function respectively.
	 *
	 * @param predicate - A function to execute on each entry.
	 * @param thisArg - A value to use as `this` when executing the callback.
	 */
	/* prettier-ignore */
	public partition<T>(predicate: IterableCallback<K, V, this, boolean>, thisArg: T): [ExtendedMap<K, V>, ExtendedMap<K, V>];
	/* prettier-ignore */
	public partition(predicate: IterableCallback<K, V, this, boolean>, thisArg: any = this): [ExtendedMap<K, V>, ExtendedMap<K, V>] {
		const [passed, failed] = [new ExtendedMap<K, V>(), new ExtendedMap<K, V>()];

		for (const [key, value] of this) {
			if (predicate.call(thisArg, value, value, this)) {
				passed.set(key, value);
			} else {
				failed.set(key, value);
			}
		}

		return [passed, failed];
	}

	/**
	 * Returns a random value.
	 */
	public random(): V;

	/**
	 * Returns a specified amount of random values.
	 *
	 * @param amount - The amount of values to return.
	 * @returns An array of random values.
	 */
	public random(amount: number): V[];
	public random(amount: number = 1): V | V[] {
		const entries = [...this.values()];
		const results: V[] = [];

		for (let i = 0; i < amount; i++) {
			results.push(entries[Math.floor(Math.random() * entries.length)]);
		}

		if (results.length <= 1) {
			return results[1] ?? results[0];
		}

		return results;
	}

	/**
	 * Returns a random key.
	 */
	public randomKey(): K;

	/**
	 * Returns a specified amount of random keys.
	 *
	 * @param amount - The amount of keys to return.
	 * @returns An array of random keys.
	 */
	public randomKey(amount: number): K[];
	public randomKey(amount: number = 1): K | K[] {
		const entries = [...this.keys()];
		const results: K[] = [];

		for (let i = 0; i < amount; i++) {
			results.push(entries[Math.floor(Math.random() * entries.length)]);
		}

		if (results.length <= 1) {
			return results[1] ?? results[0];
		}

		return results;
	}

	/**
	 * Executes a provided function on each entry, resulting in a single output value.
	 *
	 * @param callbackfn - A function to execute on each entry excluding the first.
	 * @returns The single value that results from the reduction.
	 */
	public reduce(callbackfn: Reducer<K, V, this>): V;
	public reduce<T>(callbackfn: Reducer<K, V, this, T>): T;

	/**
	 * Executes a provided function on each entry, resulting in a single output value.
	 *
	 * @param callbackfn - A function to execute on each entry excluding the first.
	 * @param initialValue - A value to use as the first argument to the first call of the callback.
	 * If no `initialValue` is provided, the first value will be used as the initial accumulator
	 * value and skipped as `value`.
	 * @returns The single value that results from the reduction.
	 */
	public reduce(callbackfn: Reducer<K, V, this>, initialValue: V): V;
	public reduce<T>(callbackfn: Reducer<K, V, this, T>, initialValue: T): T;
	public reduce(callbackfn: Reducer<K, V, this>, initialValue?: V): V {
		if (this.size === 0 && !initialValue) {
			throw new TypeError('Cannot reduce an empty Map with no initialValue');
		}

		let accumulator = initialValue ?? undefined;

		for (const [key, value] of this) {
			if (accumulator) {
				accumulator = callbackfn(accumulator, value, key, this);
			} else {
				accumulator = value;
			}
		}

		return accumulator;
	}

	/**
	 * Adds or updates an entry with a specified key and value.
	 *
	 * @param key - The key of the entry to add.
	 * @param value - The value of the entry to add.
	 */
	public set(key: K, value: V): this {
		return super.set(this.coerceKey?.(key) ?? key, this.coerceValue?.(value) ?? value);
	}

	/**
	 * Tests whether at least one entry passes the test implemented by the provided function.
	 *
	 * @param predicate - A function to execute for each entry.
	 * @returns `true` if the callback returns a truthy value for at least one entry; otherwise,
	 * `false`.
	 */
	public some(predicate: IterableCallback<K, V, this, boolean>): boolean;

	/**
	 * Tests whether at least one entry passes the test implemented by the provided function.
	 *
	 * @param predicate - A function to execute for each entry.
	 * @param thisArg - A value to use as `this` when executing the callback.
	 * @returns `true` if the callback returns a truthy value for at least one entry; otherwise,
	 * `false`.
	 */
	public some<T>(predicate: IterableCallback<K, V, this, boolean>, thisArg: T): boolean;
	public some(predicate: IterableCallback<K, V, this, boolean>, thisArg: any = this): boolean {
		for (const [key, value] of this) {
			if (predicate.call(thisArg, value, key, this)) {
				return true;
			}
		}

		return false;
	}

	/**
	 * Sorts the entries in place and returns the sorted Map.
	 *
	 * @param comparator - A function that defines the sort order to execute on each entry.
	 */
	public sort(comparator: Comparator<K, V>): this {
		const entries = [...this];

		comparator ??= (a, b): number => Number(a > b) || Number(a === b) - 1;
		entries.sort(([kA, vA], [kB, vB]) => comparator(vA, vB, kA, kB));

		this.clear();

		for (const [key, value] of entries) {
			this.set(key, value);
		}

		return this;
	}

	/**
	 * Creates a new Map with unique values.
	 *
	 * @returns The deduplicated Map whose keys are associated with its unique value.
	 */
	public uniqueBy(): ExtendedMap<K, V>;

	/**
	 * Creates a new Map with unique values.
	 *
	 * @param indexer - An index-key of the values to deduplicate the original Map by.
	 * @returns The deduplicated Map whose keys are associated with its unique value.
	 */
	public uniqueBy(indexer: Indexer<V>): ExtendedMap<K, V>;

	/**
	 * Creates a new Map with unique values.
	 *
	 * @param resolver - A function to execute on each entry that defines how to deduplicate the
	 * original Map based on the return values.
	 * @returns The deduplicated Map whose keys are associated with its unique value.
	 */
	public uniqueBy(resolver: Resolver<V>): ExtendedMap<K, V>;
	public uniqueBy<T>(resolver: Resolver<V, T>): ExtendedMap<K, V>;
	public uniqueBy(valueResolver?: ValueResolver<any>): ExtendedMap<K, V> {
		const map = new ExtendedMap<K, V>();

		if (!valueResolver) {
			for (const value of [...new Set(this.values())]) {
				map.set(this.keyOf(value), value);
			}

			return map;
		}

		const key = typeof valueResolver !== 'function' && valueResolver;

		// prettier-ignore
		valueResolver = key 
			? (value: Record<Indexer<V>, any>) => value?.[key] ?? value 
			: valueResolver;

		for (const [key, value] of this) {
			const resolved = (valueResolver as Resolver<V>)(value);

			if (!map.has(resolved)) {
				// @ts-expect-error
				map.set(resolved, [key, value]);
			}
		}

		const unique = new Map<K, V>(map.values() as any);
		map.clear();

		for (const [key, value] of unique) {
			map.set(key, value);
		}

		return map;
	}

	/**
	 * Updates an existing value at `key`.
	 *
	 * @param key - The key of the value to update.
	 * @param callbackfn - A function to execute when updating.
	 * @returns The Map.
	 */
	public update(key: K, callbackfn: IterableCallback<K, V, this, V>): this {
		if (!this.has(key)) {
			throw new RangeError('Cannot perform update on an absent value.');
		}

		return this.set(key, callbackfn(this.get(key), key, this));
	}
}
