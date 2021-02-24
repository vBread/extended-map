import { CoercionHandler, EmplaceHandler } from './util/types';

/**
 * Collection of key/value pairs in which the keys are weakly referenced.
 * The keys must be objects and the values can be arbitrary values
 *
 * @spec {@link https://tc39.es/ecma262/#sec-weakmap-objects ECMA-262}
 */
export class ExtendedWeakMap<K extends object, V> extends WeakMap<K, V> {
	private readonly coerceKey: (key?: K) => K;
	private readonly coerceValue: (value?: V) => V;

	public constructor(iterable: Iterable<[K, V]>);
	public constructor(entries?: ReadonlyArray<[object, any]>);
	public constructor(entries: ReadonlyArray<[K, V]> | Iterable<[K, V]>, handler: CoercionHandler<K, V>);
	public constructor(entries?: ReadonlyArray<[K, V]> | Iterable<[K, V]>, handler?: CoercionHandler<K, V>) {
		super(entries);

		this.coerceKey = handler?.coerceKey;
		this.coerceValue = handler?.coerceValue;
	}

	public static from<T, K extends object = object, V = any>(iterable: Iterable<T>): ExtendedWeakMap<K, V>;
	public static from<T, K extends object = object, V = any>(iterable: Iterable<T>, mapfn: (value: T, index: number) => [K, V]): ExtendedWeakMap<K, V>;
	public static from<K extends object = object, V = any>(iterable: Iterable<any>, mapfn?: (value: any, index: number) => [K, V]): ExtendedWeakMap<K, V>;
	// prettier-ignore
	public static from<U, T, K extends object = object, V = any>(iterable: Iterable<T>, mapfn: (value: T, index: number) => [K, V], thisArg: U): ExtendedWeakMap<K, V>
	// prettier-ignore
	public static from<K extends object = object, V = any>(iterable: Iterable<any>, mapfn?: (value: any, index: number) => [K, V], thisArg: any = this): ExtendedWeakMap<K, V> {
        const entries: [K, V][] = []
        let i = 0

        for (const item of iterable) {
            if (mapfn) {
                entries.push(mapfn.call(thisArg, item, i++))
            } else {
                entries.push(item)
            }
        }

        return new ExtendedWeakMap<K, V>(entries)
    }

	/**
	 * Determines whether the passed value is a `WeakMap`.
	 *
	 * @param arg The value to be checked.
	 * @returns `true` if the value is a `WeakMap`; otherwise `false`.
	 */
	public static isWeakMap(arg: any): arg is WeakMap<any, any>;
	public static isWeakMap<K extends object, V>(arg: any): arg is WeakMap<K, V>;
	public static isWeakMap(arg: any): arg is WeakMap<any, any> {
		return arg[Symbol.toStringTag] === 'WeakMap' && arg.toString() === '[object WeakMap]';
	}

	public static of(...args: [any, any][]): ExtendedWeakMap<any, any>;
	public static of<K extends object, V>(...args: [K, V][]): ExtendedWeakMap<K, V>;
	public static of<K extends object, V>(...args: [K, V][]): ExtendedWeakMap<K, V> {
		return new ExtendedWeakMap<K, V>(args);
	}

	/**
	 * Removes the specified element from the `WeakMap`
	 *
	 * @param key The key of the element to remove from the `WeakMap`
	 * @returns
	 * `true` if an element in the `WeakMap` has been removed successfully
	 * `false` if the key is not found in the `WeakMap` or if the key is not an object
	 *
	 * @spec {@link https://tc39.es/ecma262/#sec-weakmap.prototype.delete ECMA-262}
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

	/**
	 * Returns a specified element from the `WeakMap`
	 *
	 * @param key The key of the element to return from the `WeakMap`
	 * @returns The element associated with the specified key in the `WeakMap`. If the key can't be found, `undefined` is returned
	 *
	 * @spec {@link https://tc39.es/ecma262/#sec-weakmap.prototype.get ECMA-262}
	 */
	public get(key: K): V | undefined {
		return super.get(this.coerceKey?.(key) ?? key);
	}

	/**
	 * Returns a boolean indicating whether an element with the specified key exists in the `WeakMap` or not
	 *
	 * @param key The key of the element to test for presence in the `WeakMap`
	 * @returns `true` if an element with the specified key exists in the `WeakMap`; otherwise `false`
	 *
	 * @spec {@link https://tc39.es/ecma262/#sec-weakmap.prototype.has ECMA-262}
	 */
	public has(key: K): boolean {
		return super.has(this.coerceKey?.(key) ?? key);
	}

	/**
	 * Adds a new element with a specified key and value to the `WeakMap`
	 *
	 * @param key The key of the element to add to the `WeakMap`
	 * @param value The value of the element to add to the `WeakMap`
	 * @returns The `WeakMap`
	 *
	 * @spec {@link https://tc39.es/ecma262/#sec-weakmap.prototype.set ECMA-262}
	 */
	public set(key: K, value: V): this {
		// prettier-ignore
		return super.set(
			this.coerceKey?.(key) ?? key,
			this.coerceValue?.(value) ?? value
		);
	}
}
