import { ExtendedMap } from '.';

export interface EmplaceHandler<K, V> {
    insert?(key?: K, map?: ExtendedMap<K, V>): V
    update?(value?: V, key?: K, map?: ExtendedMap<K, V>): any
}

export interface NormalizationHandler<K, V> {
	coerceKey?(key?: K): K
	coerceValue?(Value?: V): V
}