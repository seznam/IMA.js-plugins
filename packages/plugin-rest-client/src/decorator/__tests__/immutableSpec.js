
import immutable from '../immutable';
import AbstractEntity from '../../AbstractEntity';

describe('immutable', () => {

	it('should configure the isImmutable property', () => {
		class Entity extends AbstractEntity {}

		immutable(Entity);
		expect(Entity.isImmutable).toBe(true);
	});

});
