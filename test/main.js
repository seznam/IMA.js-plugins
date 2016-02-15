import { Service, EVENTS, DefaultDependencies} from '../src/main';

describe('Main', () => {
	it('should has EVENTS', () => {
		expect(typeof EVENTS.LOADED).toEqual('string');
	});

	it('should has Service', () => {
		expect(typeof Service).toEqual('function');
	});

	it('should has DefaultDependencies', () => {
		expect(Array.isArray(DefaultDependencies)).toEqual(true);
	});
});
