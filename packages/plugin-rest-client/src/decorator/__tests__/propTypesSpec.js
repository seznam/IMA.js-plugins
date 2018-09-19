
import propTypes from '../propTypes';
import AbstractEntity from '../../AbstractEntity';

describe('propTypes', () => {

	it('should configure the propTypes property', () => {
		class Entity extends AbstractEntity {}

		propTypes({ id: 'integer:>0' })(Entity);
		expect(Entity.propTypes).toEqual({ id: 'integer:>0' });
	});

});
