import Main from '../../src/main';

describe('Main', () => {
	it('should has Abstract analytic class', () => {
		expect(typeof Main.Abstract === 'function').toEqual(true);
	});

	it('should has Dot analytic class', () => {
		expect(typeof Main.Dot === 'function').toEqual(true);
	});

	it('should has Google analytic class', () => {
		expect(typeof Main.Google === 'function').toEqual(true);
	});

	it('should has Gemius analytic class', () => {
		expect(typeof Main.Gemius === 'function').toEqual(true);
	});

	it('should has constant value EVENTS', () => {
		expect(typeof Main.EVENTS === 'object').toEqual(true);
	});
});
