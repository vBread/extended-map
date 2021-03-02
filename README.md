# Extended Collections

Modern polyfills of [Stage 1 Collection Methods](https://github.com/zloirock/core-js#new-collections-methods), including additional utility methods adapted from other languages, such as [C#](https://docs.microsoft.com/en-us/dotnet/api/system.collections.generic.hashset-1?view=net-5.0), [Haskell](http://hackage.haskell.org/package/containers-0.5.10.2/docs/Data-Set.html), [Python](https://docs.python.org/3.6/library/stdtypes.html#set), [Hack](https://docs.hhvm.com/hack/reference/class/HH.Set/), and [Ruby](https://ruby-doc.org/stdlib-2.5.0/libdoc/set/rdoc/Set.html) to make Collections even more versatile.

<!-- markdownlint-disable-next-line -->
# Map\*

[`new Map([iterable[, handler]])`](https://tc39.es/proposal-collection-normalization/#normalization-ops)

## Static

- [`Map.from`](https://tc39.es/proposal-setmap-offrom/#sec-map.from)
- [`Map.groupBy`](https://tc39.es/proposal-collection-methods/#Map.groupBy)
- `Map.isMap`
- [`Map.keyBy`](https://tc39.es/proposal-collection-methods/#Map.keyBy)
- [`Map.of`](https://tc39.es/proposal-setmap-offrom/#sec-map.of)

## Instance

- [`Map.prototype.at`](https://tc39.es/proposal-relative-indexing-method/)††
- [`Map.prototype.deleteAll`](https://tc39.es/proposal-collection-methods/#Map.prototype.deleteAll)
- [`Map.prototype.emplace`](https://tc39.es/proposal-upsert/#sec-map.prototype.emplace)
- [`Map.prototype.every`](https://tc39.es/proposal-collection-methods/#Map.prototype.every)
- [`Map.prototype.filter`](https://tc39.es/proposal-collection-methods/#Map.prototype.filter)
- [`Map.prototype.findKey`](https://tc39.es/proposal-collection-methods/#Map.prototype.findKey)
- [`Map.prototype.find`](https://tc39.es/proposal-collection-methods/#Map.prototype.find)
- `Map.prototype.hasAll`
- [`Map.prototype.includes`](https://tc39.es/proposal-collection-methods/#Map.prototype.includes)
- [`Map.prototype.keyOf`](https://tc39.es/proposal-collection-methods/#Map.prototype.keyOf)
- [`Map.prototype.mapKeys`](https://tc39.es/proposal-collection-methods/#Map.prototype.mapKeys)
- [`Map.prototype.mapValues`](https://tc39.es/proposal-collection-methods/#Map.prototype.mapValues)†
- [`Map.prototype.merge`](https://tc39.es/proposal-collection-methods/#Map.prototype.merge)
- `Map.prototype.partition`
- `Map.prototype.random`
- `Map.prototype.randomKey`
- [`Map.prototype.reduce`](https://tc39.es/proposal-collection-methods/#Map.prototype.reduce)
- [`Map.prototype.some`](https://tc39.es/proposal-collection-methods/#Map.prototype.some)
- [`Map.prototype.uniqueBy`](https://github.com/tc39/proposal-array-unique)††
- [`Map.prototype.update`](https://tc39.es/proposal-collection-methods/#Map.prototype.update)

\*If a method can be called on both keys and values, the method will target the Map's values by default and will have an implementation which targets the Map's keys (e.g., `.find` and `.findKey`)  
† `.mapValues` is called `.map` for consistency  
†† Adapted to work with Map

## Planned

- `Map.prototype.flat`
- `Map.prototype.flatMap`

<!-- markdownlint-disable-next-line -->
# Set

[`new Set([iterable[, coerceValue]])`](https://tc39.es/proposal-collection-normalization/#normalization-ops)

<!-- markdownlint-disable-next-line -->
## Static

- [`Set.from`](https://tc39.es/proposal-setmap-offrom/#sec-set.from)
- `Set.isSet`
- [`Set.of`](https://tc39.es/proposal-setmap-offrom/#sec-set.of)

<!-- markdownlint-disable-next-line -->
## Instance

- [`Set.prototype.addAll`](https://tc39.es/proposal-collection-methods/#Set.prototype.addAll)
- [`Set.prototype.at`](https://tc39.es/proposal-relative-indexing-method/)\*
- [`Set.prototype.copyTo`](https://docs.microsoft.com/en-us/dotnet/api/system.collections.generic.hashset-1.copyto?view=net-5.0)
- [`Set.prototype.deleteAll`](https://tc39.es/proposal-collection-methods/#Set.prototype.deleteAll)
- [`Set.prototype.difference`](https://tc39.es/proposal-set-methods/#Set.prototype.difference)
- [`Set.prototype.every`](https://tc39.es/proposal-collection-methods/#Set.prototype.every)
- [`Set.prototype.filter`](https://tc39.es/proposal-collection-methods/#Set.prototype.filter)
- [`Set.prototype.find`](https://tc39.es/proposal-collection-methods/#Set.prototype.find)
- `Set.prototype.hasAll`
- [`Set.prototype.intersection`](https://tc39.es/proposal-set-methods/#Set.prototype.intersection)
- [`Set.prototype.isDisjointFrom`](https://tc39.es/proposal-set-methods/#Set.prototype.isDisjointFrom)
- [`Set.prototype.isSubsetOf`](https://tc39.es/proposal-set-methods/#Set.prototype.isSubsetOf)
- [`Set.prototype.isSupersetOf`](https://tc39.es/proposal-set-methods/#Set.prototype.isSupersetOf)
- [`Set.prototype.join`](https://tc39.es/proposal-collection-methods/#Set.prototype.join)
- [`Set.prototype.map`](https://tc39.es/proposal-collection-methods/#Set.prototype.map)
- `Set.prototype.partition`
- [`Set.prototype.reduce`](https://tc39.es/proposal-collection-methods/#Set.prototype.reduce)
- [`Set.prototype.some`](https://tc39.es/proposal-collection-methods/#Set.prototype.some)
- [`Set.prototype.symmetricDifference`](https://tc39.es/proposal-set-methods/#Set.prototype.symmetricDifference)
- [`Set.prototype.union`](https://tc39.es/proposal-set-methods/#Set.prototype.union)

\* Adapted to work with Set

<!-- markdownlint-disable-next-line -->
## Planned

- `Set.prototype.flat`
- `Set.prototype.flatMap`
