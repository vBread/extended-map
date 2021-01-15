import { expect } from 'chai'
import { ExtendedMap } from '../src/index'

const map = new ExtendedMap([
	['1', 'one'],
	['2', 'two'],
	['3', 'three'],
	['4', 'four'],
	['5', 'five']
])

describe('ExtendedMap#at', () => {
	it('should return an array equal to [3, \'three\']', () => {
		expect(map.at(2)).to.have.lengthOf(2).and.have.members(['3', 'three'])
	})
})
