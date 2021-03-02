import 'jest-extended';
import { ExtendedMap } from './';

const map = new ExtendedMap([
	[1, 2],
	[3, 4],
	[5, 6],
	[7, 8],
	[9, 10]
]);

test('Map#at', () => {
	expect(map.at(2)).toIncludeAllMembers([5, 6]);
	expect(map.at(-1)).toIncludeAllMembers([9, 10]);
});
