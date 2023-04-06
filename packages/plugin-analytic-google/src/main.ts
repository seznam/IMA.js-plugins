import GoogleAnalytic from './GoogleAnalytic.js';
import GoogleAnalytics4 from './GoogleAnalytics4.js';
import './register';

const defaultDependencies = GoogleAnalytic.$dependencies;
const googleAnalytics4DefaultDependencies = GoogleAnalytics4.$dependencies;

export {
  GoogleAnalytic,
  GoogleAnalytics4,
  defaultDependencies,
  googleAnalytics4DefaultDependencies,
};
