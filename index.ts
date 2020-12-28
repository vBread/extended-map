export interface EmplaceHandler<K, V> {
    insert?(...args: (K | any)[]): V
    update?(...args: (K | any)[]): V
}

export class ExtendedMap<K, V> extends Map<K, V> {
    public constructor(entries?: ReadonlyArray<readonly [K, V]>) {
        super(entries)
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

    public array(): V[]
    public array(keyed: boolean): K[]
    public array(keyed?: boolean): (K | V)[] {
        return keyed ? [...this.keys()] : [...this.values()]
    }

    public find(predicate: (value: V, key: K, store: this) => boolean): V | undefined {
        for (const [key, value] of this) {
            if (predicate(value, key, this)) {
                return value
            }
        }

        return undefined
    }

    public merge(iterable: Iterable<any>): ExtendedMap<K, V> {
        return new ExtendedMap([...this, ...iterable])
    }

    public static groupBy<T>(iterable: Iterable<any>, keyDerivative: Function): ExtendedMap<any, T[]>
    public static groupBy(iterable: Iterable<any>, keyDerivative: Function): ExtendedMap<any, any[]> {
        const store = new ExtendedMap<any, any[]>()

        for (const item of iterable) {
            store.emplace(keyDerivative(item), {
                insert: () => []
            }).push(item)
        }

        return store
    }

    public static keyBy(iterable: Iterable<any>, keyDerivative: Function) {
        const store = new ExtendedMap()

        for (const item of iterable) {
            store.set(keyDerivative(item), item)
        }

        return store
    }

    public delete(key: K): boolean
    public delete(...keys: K[]): boolean
    public delete(item: K | K[]): boolean {
        if (Array.isArray(item)) {
            let finished = true

            for (const key of item) {
                finished = finished && this.delete(key)
            }

            return !!finished
        }

        return this.delete(item)
    }

    public map(callbackFn: Function): ExtendedMap<K, V> {
        const store = new ExtendedMap<K, V>()

        for (const [key, value] of this) {
            store.set(key, callbackFn(value, key, this))
        }

        return store
    }

    public mapKeys(callbackFn: Function): ExtendedMap<K, V> {
        const store = new ExtendedMap<K, V>()

        for (const [key, value] of this) {
            store.set(callbackFn(value, key, this), value)
        }

        return store
    }

    public filter(predicate: (value: V, key: K, store: this) => boolean): ExtendedMap<K, V> {
        const store = new ExtendedMap<K, V>()

        for (const [key, value] of this) {
            if (predicate(value, key, this)) {
                store.set(key, value)
            }
        }

        return store
    }
}