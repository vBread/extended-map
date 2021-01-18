import { EmplaceHandler, CoercionHandler } from './types';

export class ExtendedMap<K, V> extends Map<K, V> {
	private readonly coerceKey: (key?: K) => K;
	private readonly coerceValue: (value?: V) => V;

	public constructor(iterable: Iterable<readonly [K, V]>);
	public constructor(entries?: ReadonlyArray<readonly [K, V]>);
	public constructor(entries: ReadonlyArray<readonly [K, V]>, handler: CoercionHandler<K, V>);
	public constructor(entries?: ReadonlyArray<readonly [K, V]> | Iterable<readonly [K, V]>, handler?: CoercionHandler<K, V>) {
		super(entries);

		this.coerceKey = handler?.coerceKey;
		this.coerceValue = handler?.coerceValue;
	}
	
	public static isMap(arg: any): arg is Map<any, any>
	public static isMap<K, V>(arg: any): arg is Map<K, V>
	public static isMap(arg: any): arg is Map<any, any> {
		const methods = ['has', 'get', 'set', 'entries', 'delete', 'values', 'keys', 'forEach', 'clear']

		return (
			arg 
			&& 'size' in arg 
			&& typeof arg.size === 'number' 
			&& arg[Symbol.toStringTag] === 'Map'
			&& methods.every((method) => method in arg && typeof arg[method] === 'function') 
		)
	}

    public static groupBy<T = any>(iterable: Iterable<T>, keyDerivative: (value: T) => any): ExtendedMap<any, T[]> {
        const map = new ExtendedMap<any, T[]>()
        
        for (const item of iterable) {
            map.emplace(keyDerivative(item), {
                insert: () => [item],
                update: (value) => {
                    value.push(item)
                    return value
                }
            })
        }

        return map
    }

    public static keyBy(iterable: Iterable<any>): ExtendedMap<any, any[]>
    public static keyBy<T>(iterable: Iterable<T>): ExtendedMap<any, T[]>
    public static keyBy<T>(iterable: Iterable<T>, keyDerivative: (value: T) => T[]): ExtendedMap<any, T[]>
    public static keyBy(iterable: Iterable<any>, keyDerivative?: (value: any) => any): ExtendedMap<any, any[]> {
        const map = new ExtendedMap<any, any[]>()

        for (const item of iterable) {
            map.set(keyDerivative(item), item)
        }

        return map
    }

    public static of(...args: [any, any][]): ExtendedMap<any, any>
    public static of<K, V>(...args: [K, V][]): ExtendedMap<K, V>
    public static of<K, V>(...args: [K, V][]): ExtendedMap<K, V> {
        return new ExtendedMap<K, V>(args)
    }

    public static from<T, K = any, V = any>(iterable: Iterable<T>): ExtendedMap<K, V>
    public static from<T, K = any, V = any>(iterable: Iterable<T>, mapfn: (value: T, index: number) => [K, V]): ExtendedMap<K, V>
    public static from<K = any, V = any>(iterable: Iterable<any>, mapfn?: (value: any, index: number) => [K, V]): ExtendedMap<K, V>
    public static from<U, T, K = any, V = any>(iterable: Iterable<T>, mapfn: (value: T, index: number) => [K, V], thisArg: U): ExtendedMap<K, V>
    public static from<K = any, V = any>(iterable: Iterable<any>, mapfn?: (value: any, index: number) => [K, V], thisArg: any = this): ExtendedMap<K, V> {
        const entries: [K, V][] = []
        let i = 0

        for (const item of iterable) {
            if (mapfn) {
                entries.push(mapfn.call(thisArg, item, i++))
            } else {
                entries.push(item)
            }
        }

        return new ExtendedMap<K, V>(entries)
    }

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

    public toArray(): V[] {
        return [...this.values()]
    }

    public toKeyArray(): K[] {
        return [...this.keys()]
    }

    public find(predicate: (value: V, key: K, map: ExtendedMap<K, V>) => boolean): V | undefined
    public find<T>(predicate: (value: V, key: K, map: ExtendedMap<K, V>) => boolean, thisArg: T): V | undefined
    public find(predicate: (value: V, key: K, map: ExtendedMap<K, V>) => boolean, thisArg: any = this): V | undefined {
        for (const [key, value] of this) {
            if (predicate.call(thisArg, value, key, this)) {
                return value
            }
        }

        return undefined
    }

    public findKey(predicate: (value: V, key: K, map: ExtendedMap<K, V>) => boolean): K | undefined
    public findKey<T>(predicate: (value: V, key: K, map: ExtendedMap<K, V>) => boolean, thisArg: T): K | undefined
    public findKey(predicate: (value: V, key: K, map: ExtendedMap<K, V>) => boolean, thisArg: any = this): K | undefined {
        for (const [key, value] of this) {
            if (predicate.call(thisArg, value, key, this)) {
                return key
            }
        }

        return undefined
	}
	
	public at(index: number): [K, V] | undefined {
		index = Math.trunc(index) ?? 0

		if (index < 0) {
			index += this.size
		}

	public get(key: K): V {
		return super.get(this.coerceKey?.(key) ?? key);
	}

	public has(key: K): boolean {
		return super.has(this.coerceKey?.(key) ?? key);
	}

    public includes(searchElement: V): boolean {
        for (const value of this.values()) {
            if (value === searchElement) {
                return true
            }
        }

        return false
    }

    public keyOf(searchElement: V): K | undefined {
        for (const [key, value] of this.entries()) {
            if (value === searchElement) {
                return key
            }
        }

        return undefined
    }

    public merge(...iterables: Iterable<[K, V]>[]): ExtendedMap<K, V>
    public merge<T>(...iterables: Iterable<T>[]): ExtendedMap<K, V>
    public merge(...iterables: Iterable<any>[]): ExtendedMap<K, V>
    public merge(...iterables: Iterable<any>[]): ExtendedMap<K, V> {
        for (const iterable of iterables) {
            for (const [key, value] of iterable) {
                this.set(key, value)
            }
        }

        return this
    }

    public deleteAll(...keys: K[]): boolean {
        let finished = true

        for (const key of keys) {
            finished = finished && this.delete(key)
        }

        return !!finished
    }

    public every(predicate: (value: V, key: K, map: ExtendedMap<K, V>) => boolean): boolean
    public every<T>(predicate: (value: V, key: K, map: ExtendedMap<K, V>) => boolean, thisArg: T): boolean
    public every(predicate: (value: V, key: K, map: ExtendedMap<K, V>) => boolean, thisArg: any = this): boolean {
        for (const [key, value] of this) {
            if (!predicate.call(thisArg, value, key, this)) {
                return false
            }
        }

        return true
    }

    public map(callbackfn: (value: V, key: K, map: ExtendedMap<K, V>) => any): ExtendedMap<K, V>
    public map<T>(callbackfn: (value: V, key: K, map: ExtendedMap<K, V>) => T): ExtendedMap<K, V>
    public map<U>(callbackfn: (value: V, key: K, map: ExtendedMap<K, V>) => any, thisArg: U): ExtendedMap<K, V>
    public map<T, U>(callbackfn: (value: V, key: K, map: ExtendedMap<K, V>) => T, thisArg: U): ExtendedMap<K, V>
    public map(callbackfn: (value: V, key: K, map: ExtendedMap<K, V>) => any, thisArg: any = this): ExtendedMap<K, V> {
        const map = new ExtendedMap<K, V>()

        for (const [key, value] of this) {
            map.set(key, callbackfn.call(thisArg, value, key, this))
        }

        return map
    }

    public mapKeys(callbackfn: (value: V, key: K, map: ExtendedMap<K, V>) => any): ExtendedMap<K, V>
    public mapKeys<T>(callbackfn: (value: V, key: K, map: ExtendedMap<K, V>) => T): ExtendedMap<K, V>
    public mapKeys<U>(callbackfn: (value: V, key: K, map: ExtendedMap<K, V>) => any, thisArg: U): ExtendedMap<K, V>
    public mapKeys<T, U>(callbackfn: (value: V, key: K, map: ExtendedMap<K, V>) => T, thisArg: U): ExtendedMap<K, V>
    public mapKeys(callbackfn: (value: V, key: K, map: ExtendedMap<K, V>) => any, thisArg: any = this): ExtendedMap<K, V> {
        const map = new ExtendedMap<K, V>()

        for (const [key, value] of this) {
            map.set(callbackfn.call(thisArg, value, key, this), value)
        }

        return map
    }

    public filter(predicate: (value: V, key: K, map: ExtendedMap<K, V>) => boolean): ExtendedMap<K, V>
    public filter<T>(predicate: (value: V, key: K, map: ExtendedMap<K, V>) => boolean, thisArg: T): ExtendedMap<K, V>
    public filter(predicate: (value: V, key: K, map: ExtendedMap<K, V>) => boolean, thisArg: any = this): ExtendedMap<K, V> {
        const map = new ExtendedMap<K, V>()

        for (const [key, value] of this) {
            if (predicate.call(thisArg, value, key, this)) {
                map.set(key, value)
            }
        }

        return map
	}
	
	public filterOut(predicate: (value: V, key: K, map: ExtendedMap<K, V>) => boolean): ExtendedMap<K, V>
    public filterOut<T>(predicate: (value: V, key: K, map: ExtendedMap<K, V>) => boolean, thisArg: T): ExtendedMap<K, V>
    public filterOut(predicate: (value: V, key: K, map: ExtendedMap<K, V>) => boolean, thisArg: any = this): ExtendedMap<K, V> {
        const map = new ExtendedMap<K, V>()

        for (const [key, value] of this) {
            if (!predicate.call(thisArg, value, key, this)) {
                map.set(key, value)
            }
		}

        return map
	}

    public reduce<T>(callbackfn: (memo: T, value: V, key: K, map: ExtendedMap<K, V>) => T): T
    public reduce<T>(callbackfn: (memo: T, value: V, key: K, map: ExtendedMap<K, V>) => T, initialValue: T): T
    public reduce<T>(callbackfn: (memo: T, value: V, key: K, map: ExtendedMap<K, V>) => T, initialValue?: T): T {
        let initial: boolean = !!initialValue
        let accumulator = initial ? initialValue : undefined

        for (const [key, value] of this) {
            if (initial) {
                accumulator = callbackfn(accumulator, value, key, this)
            } else {
                initial = false
                accumulator = value as unknown as T
            }
        }

	public set(key: K, value: V): this {
		return super.set(this.coerceKey?.(key) ?? key, this.coerceValue?.(value) ?? value);
	}

    public some(predicate: (value: V, key: K, map: ExtendedMap<K, V>) => boolean): boolean
    public some<T>(predicate: (value: V, key: K, map: ExtendedMap<K, V>) => boolean, thisArg: T): boolean
    public some(predicate: (value: V, key: K, map: ExtendedMap<K, V>) => boolean, thisArg: any = this): boolean {
        for (const [key, value] of this) {
            if (predicate.call(thisArg, value, key, this)) {
                return true
            }
        }

        return false
	}
	
	public uniqueBy(): ExtendedMap<K, V>
	public uniqueBy(valueResolver: string | number): ExtendedMap<K, V>
	public uniqueBy(valueResolver: (value: V) => any): ExtendedMap<K, V>
	public uniqueBy<T>(valueResolver: (value: V) => T): ExtendedMap<K, V>
	public uniqueBy(valueResolver?: ((value: V) => any) | string | number): ExtendedMap<K, V> {
		const map = new ExtendedMap<K, V>()
		const tmp = new ExtendedMap()

		if (!valueResolver) {
			for (const value of [...new Set(this.values())]) {
				map.set(this.keyOf(value), value)
			}

			return map
		}

		const key = typeof valueResolver !== 'function' && valueResolver

		valueResolver = key 
			? (value: Record<string | number, any>) => value?.[key] ?? value 
			: valueResolver

		for (const [key, value] of this.entries()) {
			const resolved = (valueResolver as Function)(value)

			tmp.emplace(resolved, {
				insert: () => [key, value] as any
			})
		}
		
		for (const [key, value] of tmp.values() as any) {
			map.set(key, value)
		}

		return map
	}

	public random(): V
	public random(amount: number): V[]
	public random(amount: number = 1): V | V[] {
		const entries = Array.from(this.values())
		const results = []

		for (let i = 0; i < amount; i++) {
			results.push(entries[Math.floor(Math.random() * entries.length)])
		}

		if (results.length <= 1) {
			return results[1] ?? results[0]
		}

		return results
	}

	public randomKey(): K
	public randomKey(amount: number): K[]
	public randomKey(amount: number = 1): K | K[] {
		const entries = Array.from(this.keys())
		const results = []

		for (let i = 0; i < amount; i++) {
			results.push(entries[Math.floor(Math.random() * entries.length)])
		}

		if (results.length <= 1) {
			return results[1] ?? results[0]
		}

		return results
	}
}
