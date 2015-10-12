import Abstract from './abstract.js';
import Dot from './dot.js';
import Google from './google.js';

export default init = (ns, oc, config) => {

	ns.namespace('Seznam.Analytic');

	ns.Seznam.Analytic.Abstract = Abstract;
	ns.Seznam.Analytic.Dot = Dot;
	ns.Seznam.Analytic.Google = Google;

	oc.bind('GoogleAnalytic', ns.Seznam.Analytic.Google, ['$window']);
	oc.bind('DotAnalytic', ns.Seznam.Analytic.Dot, ['$window']);

};
