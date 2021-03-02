import 'jest-extended';
import { ExtendedSet } from './';

const set = new ExtendedSet([1, 2, 3]);

test('Set#symmetricDifference', () => {
	expect([...set.symmetricDifference([3, 4])]).toIncludeAllMembers([1, 2, 4]);
});
