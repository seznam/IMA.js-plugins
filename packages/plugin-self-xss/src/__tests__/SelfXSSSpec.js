import SelfXSS from '../SelfXSS';

describe('SelfXSS', () => {

	let dummyWindow = {
		isClient() {
			return true;
		},
		getWindow() {
			return {
				console: {
					log() {}
				}
			};
		}
	};

	let dummyDictionary = {
		has() {},
		get() {}
	};

	global.$Debug = true;
	let selfXSS = null;

	beforeEach(() => {
		selfXSS = new SelfXSS(
			dummyWindow,
			dummyDictionary
		);
	});

	describe('init method', () => {

		it('should do nothing for server side', () => {
			spyOn(dummyDictionary, 'has');
			spyOn(dummyWindow, 'isClient')
				.and
				.returnValue(false);

			selfXSS.init();

			expect(dummyDictionary.has).not.toHaveBeenCalled();
		});

		it('should do nothing for missing console', () => {
			spyOn(dummyDictionary, 'has');
			spyOn(dummyWindow, 'getWindow')
				.and
				.returnValue({});

			selfXSS.init();

			expect(dummyDictionary.has).not.toHaveBeenCalled();
		});

		it('should throw error for bad configurated dictionary', () => {
			spyOn(dummyDictionary, 'has')
				.and
				.returnValue(false);

			expect(() => selfXSS.init()).toThrow();
		});

		it('should log self XSS message to console', () => {
			spyOn(dummyDictionary, 'has')
				.and
				.returnValue(true);
			spyOn(dummyDictionary, 'get')
				.and
				.returnValue('string');
			spyOn(console, 'log');

			selfXSS.init();

			expect(console.log).toHaveBeenCalled();
		});

	});

});
