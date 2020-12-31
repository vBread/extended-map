# Map Implementations

Modern TS polyfills of [Stage 1 Collection Methods](https://github.com/zloirock/core-js#new-collections-methods)  

If a method can be called on both keys and values, the method will target the Map's values by default and will have an implementation which targets the Map's keys (e.g., `.find` and `.findKey`).

## Proposed Methods

### Static

- [`Map.from`](https://tc39.es/proposal-setmap-offrom/#sec-map.from)
- [`Map.groupBy`](https://tc39.es/proposal-collection-methods/#Map.groupBy)
- [`Map.keyBy`](https://tc39.es/proposal-collection-methods/#Map.keyBy)
- [`Map.of`](https://tc39.es/proposal-setmap-offrom/#sec-map.of)
  
### Instance

- [`Map.prototype.deleteAll`](https://tc39.es/proposal-collection-methods/#Map.prototype.deleteAll)
- [`Map.prototype.emplace`](https://tc39.es/proposal-upsert/)
- [`Map.prototype.every`](https://tc39.es/proposal-collection-methods/#Map.prototype.every)
- [`Map.prototype.filter`](https://tc39.es/proposal-collection-methods/#Map.prototype.filter)
- [`Map.prototype.findKey`](https://tc39.es/proposal-collection-methods/#Map.prototype.findKey)
- [`Map.prototype.find`](https://tc39.es/proposal-collection-methods/#Map.prototype.find)
- [`Map.prototype.includes`](https://tc39.es/proposal-collection-methods/#Map.prototype.includes)
- [`Map.prototype.keyOf`](https://tc39.es/proposal-collection-methods/#Map.prototype.keyOf)
- [`Map.prototype.mapKeys`](https://tc39.es/proposal-collection-methods/#Map.prototype.mapKeys)
- [`Map.prototype.mapValues`](https://tc39.es/proposal-collection-methods/#Map.prototype.mapValues)\*
- [`Map.prototype.merge`](https://tc39.es/proposal-collection-methods/#Map.prototype.merge)
- [`Map.prototype.reduce`](https://tc39.es/proposal-collection-methods/#Map.prototype.reduce)
- [`Map.prototype.some`](https://tc39.es/proposal-collection-methods/#Map.prototype.some)

\* `.mapValues` is called `.map` for consistency

## Custom Methods

<!-- markdownlint-disable-next-line -->
### Instance

- [`Map.prototype.array`]
- [`Map.prototype.keyArray`]
