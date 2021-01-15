import { expect } from 'chai'
import { ExtendedMap } from '../src/index'

const map = new ExtendedMap([
	['a', 1],
	['b', 2]
])

describe('#merge', () => {
	it('should merge two iterables', () => {
		map.merge([['c', 3]])

		expect(map).to.have.all.keys('a', 'b', 'c')
	})

	it('should override the value of a', () => {
		map.merge([['a', 10]])

		expect(map).to.include(10)
	})
})