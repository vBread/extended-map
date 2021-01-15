import { expect } from 'chai'
import { ExtendedMap } from '../src/index'

const map = new ExtendedMap([['black', '#fffff']])

describe('ExtendedMap#emplace', () => {
	it('should update the value of black and insert white', () => {
		map.emplace('black', {
			update: () => '#000000'
		})

		map.emplace('white', {
			insert: () => '#ffffff'
		})

		expect(map).to.have.all.keys('black', 'white')
		expect(map.get('black')).to.equal('#000000')
		expect(map.get('white')).to.equal('#ffffff')
	})
})