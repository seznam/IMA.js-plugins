import AbstractAnalytic from './AbstractAnalytic';
import Events from './Events';

const defaultDependencies = AbstractAnalytic.$dependencies;

const $registerImaPlugin = () => {};

export { AbstractAnalytic, Events, defaultDependencies, $registerImaPlugin };
