import { expect } from 'chai'
import { ExtendedMap } from '../src/index'


describe('ExtendedMap.groupBy', () => {
	it('should create an ExtendedMap with values grouped by length', () => {
		const map = ExtendedMap.groupBy([[1, 2], [3, 4, 5], [6, 7, 8], [9, 10]], (value) => value.length)

		expect(map).to.be.instanceof(ExtendedMap).and.have.all.keys(2 as any, 3 as any)
	})
})