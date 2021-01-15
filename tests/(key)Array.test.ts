import { expect } from 'chai'
import { ExtendedMap } from '../src/index'

const map = new ExtendedMap([
	['a', 1],
	['b', 2],
	['c', 3],
	['d', 4]
])

describe('ExtendedMap', () => {
	describe('#keyArray', () => {
		it('should return an array of keys', () => {
			expect(map.keyArray()).to.be.an('array').and.have.lengthOf(4).with.members([...map.keys()])
		})
	})

	describe('#array', () => {
		it('should return an array of values', () => {
			expect(map.keyArray()).to.be.an('array').and.have.lengthOf(4).with.members([...map.values()])
		})
	})
})