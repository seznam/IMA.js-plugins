
import inlineResponseBody from '../inlineResponseBody';
import AbstractEntity from '../../AbstractEntity';

describe('inlineResponseBody', () => {

	it('should configure the inlineResponseBody property', () => {
		class Entity extends AbstractEntity {}

		inlineResponseBody(Entity);
		expect(Entity.inlineResponseBody).toBe(true);
	});

});
