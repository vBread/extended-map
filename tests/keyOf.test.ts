import { expect } from 'chai'
import { ExtendedMap } from '../src/index'

const map = new ExtendedMap([['1', 2], ['3', 4]])

describe('ExtendedMap#keyOf', () => {
	it('should return the key of the value', () => {
		for (const [key, value] of map.entries()) {
			expect(key).to.equal(map.keyOf(value))
		}
	})
})