import select, {
  createStateSelector,
  hoistNonReactStatic,
  setCreatorOfStateSelector,
  setHoistStaticMethod
} from './select/select';

function $registerImaPlugin() {}

export default select;

export {
  $registerImaPlugin,
  createStateSelector,
  hoistNonReactStatic,
  select,
  setCreatorOfStateSelector,
  setHoistStaticMethod
};
