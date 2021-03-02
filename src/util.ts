import { ExtendedMap, ExtendedSet } from './';

export const inspect: unique symbol = Symbol.for('nodejs.util.inspect.custom');

/**
 * Map
 */
export type IterableEntries<K, V> = Iterable<readonly [K, V]> | ReadonlyArray<readonly [K, V]>;

/**
 * Set
 */
export type IterableElements<T> = Iterable<T> | ReadonlyArray<T>;

export interface EmplaceHandler<K, V> {
	insert?(key?: K, map?: ExtendedMap<K, V>): V;
	update?(value?: V, key?: K, map?: ExtendedMap<K, V>): any;
}

export interface CoercionHandler<K, V> {
	/**
	 * A function to normalize a key when attempting to be found.
	 */
	coerceKey?(key?: K): K;

	/**
	 * A function to normalize a value during placement.
	 */
	coerceValue?(value?: V): V;
}

type Collection = ExtendedMap<unknown, unknown> | ExtendedSet<unknown>;

export type IterableCallback<K, V, T extends Collection, U = any> = (
	/**
	 * The current value being processed.
	 */
	value: V,

	/**
	 * The current key being processed.
	 */
	key: K,

	/**
	 * The collection being iterated.
	 */
	target: T
) => U;

export type Reducer<K, V, T extends Collection, U = any> = (
	/**
	 * The accumulated value previously returned in the last invocation of the callback, or
	 * `initialValue` if provided.
	 */
	accumulator: U,

	/**
	 * The current value being processed.
	 */
	value: V,

	/**
	 * The current key being processed.
	 */
	key: K,

	/**
	 * The collection being iterated.
	 */
	target: T
) => U;

export type Comparator<K, V> = (
	/**
	 * The first value for comparison.
	 */
	valueA: V,

	/**
	 * The second value for comparison.
	 */
	valueB: V,

	/**
	 * The first key for comparison.
	 */
	keyA: K,

	/**
	 * The second key for comparison.
	 */
	keyB: K
) => number;

export type Indexer<T> = number | keyof T | symbol;

export type Resolver<T, U = any> = (
	/**
	 * The current value being processed.
	 */
	value: T
) => U;

export type ValueResolver<T> = Indexer<T> | Resolver<T>;
