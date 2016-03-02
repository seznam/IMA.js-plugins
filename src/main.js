import AbstractAnalytic from './AbstractAnalytic.js';
import Events from './Events.js';

var $registerImaPlugin = (ns) => {
	ns.namespace('ima.plugin.analytic');

	ns.ima.plugin.analytic.AbstractAnalytic = AbstractAnalytic;
	ns.ima.plugin.analytic.Events = Events;
};

export { AbstractAnalytic, Events, $registerImaPlugin };
