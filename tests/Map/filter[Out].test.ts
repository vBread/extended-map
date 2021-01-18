import { expect } from 'chai';
import { ExtendedMap } from '../../src/index';

const map = new ExtendedMap([
	['1', 'one'],
	['2', 'two'],
	['3', 'three'],
	['4', 'four'],
	['5', 'five'],
]);

describe('ExtendedMap', () => {
	describe('#filter', () => {
		it('should keep any entries whose key modulo 2 is equal to 1', () => {
			const filtered = map.filter((_, key) => Number(key) % 2 === 1);

			expect(filtered).to.have.all.keys('1', '3', '5');
		});
	});

	describe('#filterOut', () => {
		it('should keep any entries whose key modulo 2 is not equal to 1', () => {
			const filtered = map.filterOut((_, key) => Number(key) % 2 === 1);

			expect(filtered).to.have.all.keys('2', '4');
		});
	});
});
