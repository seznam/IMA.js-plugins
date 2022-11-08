import util from 'util';

var root = typeof window !== 'undefined' && window !== null ? window : global;

root.TextEncoder = util.TextEncoder;
root.TextDecoder = util.TextDecoder;

import Adapter from '@cfaester/enzyme-adapter-react-18';
import Enzyme from 'enzyme';

Enzyme.configure({ adapter: new Adapter() });
