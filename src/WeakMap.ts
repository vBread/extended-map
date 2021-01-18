import { EmplaceHandler, CoercionHandler } from './types';

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

	public static isWeakMap(arg: any): arg is WeakMap<any, any>;
	public static isWeakMap<K extends object, V>(arg: any): arg is WeakMap<K, V>;
	public static isWeakMap(arg: any): arg is WeakMap<any, any> {
		const methods = ['get', 'set', 'delete', 'has'];

		// prettier-ignore
		return (
			arg
			&& !('size' in arg)
			&& arg[Symbol.toStringTag] === 'WeakMap'
			&& methods.every((method) => method in arg && typeof arg[method] === 'function')
		)
	}

	public static of(...args: [any, any][]): ExtendedWeakMap<any, any>;
	public static of<K extends object, V>(...args: [K, V][]): ExtendedWeakMap<K, V>;
	public static of<K extends object, V>(...args: [K, V][]): ExtendedWeakMap<K, V> {
		return new ExtendedWeakMap<K, V>(args);
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

	public get(key: K): V {
		return super.get(this.coerceKey?.(key) ?? key);
	}

	public has(key: K): boolean {
		return super.has(this.coerceKey?.(key) ?? key);
	}

	public set(key: K, value: V): this {
		// prettier-ignore
		return super.set(
			this.coerceKey?.(key) ?? key,
			this.coerceValue?.(value) ?? value
		);
	}
}
