import { expect } from 'chai';
import { ExtendedMap } from '../../src/index';

const map = new ExtendedMap([
	['red', '#ff0000'],
	['orange', '#ffa500'],
	['yellow', '#ffff00'],
]);

describe('ExtendedMap', () => {
	describe('#mapKeys', () => {
		it('should capitalize each key', () => {
			const mapped = map.mapKeys((_, key) => key.toUpperCase());

			for (const [key, value] of map.entries()) {
				expect(key.toUpperCase()).to.equal(mapped.keyOf(value));
			}
		});
	});

	describe('#map', () => {
		it('should capitalize each value', () => {
			const mapped = map.map((value) => value.toUpperCase());

			for (const [key, value] of map.entries()) {
				expect(value.toUpperCase()).to.equal(mapped.get(key));
			}
		});
	});
});
