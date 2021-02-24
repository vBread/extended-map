import { ExtendedMap } from '../Map';
import { ExtendedWeakMap } from '../WeakMap';

type MapLike<K, V> = K extends object ? ExtendedWeakMap<K, V> : ExtendedMap<K, V>;

export type IterableEntries<K, V> = Iterable<readonly [K, V]> | ReadonlyArray<readonly [K, V]>;

export interface EmplaceHandler<K, V> {
	insert?(key?: K, map?: MapLike<K, V>): V;
	update?(value?: V, key?: K, map?: MapLike<K, V>): any;
}

export interface CoercionHandler<K, V> {
	coerceKey?(key?: K): K;
	coerceValue?(Value?: V): V;
}
