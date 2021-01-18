import { expect } from 'chai';
import { ExtendedMap } from '../../src/index';

class User {
	constructor() {}
}

const A = new User();
const B = new User();
const C = new User();
const D = new User();
const E = new User();

const map = new ExtendedMap<any, any>(
	[
		[1, A],
		[2, B],
		[3, C],
		[4, D],
	],
	{
		coerceKey: (key) => {
			if (typeof key !== 'number') {
				throw new TypeError('Expected key to be a number');
			}

			return key;
		},
		coerceValue: (value) => {
			if (!(value instanceof User)) {
				throw new TypeError('Expected value to be a User');
			}

			return value;
		},
	}
);

describe('ExtendedMap', () => {
	describe('#coerceKey', () => {
		it("should throw a TypeError with a message of 'Expected key to be a number'", () => {
			expect(map.get.bind(map, '0')).to.throw(TypeError, 'Expected key to be a number');
		});
	});

	describe('#coerceValue', () => {
		it("should throw a TypeError with a message of 'Expected value to be a User'", () => {
			expect(map.set.bind(map, 5, 'E')).to.throw(TypeError, 'Expected value to be a User');
		});

		it('should insert 5 and not throw an error', () => {
			expect(map.set.bind(map, 5, E)).to.not.throw();
			expect(map.get(5)).to.be.instanceOf(User);
			expect(map).to.have.lengthOf(5);
		});
	});
});
