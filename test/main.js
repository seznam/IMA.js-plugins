import * as Main from '../src/main';

describe('Main', () => {
	it('should export __$IMAModuleRegister__', () => {
		expect(typeof Main.__$IMAModuleRegister__).toEqual('function');
	});

	it('should export Google', () => {
		expect(typeof Main.Google).toEqual('function');
	});

	it('should export Google', () => {
		expect(Main.default).toEqual({ Google: Main.Google });
	});
});
