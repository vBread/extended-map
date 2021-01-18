import { expect } from 'chai';
import { ExtendedMap } from '../../src/index';

describe('ExtendedMap.from', () => {
	it('should create an instance of ExtendedMap', () => {
		const map = ExtendedMap.from([
			['1', 2],
			['3', 4],
		]);

		expect(map).to.be.instanceOf(ExtendedMap).and.have.all.keys('1', '3');
	});
});
