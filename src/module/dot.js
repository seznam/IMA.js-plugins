import BaseAnalytic from '../base/analytic.js';

export default class DotModule extends ns.Core.Analytic.Interface {
	constructor() {
		super();
	}

	hit() {
		console.log('DOT hit');
	}
}