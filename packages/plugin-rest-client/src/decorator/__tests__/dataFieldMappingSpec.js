
import dataFieldMapping from '../dataFieldMapping';
import AbstractEntity from '../../AbstractEntity';

describe('dataFieldMapping', () => {

	it('should configure the dataFieldMapping property', () => {
		class Entity extends AbstractEntity {}

		dataFieldMapping({ id: '_id' })(Entity);
		expect(Entity.dataFieldMapping).toEqual({ id: '_id' });
	});

});
