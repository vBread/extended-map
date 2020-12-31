import { expect } from 'chai'
import { ExtendedMap } from './index'

const colors = new ExtendedMap<string, string>([
    ['red', '#ff0000'],
    ['orange', '#ffa500'],
    ['yellow', '#ffff00'],
    ['green', '#008000'],
    ['blue', '#0000ff'],
    ['indigo', '#4b0082'],
    ['violet', '#ee82ee'],
    ['black', '#fffff']
])

describe('ExtendedMap', () => {
    describe('.from', () => {
        it('should create a map', () => {
            const map = ExtendedMap.from([[1, 2], [3, 4]])
            
            expect(map).to.be.instanceOf(ExtendedMap)
        })
    })

    describe('.groupBy', () => {
        it('should create a map with grouped values', () => {
            const map = ExtendedMap.groupBy([[1, 2], [3, 4, 5], [6, 7, 8], [9, 10]], (value) => value.length)

            expect(map).to.have.all.keys(2 as any, 3 as any)
        })
    })

    describe('#merge', () => {
        it('should merge two iterables', () => {
            colors.merge([['cyan', '#00ffff']])

            expect(colors).to.include('#00ffff')
        })
    })

    describe('#emplace', () => {
        it('should update the value of black and insert white', () => {
            colors.emplace('black', {
                update: () => '#000000'
            })

            colors.emplace('white', {
                insert: () => '#ffffff'
            })

            expect(colors.get('black')).to.equal('#000000')
            expect(colors.get('white')).to.equal('#ffffff')
        })
    })

    describe('#array', () => {
        it('should return an array of values', () => {
            const array = colors.array()

            expect(array).to.be.an('array').with.lengthOf(colors.size)
        })
    })

    describe('#keyOf', () => {
        it('should return the key of the value', () => {
            for (const [key, value] of colors.entries()) {
                expect(key).to.equal(colors.keyOf(value))
            }
        })
    })

    describe('#mapKeys', () => {
        it('should capitalize each key', () => {
            const map = colors.mapKeys((_, key) => key.toUpperCase())

            for (const [key, value] of colors.entries()) {
                expect(key.toUpperCase()).to.equal(map.keyOf(value))
            }
        })
    })

    describe('#map', () => {
        it('should capitalize each value', () => {
            const map = colors.map((value) => value.toUpperCase())

            for (const [key, value] of colors.entries()) {
                expect(value.toUpperCase()).to.equal(map.get(key))
            }
        })
    })

    describe('#deleteAll', () => {
        it('should empty the map', () => {
            colors.deleteAll()

            expect(colors).to.be.empty
        })
    })
})