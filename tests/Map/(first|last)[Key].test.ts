import { expect } from 'chai';
import { ExtendedMap } from '../../src/index';

const map = new ExtendedMap([
	['foo', 'bar'],
	['baz', '42'],
	['yes', 'no'],
]);

describe('ExtendedMap', () => {
	describe('#first', () => {
		it('should return the first value (bar)', () => {
			expect(map.first()).to.be.a('string').and.equal('bar');
		});
	});

	describe('#firstKey', () => {
		it('should return the first key (foo)', () => {
			expect(map.firstKey()).to.be.a('string').and.equal('foo');
		});
	});

	describe('#last', () => {
		it('should return the last value (no)', () => {
			expect(map.last()).to.be.a('string').and.equal('no');
		});
	});

	describe('#lastKey', () => {
		it('should return the last key (yes)', () => {
			expect(map.lastKey()).to.be.a('string').and.equal('yes');
		});
	});
});
