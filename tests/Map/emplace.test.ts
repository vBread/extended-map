import { expect } from 'chai';
import { ExtendedMap } from '../../src/index';

const map = new ExtendedMap([['black', '#fffff']]);

describe('ExtendedMap', () => {
	describe('#emplace.update', () => {
		it("should update the value of black from '#ffffff' to '#000000'", () => {
			map.emplace('black', {
				update: () => '#000000',
			});

			expect(map.get('black')).to.be.a('string').and.equal('#000000');
		});
	});

	describe('#emplace.insert', () => {
		it("should insert white and set it's value to #ffffff", () => {
			map.emplace('white', {
				insert: () => '#ffffff',
			});

			expect(map.get('white')).to.be.a('string').and.equal('#ffffff');
		});
	});

	describe('#emplace', () => {
		it('should have mutated the original Map', () => {
			expect(map).to.have.all.keys('black', 'white');
			expect(map.get('black')).to.equal('#000000');
			expect(map.get('white')).to.equal('#ffffff');
		});
	});
});
