import { CoercionHandler, EmplaceHandler } from './types';
import { inspect } from './util/constants';

/**
 * Holds key-value pairs and remembers the original insertion order of the keys.
 * Any value (both objects and primitive values) may be used as either a key or a value
 */
export class ExtendedMap<K, V> extends Map<K, V> {
	private readonly coerceKey: (key?: K) => K;
	private readonly coerceValue: (value?: V) => V;

	/**
	 * The number of elements in the `Map`
	 * @readonly
	 *
	 * @spec {@link https://tc39.es/ecma262/#sec-get-map.prototype.size ECMA-262}
	 */
	public readonly size: number;

	public constructor(iterable: Iterable<readonly [K, V]>);
	public constructor(entries?: ReadonlyArray<readonly [K, V]>);
	public constructor(entries: ReadonlyArray<readonly [K, V]>, handler: CoercionHandler<K, V>);
	public constructor(entries?: ReadonlyArray<readonly [K, V]> | Iterable<readonly [K, V]>, handler?: CoercionHandler<K, V>) {
		super(entries);

		this.coerceKey = handler?.coerceKey;
		this.coerceValue = handler?.coerceValue;
	}

	private [inspect]() {
		return new Map(this);
	}

	public static from<T, K = any, V = any>(iterable: Iterable<T>): ExtendedMap<K, V>;
	public static from<T, K = any, V = any>(iterable: Iterable<T>, mapfn: (value: T, index: number) => [K, V]): ExtendedMap<K, V>;
	public static from<K = any, V = any>(iterable: Iterable<any>, mapfn?: (value: any, index: number) => [K, V]): ExtendedMap<K, V>;
	public static from<U, T, K = any, V = any>(iterable: Iterable<T>, mapfn: (value: T, index: number) => [K, V], thisArg: U): ExtendedMap<K, V>;
	public static from<K = any, V = any>(iterable: Iterable<any>, mapfn?: (value: any, index: number) => [K, V], thisArg: any = this): ExtendedMap<K, V> {
		const entries: [K, V][] = [];
		let i = 0;

		for (const item of iterable) {
			if (mapfn) {
				entries.push(mapfn.call(thisArg, item, i++));
			} else {
				entries.push(item);
			}
		}

		return new ExtendedMap<K, V>(entries);
	}

	public static groupBy<T = any>(iterable: Iterable<T>, keyDerivative: (value: T) => any): ExtendedMap<any, T[]> {
		const map = new ExtendedMap<any, T[]>();

		for (const item of iterable) {
			map.emplace(keyDerivative(item), {
				insert: () => [item],
				update: (value) => {
					value.push(item);
					return value;
				},
			});
		}

		return map;
	}

	public static isMap(arg: any): arg is Map<any, any>;
	public static isMap<K, V>(arg: any): arg is Map<K, V>;
	public static isMap(arg: any): arg is Map<any, any> {
		const methods = ['has', 'get', 'set', 'entries', 'delete', 'values', 'keys', 'forEach', 'clear'];

		// prettier-ignore
		return (
			arg
			&& typeof arg === 'object'
			&& 'size' in arg
			&& typeof arg.size === 'number'
			&& arg[Symbol.toStringTag] === 'Map'
			&& methods.every((method) => method in arg && typeof arg[method] === 'function')
		);
	}

	public static keyBy(iterable: Iterable<any>): ExtendedMap<any, any[]>;
	public static keyBy<T>(iterable: Iterable<T>): ExtendedMap<any, T[]>;
	public static keyBy<T>(iterable: Iterable<T>, keyDerivative: (value: T) => T[]): ExtendedMap<any, T[]>;
	public static keyBy(iterable: Iterable<any>, keyDerivative?: (value: any) => any): ExtendedMap<any, any[]> {
		const map = new ExtendedMap<any, any[]>();

		for (const item of iterable) {
			map.set(keyDerivative(item), item);
		}

		return map;
	}

	public static of(...args: [any, any][]): ExtendedMap<any, any>;
	public static of<K, V>(...args: [K, V][]): ExtendedMap<K, V>;
	public static of<K, V>(...args: [K, V][]): ExtendedMap<K, V> {
		return new ExtendedMap<K, V>(args);
	}

	public get first(): V | undefined {
		return this.values().next().value;
	}

	public get firstKey(): K | undefined {
		return this.keys().next().value;
	}

	public get last(): V | undefined {
		return this.at(-1)[1];
	}

	public get lastKey(): K | undefined {
		return this.at(-1)[0];
	}

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
	 * Removes all elements from the `Map`
	 *
	 * @spec {@link https://tc39.es/ecma262/#sec-map.prototype.clear ECMA-262}
	 */
	public clear(): void {
		return super.clear();
	}

	/**
	 * Removes the specified element from the `Map` by key
	 *
	 * @param key The key of the element to remove from the `Map`
	 * @returns `true` if an element in the `Map` existed and has been removed, or `false` if the element does not exist
	 *
	 * @spec {@link https://tc39.es/ecma262/#sec-map.prototype.delete ECMA-262}
	 */
	public delete(key: K): boolean {
		return super.delete(this.coerceKey?.(key) ?? key);
	}

	public deleteAll(...keys: K[]): boolean {
		let finished = true;

		for (const key of keys) {
			finished = finished && this.delete(key);
		}

		return !!finished;
	}

	public emplace(key: K, handler: EmplaceHandler<K, V>): V {
		if (!('update' in handler) && !('insert' in handler)) {
			throw new ReferenceError('At least one callback must be provided');
		}

		const value =
			this.has(key) && 'update' in handler
				? handler.update(this.get(key), this.coerceKey?.(key) ?? key, this as any)
				: handler.insert(this.coerceKey?.(key) ?? key, this as any);

		this.set(key, value);

		return value;
	}

	public every(predicate: (value: V, key: K, map: this) => boolean): boolean;
	public every<T>(predicate: (value: V, key: K, map: this) => boolean, thisArg: T): boolean;
	public every(predicate: (value: V, key: K, map: this) => boolean, thisArg: any = this): boolean {
		for (const [key, value] of this) {
			if (!predicate.call(thisArg, value, key, this)) {
				return false;
			}
		}

		return true;
	}

	public filter(predicate: (value: V, key: K, map: this) => boolean): ExtendedMap<K, V>;
	public filter<T>(predicate: (value: V, key: K, map: this) => boolean, thisArg: T): ExtendedMap<K, V>;
	public filter(predicate: (value: V, key: K, map: this) => boolean, thisArg: any = this): ExtendedMap<K, V> {
		const map = new ExtendedMap<K, V>();

		for (const [key, value] of this) {
			if (predicate.call(thisArg, value, key, this)) {
				map.set(key, value);
			}
		}

		return map;
	}

	public filterOut(predicate: (value: V, key: K, map: this) => boolean): ExtendedMap<K, V>;
	public filterOut<T>(predicate: (value: V, key: K, map: this) => boolean, thisArg: T): ExtendedMap<K, V>;
	public filterOut(predicate: (value: V, key: K, map: this) => boolean, thisArg: any = this): ExtendedMap<K, V> {
		const map = new ExtendedMap<K, V>();

		for (const [key, value] of this) {
			if (!predicate.call(thisArg, value, key, this)) {
				map.set(key, value);
			}
		}

		return map;
	}

	public find(predicate: (value: V, key: K, map: this) => boolean): V | undefined;
	public find<T>(predicate: (value: V, key: K, map: this) => boolean, thisArg: T): V | undefined;
	public find(predicate: (value: V, key: K, map: this) => boolean, thisArg: any = this): V | undefined {
		for (const [key, value] of this) {
			if (predicate.call(thisArg, value, key, this)) {
				return value;
			}
		}

		return undefined;
	}

	public findKey(predicate: (value: V, key: K, map: this) => boolean): K | undefined;
	public findKey<T>(predicate: (value: V, key: K, map: this) => boolean, thisArg: T): K | undefined;
	public findKey(predicate: (value: V, key: K, map: this) => boolean, thisArg: any = this): K | undefined {
		for (const [key, value] of this) {
			if (predicate.call(thisArg, value, key, this)) {
				return key;
			}
		}

		return undefined;
	}

	/**
	 * Executes a provided function once per each key/value in the `Set`, in insertion order
	 *
	 * @param callbackfn Function to execute for each entry of the `Map`. It takes the following arguments
	 * 		  - `value`: Value of each iteration
	 * 		  - `key`: Key of each iteration
	 * 		  - `map`: The map being iterated
	 * @param thisArg Value to use as `this` when executing `callback`
	 *
	 * @spec {@link https://tc39.es/ecma262/#sec-map.prototype.foreach ECMA-262}
	 */
	public forEach<U = any>(callbackfn: (value: V, key: K, set: this) => U): void;
	public forEach<U>(callbackfn: (value: V, key: K, set: this) => any, thisArg: U): void;
	public forEach<R, U>(callbackfn: (value: V, key: K, set: this) => R, thisArg: U): void;
	public forEach(callbackfn: (value: V, key: K, set: this) => any, thisArg: any = this): void {
		return super.forEach(callbackfn, thisArg);
	}

	/**
	 * Returns a specified element from the `Map`. If the value that is associated to the provided key is an object, then
	 * you will get a reference to that object and any change made to that object will effectively modify it inside the `Map`
	 *
	 * @param key The key of the element to return from the `Map`
	 * @returns The element associated with the specified key, or undefined if the key can't be found in the `Map`
	 *
	 * @spec {@link https://tc39.es/ecma262/#sec-map.prototype.get ECMA-262}
	 */
	public get(key: K): V {
		return super.get(this.coerceKey?.(key) ?? key);
	}

	/**
	 * Returns a boolean indicating whether an element with the specified key exists or not
	 *
	 * @param key The key of the element to test for presence in the `Map`
	 * @returns `true` if an element with the specified key exists in the `Map`; otherwise `false`
	 *
	 * @spec {@link https://tc39.es/ecma262/#sec-map.prototype.has ECMA-262}
	 */
	public has(key: K): boolean {
		return super.has(this.coerceKey?.(key) ?? key);
	}

	public includes(searchElement: V): boolean {
		for (const value of this.values()) {
			if (value === searchElement) {
				return true;
			}
		}

		return false;
	}

	public keyOf(searchElement: V): K | undefined {
		for (const [key, value] of this.entries()) {
			if (value === searchElement) {
				return key;
			}
		}

		return undefined;
	}

	public map(callbackfn: (value: V, key: K, map: this) => any): ExtendedMap<K, V>;
	public map<T>(callbackfn: (value: V, key: K, map: this) => T): ExtendedMap<K, V>;
	public map<U>(callbackfn: (value: V, key: K, map: this) => any, thisArg: U): ExtendedMap<K, V>;
	public map<T, U>(callbackfn: (value: V, key: K, map: this) => T, thisArg: U): ExtendedMap<K, V>;
	public map(callbackfn: (value: V, key: K, map: this) => any, thisArg: any = this): ExtendedMap<K, V> {
		const map = new ExtendedMap<K, V>();

		for (const [key, value] of this) {
			map.set(key, callbackfn.call(thisArg, value, key, this));
		}

		return map;
	}

	public mapKeys(callbackfn: (value: V, key: K, map: this) => any): ExtendedMap<K, V>;
	public mapKeys<T>(callbackfn: (value: V, key: K, map: this) => T): ExtendedMap<K, V>;
	public mapKeys<U>(callbackfn: (value: V, key: K, map: this) => any, thisArg: U): ExtendedMap<K, V>;
	public mapKeys<T, U>(callbackfn: (value: V, key: K, map: this) => T, thisArg: U): ExtendedMap<K, V>;
	public mapKeys(callbackfn: (value: V, key: K, map: this) => any, thisArg: any = this): ExtendedMap<K, V> {
		const map = new ExtendedMap<K, V>();

		for (const [key, value] of this) {
			map.set(callbackfn.call(thisArg, value, key, this), value);
		}

		return map;
	}

	public merge(...iterables: Iterable<[K, V]>[]): this;
	public merge<T>(...iterables: Iterable<T>[]): this;
	public merge(...iterables: Iterable<any>[]): this;
	public merge(...iterables: Iterable<any>[]): this {
		for (const iterable of iterables) {
			for (const [key, value] of iterable) {
				this.set(key, value);
			}
		}

		return this;
	}

	public partition(predicate: (value: V, key: K, map: this) => boolean): [ExtendedMap<K, V>, ExtendedMap<K, V>];
	public partition<T>(predicate: (value: V, key: K, map: this) => boolean, thisArg: T): [ExtendedMap<K, V>, ExtendedMap<K, V>];
	public partition(predicate: (value: V, key: K, map: this) => boolean, thisArg: any = this): [ExtendedMap<K, V>, ExtendedMap<K, V>] {
		const [passed, failed] = [new ExtendedMap<K, V>(), new ExtendedMap<K, V>()];

		for (const [key, value] of this.entries()) {
			if (predicate.call(thisArg, value, value, this)) {
				passed.set(key, value);
			} else {
				failed.set(key, value);
			}
		}

		return [passed, failed];
	}

	public random(): V;
	public random(amount: number): V[];
	public random(amount: number = 1): V | V[] {
		const entries = this.toArray();
		const results: V[] = [];

		for (let i = 0; i < amount; i++) {
			results.push(entries[Math.floor(Math.random() * entries.length)]);
		}

		if (results.length <= 1) {
			return results[1] ?? results[0];
		}

		return results;
	}

	public randomKey(): K;
	public randomKey(amount: number): K[];
	public randomKey(amount: number = 1): K | K[] {
		const entries = this.toKeyArray();
		const results: K[] = [];

		for (let i = 0; i < amount; i++) {
			results.push(entries[Math.floor(Math.random() * entries.length)]);
		}

		if (results.length <= 1) {
			return results[1] ?? results[0];
		}

		return results;
	}

	public reduce<T>(callbackfn: (memo: T, value: V, key: K, map: this) => T): T;
	public reduce<T>(callbackfn: (memo: T, value: V, key: K, map: this) => T, initialValue: T): T;
	public reduce<T>(callbackfn: (memo: T, value: V, key: K, map: this) => T, initialValue?: T): T {
		let initial: boolean = !!initialValue;
		let accumulator = initial ? initialValue : undefined;

		for (const [key, value] of this) {
			if (initial) {
				accumulator = callbackfn(accumulator, value, key, this);
			} else {
				initial = false;
				accumulator = (value as unknown) as T;
			}
		}

		return accumulator;
	}

	/**
	 * Adds or updates an element with a specified key and a value to the `Map`
	 *
	 * @param key The key of the element to add to the `Map`
	 * @param value The value of the element to add to the `Map`
	 * @returns The `Map`
	 */
	public set(key: K, value: V): this {
		return super.set(this.coerceKey?.(key) ?? key, this.coerceValue?.(value) ?? value);
	}

	public some(predicate: (value: V, key: K, map: this) => boolean): boolean;
	public some<T>(predicate: (value: V, key: K, map: this) => boolean, thisArg: T): boolean;
	public some(predicate: (value: V, key: K, map: this) => boolean, thisArg: any = this): boolean {
		for (const [key, value] of this) {
			if (predicate.call(thisArg, value, key, this)) {
				return true;
			}
		}

		return false;
	}

	public sort(compareFn: (valueA: V, valueB: V, keyA: K, keyB: K) => number): this {
		const entries = Array.from(this);

		compareFn = compareFn ?? ((a, b): number => Number(a > b) || Number(a === b) - 1);
		entries.sort(([kA, vA], [kB, vB]) => compareFn(vA, vB, kA, kB));

		this.clear();

		for (const [key, value] of entries) {
			this.set(key, value);
		}

		return this;
	}

	public toArray(): V[] {
		return [...this.values()];
	}

	public toKeyArray(): K[] {
		return [...this.keys()];
	}

	public uniqueBy(): ExtendedMap<K, V>;
	public uniqueBy(valueResolver: string | number): ExtendedMap<K, V>;
	public uniqueBy(valueResolver: (value: V) => any): ExtendedMap<K, V>;
	public uniqueBy<T>(valueResolver: (value: V) => T): ExtendedMap<K, V>;
	public uniqueBy(valueResolver?: ((value: V) => any) | string | number): ExtendedMap<K, V> {
		const map = new ExtendedMap<K, V>();
		const tmp = new ExtendedMap();

		if (!valueResolver) {
			for (const value of [...new Set(this.values())]) {
				map.set(this.keyOf(value), value);
			}

			return map;
		}

		const key = typeof valueResolver !== 'function' && valueResolver;

		valueResolver = key ? (value: Record<string | number, any>) => value?.[key] ?? value : valueResolver;

		for (const [key, value] of this) {
			const resolved = (valueResolver as Function)(value);

			tmp.emplace(resolved, {
				insert: () => [key, value] as any,
			});
		}

		for (const [key, value] of tmp.values() as any) {
			map.set(key, value);
		}

		return map;
	}
}
