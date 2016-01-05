import Dot from '../src/dot';
import EVENTS from '../src/events';

describe('Dot', () => {
	var dot = null;
	var window = {};
	var dispatcher = {};

	var routeName = 'home';
	var pageData = {
		route: {
			getName: () => routeName
		},
		params: {
			name: 1
		}
	};
	var config = {};

	beforeEach(() => {
		dot = new Dot(window, dispatcher, EVENTS, config);
	});

	describe('hitPageView method', () => {
		let hitData = { action: 'impress', page: routeName };

		beforeEach(() => {
			spyOn(dot, 'hit')
				.and
				.stub();

		});

		it('should be hit impress with route params', () => {
			dot.hitPageView(pageData);

			expect(dot.hit).toHaveBeenCalledWith(Object.assign({}, hitData, { routeParamName: 1 }));
		});

		it('should be hit impress without route params for empty params', () => {
			let emptyPageData = Object.assign({}, pageData, { params: {} });

			dot.hitPageView(emptyPageData);

			expect(dot.hit).toHaveBeenCalledWith(hitData);
		});

	});
});
