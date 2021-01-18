import { expect } from 'chai';
import { ExtendedMap } from '../../src/index';

const map = new ExtendedMap([
	['a', 1],
	['b', 2],
	['c', 3],
	['d', 4],
]);

describe('ExtendedMap', () => {
	describe('#toKeyArray', () => {
		it('should return an array of keys', () => {
			expect(map.toKeyArray())
				.to.be.an('array')
				.and.have.lengthOf(4)
				.with.members([...map.keys()]);
		});
	});

	describe('#toArray', () => {
		it('should return an array of values', () => {
			expect(map.toArray())
				.to.be.an('array')
				.and.have.lengthOf(4)
				.with.members([...map.values()]);
		});
	});
});
