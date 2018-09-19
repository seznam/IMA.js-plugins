
import resourceName from '../resourceName';
import AbstractEntity from '../../AbstractEntity';

describe('resourceName', () => {

	it('should configure the resourceName property', () => {
		class Entity extends AbstractEntity {}

		resourceName('fooBar')(Entity);
		expect(Entity.resourceName).toBe('fooBar');
	});

});
