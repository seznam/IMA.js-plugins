import Main from '../src/main';

describe('Main', () => {
	it('should has EVENTS', () => {
		expect(typeof Main.EVENTS.LOADED).toEqual('string');
	});

	it('should has Service', () => {
		expect(typeof Main.Service).toEqual('function');
	});
});
