import forwardedSelect, {
  select,
  useSelect,
  createStateSelector,
  hoistNonReactStatic,
  setCreatorOfStateSelector,
  setHoistStaticMethod
} from './select/select';

function $registerImaPlugin() {}

export default forwardedSelect;

export {
  $registerImaPlugin,
  createStateSelector,
  hoistNonReactStatic,
  select,
  useSelect,
  setCreatorOfStateSelector,
  setHoistStaticMethod
};
