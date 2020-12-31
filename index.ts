interface EmplaceHandler<K, V> {
    insert?(key?: K, map?: ExtendedMap<K, V>): V
    update?(value?: V, key?: K, map?: ExtendedMap<K, V>): any
}

export class ExtendedMap<K, V> extends Map<K, V> {
    public constructor(entries?: ReadonlyArray<readonly [K, V]>) {
        super(entries)
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
        const array: [K, V][] = []

        while (args.length--) {
            array[args.length] = args[args.length]
        }

        return new ExtendedMap(array)
    }

    public static from<T, K = any, V = any>(iterable: Iterable<T>): ExtendedMap<K, V>
    public static from<T, K = any, V = any>(iterable: Iterable<T>, mapFn: (value: T, index: number) => [K, V]): ExtendedMap<K, V>
    public static from<K = any, V = any>(iterable: Iterable<any>, mapFn?: (value: any, index: number) => [K, V]): ExtendedMap<K, V>
    public static from<U, T, K = any, V = any>(iterable: Iterable<T>, mapFn: (value: T, index: number) => [K, V], thisArg: U): ExtendedMap<K, V>
    public static from<K = any, V = any>(iterable: Iterable<any>, mapFn?: (value: any, index: number) => [K, V], thisArg?: any): ExtendedMap<K, V> {
        mapFn = thisArg ? mapFn.bind(thisArg) : mapFn

        const array: [K, V][] = []
        let i = 0

        for (const item of iterable) {
            if (mapFn) {
                array.push(mapFn(item, i++))
            } else {
                array.push.bind(array)
            }
        }

        return new ExtendedMap(array)
    }

    public emplace(key: K, handler: EmplaceHandler<K, V>): V {
        if (!('update' in handler) && !('insert' in handler)) {
            throw new Error('At least one handler function must be provided')
        }

        const value = (this.has(key) && 'update' in handler)
            ? handler.update(this.get(key), key, this)
            : handler.insert(key, this)

        this.set(key, value)

        return value
    }

    public array(): V[] {
        return [...this.values()]
    }

    public keyArray(): K[] {
        return [...this.keys()]
    }

    public find(predicate: (value: V, key: K, map: ExtendedMap<K, V>) => boolean): V | undefined
    public find<T>(predicate: (value: V, key: K, map: ExtendedMap<K, V>) => boolean, thisArg: T): V | undefined
    public find(predicate: (value: V, key: K, map: ExtendedMap<K, V>) => boolean, thisArg?: any): V | undefined {
        predicate = thisArg ? predicate.bind(thisArg) : predicate
        
        for (const [key, value] of this) {
            if (predicate(value, key, this)) {
                return value
            }
        }

        return undefined
    }

    public findKey(predicate: (value: V, key: K, map: ExtendedMap<K, V>) => boolean): K | undefined
    public findKey<T>(predicate: (value: V, key: K, map: ExtendedMap<K, V>) => boolean, thisArg: T): K | undefined
    public findKey(predicate: (value: V, key: K, map: ExtendedMap<K, V>) => boolean, thisArg?: any): K | undefined {
        predicate = thisArg ? predicate.bind(thisArg) : predicate

        for (const [key, value] of this) {
            if (predicate(value, key, this)) {
                return key
            }
        }

        return undefined
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

    public deleteAll(): boolean
    public deleteAll(...keys: K[]): boolean
    public deleteAll(...keys: K[]): boolean {
        keys = keys.length > 0 ? keys : this.keyArray()

        let finished = true

        for (const key of keys) {
            finished = finished && this.delete(key)
        }

        return !!finished
    }

    public every(predicate: (value: V, key: K, map: ExtendedMap<K, V>) => boolean): boolean
    public every<T>(predicate: (value: V, key: K, map: ExtendedMap<K, V>) => boolean, thisArg: T): boolean
    public every(predicate: (value: V, key: K, map: ExtendedMap<K, V>) => boolean, thisArg?: any): boolean {
        predicate = thisArg ? predicate.bind(thisArg) : predicate

        for (const [key, value] of this) {
            if (!predicate(value, key, this)) {
                return false
            }
        }

        return true
    }

    public map(callbackfn: (value: V, key: K, map: ExtendedMap<K, V>) => any): ExtendedMap<K, V>
    public map<T>(callbackfn: (value: V, key: K, map: ExtendedMap<K, V>) => T): ExtendedMap<K, V>
    public map<U>(callbackfn: (value: V, key: K, map: ExtendedMap<K, V>) => any, thisArg: U): ExtendedMap<K, V>
    public map<T, U>(callbackfn: (value: V, key: K, map: ExtendedMap<K, V>) => T, thisArg: U): ExtendedMap<K, V>
    public map(callbackfn: (value: V, key: K, map: ExtendedMap<K, V>) => any, thisArg?: any): ExtendedMap<K, V> {
        callbackfn = thisArg ? callbackfn.bind(thisArg) : callbackfn

        const map = new ExtendedMap<K, V>()

        for (const [key, value] of this) {
            map.set(key, callbackfn(value, key, this))
        }

        return map
    }

    public mapKeys(callbackfn: (value: V, key: K, map: ExtendedMap<K, V>) => any): ExtendedMap<K, V>
    public mapKeys<T>(callbackfn: (value: V, key: K, map: ExtendedMap<K, V>) => T): ExtendedMap<K, V>
    public mapKeys<U>(callbackfn: (value: V, key: K, map: ExtendedMap<K, V>) => any, thisArg: U): ExtendedMap<K, V>
    public mapKeys<T, U>(callbackfn: (value: V, key: K, map: ExtendedMap<K, V>) => T, thisArg: U): ExtendedMap<K, V>
    public mapKeys(callbackfn: (value: V, key: K, map: ExtendedMap<K, V>) => any, thisArg?: any): ExtendedMap<K, V> {
        callbackfn = thisArg ? callbackfn.bind(thisArg) : callbackfn

        const map = new ExtendedMap<K, V>()

        for (const [key, value] of this) {
            map.set(callbackfn(value, key, this), value)
        }

        return map
    }

    public filter(predicate: (value: V, key: K, map: this) => boolean): ExtendedMap<K, V>
    public filter<T>(predicate: (value: V, key: K, map: this) => boolean, thisArg: T): ExtendedMap<K, V>
    public filter(predicate: (value: V, key: K, map: this) => boolean, thisArg?: any): ExtendedMap<K, V> {
        predicate = thisArg ? predicate.bind(thisArg) : predicate

        const map = new ExtendedMap<K, V>()

        for (const [key, value] of this) {
            if (predicate(value, key, this)) {
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

        return accumulator
    }

    public some(predicate: (value: V, key: K, map: ExtendedMap<K, V>) => boolean): boolean
    public some<T>(predicate: (value: V, key: K, map: ExtendedMap<K, V>) => boolean, thisArg: T): boolean
    public some(predicate: (value: V, key: K, map: ExtendedMap<K, V>) => boolean, thisArg?: any): boolean {
        predicate = thisArg ? predicate.bind(thisArg) : predicate

        for (const [key, value] of this) {
            if (predicate(value, key, this)) {
                return true
            }
        }

        return false
    }
}
