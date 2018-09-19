
import idFieldName from '../idFieldName';
import AbstractEntity from '../../AbstractEntity';

describe('idFieldName', () => {

	it('should configure the idFieldName property', () => {
		class Entity extends AbstractEntity {}

		idFieldName('id')(Entity);
		expect(Entity.idFieldName).toBe('id');
	});

});
