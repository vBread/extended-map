export class ExtendedSet<T> extends Set<T> {
	private readonly coerceValue: (value: T) => T;

	public constructor(iterable?: Iterable<T>);
	public constructor(values?: ReadonlyArray<T>);
	public constructor(entries: Iterable<T> | ReadonlyArray<T>, coerceValue: (value: T) => T);
	public constructor(entries?: Iterable<T> | ReadonlyArray<T>, coerceValue?: (value: T) => T) {
		super(entries);

		this.coerceValue = coerceValue;
	}

	public static isSet(arg: any): arg is Set<any>
	public static isSet<T>(arg: any): arg is Set<T>
	public static isSet(arg: any): arg is Set<any> {
		const methods = ['has', 'add', 'forEach', 'delete', 'keys', 'values', 'entries', 'clear'];

		return (
			arg 
			&& 'size' in arg 
			&& typeof arg.size === 'number' 
			&& arg[Symbol.toStringTag] === 'Set'
			&& methods.every((method) => method in arg && typeof arg[method] === 'function') 
		)
	}

	public static of(...args: any[]): ExtendedSet<any>
    public static of<T>(...args: T[]): ExtendedSet<T>
    public static of<T>(...args: T[]): ExtendedSet<T> {
        return new ExtendedSet<T>(args)
	}

	public add(value: T): this {
		return super.add(this.coerceValue?.(value) ?? value);
	}
	public static from<U, S, T = any>(iterable: Iterable<U>, mapfn: (value: U, index: number) => T, thisArg: S): ExtendedSet<T>
	public static from<T = any>(iterable: Iterable<any>, mapfn?: (value: any, index: number) => T, thisArg: any = this): ExtendedSet<T> {
		const entries: T[] = []
        let i = 0

        for (const item of iterable) {
            if (mapfn) {
                entries.push(mapfn.call(thisArg, item, i++))
            } else {
                entries.push(item)
            }
        }

	public delete(value: T): boolean {
		return super.delete(this.coerceValue?.(value) ?? value);
	}

	public filter(predicate: (value: T, key: T, set: this) => boolean): ExtendedSet<T>
	public filter<U>(predicate: (value: T, key: T, set: this) => boolean, thisArg: U): ExtendedSet<T>
	public filter(predicate: (value: T, key: T, set: this) => boolean, thisArg: any = this): ExtendedSet<T> {
		const set = new ExtendedSet<T>()

		for (const value of this) {
			if (predicate.call(thisArg, value, value, this)) {
				set.add(value)
			}
		}

		return set
	}

	public filterOut(predicate: (value: T, key: T, set: ExtendedSet<T>) => boolean): ExtendedSet<T>
	public filterOut<U>(predicate: (value: T, key: T, set: ExtendedSet<T>) => boolean, thisArg: U): ExtendedSet<T>
	public filterOut(predicate: (value: T, key: T, set: ExtendedSet<T>) => boolean, thisArg: any = this): ExtendedSet<T> {
		const set = new ExtendedSet<T>()

		for (const value of this) {
			if (!predicate.call(thisArg, value, value, this)) {
				set.add(value)
			}
		}

		return set
	}

	public map(callbackfn: (value: T, key: T, set: ExtendedSet<T>) => any): ExtendedSet<T>
	public map<T>(callbackfn: (value: T, key: T, set: ExtendedSet<T>) => T): ExtendedSet<T>
	public map<U>(callbackfn: (value: T, key: T, set: ExtendedSet<T>) => any, thisArg: U): ExtendedSet<T>
	public map<T, U>(callbackfn: (value: T, key: T, set: ExtendedSet<T>) => T, thisArg: U): ExtendedSet<T> 
	public map(callbackfn: (value: T, key: T, set: ExtendedSet<T>) => any, thisArg: any = this): ExtendedSet<T> {
		const set = new ExtendedSet<T>()

		for (const value of this) {
			set.add(callbackfn.call(thisArg, value, value, this))
		}

		return set
	}

	public find(predicate: (value: T, key: T, set: ExtendedSet<T>) => boolean): T | undefined
    public find<U>(predicate: (value: T, key: T, set: ExtendedSet<T>) => boolean, thisArg: U): T | undefined
    public find(predicate: (value: T, key: T, set: ExtendedSet<T>) => boolean, thisArg: any = this): T | undefined {
		for (const value of this) {
			if (predicate.call(thisArg, value, value, this)) {
				return value
			}
		}

		return undefined
	}

	public reduce<U>(callbackfn: (memo: U, value: T, key: T, set: ExtendedSet<T>) => U): U
	public reduce<U>(callbackfn: (memo: U, value: T, key: T, set: ExtendedSet<T>) => U, initialValue: U): U
	public reduce<U>(callbackfn: (memo: U, value: T, key: T, set: ExtendedSet<T>) => U, initialValue?: U): U {
		let initial: boolean = !!initialValue
        let accumulator = initial ? initialValue : undefined

        for (const value of this) {
            if (initial) {
                accumulator = callbackfn(accumulator, value, value, this)
            } else {
                initial = false
                accumulator = value as unknown as U
            }
        }

        return accumulator
	}

	public some(predicate: (value: T, key: T, set: ExtendedSet<T>) => boolean): boolean
    public some<T>(predicate: (value: T, key: T, set: ExtendedSet<T>) => boolean, thisArg: T): boolean
    public some(predicate: (value: T, key: T, set: ExtendedSet<T>) => boolean, thisArg: any = this): boolean {
		for (const value of this) {
			if (predicate.call(thisArg, value, value, this)) {
				return true
			}
		}

		return false
	}

	public has(value: T): boolean {
		return super.has(this.coerceValue?.(value) ?? value);
	}

	public every(predicate: (value: T, key: T, set: ExtendedSet<T>) => boolean): boolean
    public every<T>(predicate: (value: T, key: T, set: ExtendedSet<T>) => boolean, thisArg: T): boolean
    public every(predicate: (value: T, key: T, set: ExtendedSet<T>) => boolean, thisArg: any = this): boolean {
		for (const value of this) {
			if (!predicate.call(thisArg, value, value, this)) {
				return false
			}
		}

		return true
	}

	public addAll(...values: T[]): ExtendedSet<T> {
		for (const value of values) {
			this.add(value)
		}

		return this
	}

	public toArray(): T[] {
		return [...this.values()]
	}

	public deleteAll(...values: T[]): boolean {
		let finished = true

        for (const value of values) {
            finished = finished && this.delete(value)
        }

        return !!finished
	}

	public union(iterable: Iterable<T>): ExtendedSet<T>
	public union<U>(iterable: Iterable<U>): ExtendedSet<T>
	public union(iterable: Iterable<any>): ExtendedSet<T> {
		return new ExtendedSet<T>([...this, ...iterable])
	}

	public difference(iterable: Iterable<T>): ExtendedSet<T>
	public difference<U>(iterable: Iterable<U>): ExtendedSet<T>
	public difference(iterable: Iterable<any>): ExtendedSet<T> {
		const set = new ExtendedSet<T>([...this])

		for (const item of iterable) {
			set.delete(item)
		}

		return set
	}

	public intersection(iterable: Iterable<T>): ExtendedSet<T>
	public intersection<U>(iterable: Iterable<U>): ExtendedSet<T>
	public intersection(iterable: Iterable<any>): ExtendedSet<T> {
		const set = new ExtendedSet<T>([...this])

		for (const item of iterable) {
			if (this.has(item)) {
				set.add(item)
			}
		}

		return set
	}

	public symmetricDifference(iterable: Iterable<T>): ExtendedSet<T>
	public symmetricDifference<U>(iterable: Iterable<U>): ExtendedSet<T>
	public symmetricDifference(iterable: Iterable<any>): ExtendedSet<T> {
		const set = new ExtendedSet<T>([...this])

		for (const item of iterable) {
			set.delete(item) || set.add(item)
		}

		return set
	}

	public isSubsetOf(iterable: Iterable<T>): boolean
	public isSubsetOf<U>(iterable: Iterable<U>): boolean
	public isSubsetOf(iterable: Iterable<any>): boolean {
		const set = new Set([...iterable])

		for (const item of iterable) {
			if (!set.has(item)) {
				return false
			}
		}

		return true
	}

	public isDisjointFrom(iterable: Iterable<T>): boolean
	public isDisjointFrom<U>(iterable: Iterable<U>): boolean
	public isDisjointFrom(iterable: Iterable<any>): boolean {
		for (const item of iterable) {
			if (this.has(item)) {
				return false
			}
		}

		return true
	}

	public isSupersetOf(iterable: Iterable<T>): boolean
	public isSupersetOf<U>(iterable: Iterable<U>): boolean
	public isSupersetOf(iterable: Iterable<any>): boolean {
		for (const item of iterable) {
			if (!this.has(item)) {
				return false
			}
		}

		return true
	}
}
