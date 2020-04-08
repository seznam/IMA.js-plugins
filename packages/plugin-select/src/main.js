import forwardedSelect, {
  select,
  createStateSelector,
  hoistNonReactStatic,
  setCreatorOfStateSelector,
  setHoistStaticMethod,
} from './select/select';

function $registerImaPlugin() {}

export default forwardedSelect;

export {
  $registerImaPlugin,
  createStateSelector,
  hoistNonReactStatic,
  select,
  setCreatorOfStateSelector,
  setHoistStaticMethod,
};
