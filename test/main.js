import Main from '../src/main';

describe('Main', () => {
	it('should has Abstract analytic class', () => {
		expect(typeof Main.Abstract === 'function').toEqual(true);
	});

	it('should has constant value EVENTS', () => {
		expect(typeof Main.EVENTS === 'object').toEqual(true);
	});
});
