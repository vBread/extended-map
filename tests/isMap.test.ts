import { expect } from 'chai'
import { ExtendedMap } from '../src/index'

describe('ExtendedMap.isMap', () => {
	it('should return true', () => {
		expect(ExtendedMap.isMap(new Map())).to.be.true
	})

	it('should return false', () => {
		expect(ExtendedMap.isMap('string')).to.be.false
		expect(ExtendedMap.isMap({ a: 1 })).to.be.false
		expect(ExtendedMap.isMap([1, 2, 3])).to.be.false
	})
})