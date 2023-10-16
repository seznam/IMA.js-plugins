---
"@ima/plugin-atoms": major
---

The AMP support is removed from package.

The headlines components have removed `mode` property. The css class of headline has changed from `atm-{Type}` to `atm-headline-{Type}`. All props are passed directly to element except of `children`, `html`, `className` and `type`.

The Iframe and Image have `layout` property which can be set to `LAYOUT.RESPONSIVE` or `LAYOUT.FILL`. The `layout` property for Image component is then transformed to inline style which can be override. The parent element must be set css property `position` at least to `relative` for layout value set to `LAYOUT.FILL`. The Iframe component keep behaviour with previous version. 

The Iframe component has removed deprectecated default value for `frameBorder: '0'` and `scrolling: 'no'`. The `no-loading` property is renamed to `loading`. The values can be set to `lazy` or `eager`. We changed that because we removed AMP support and `loading` property is native HTML attribute. The Iframe component use for lazy loading still JS implementation instead of native browser implementation. The benchmark test for native lazy loading `iframe` was worse than actual JS implementation. It can change in the future if browser behaviour change. Iframe component keep no-script behaviour but now use `serializeObjectToNoScript` method for transforming props to string.


For smooth transition we keep old Iframe implementation which is exported as `IframeDeprectecated` and will be removed in next major version of package.

The Image component use for lazy loading native browser feature through `loading` property which default value is set to `lazy` and `decoding` property is set to `async`. The Image component not use any `div` wrapper.

The Link, List, ListItem and Paragraph components have removed `mode` property.

The Loader component has removed `mode` and `layout` property. If you need define `small` or other size of Loader use `fontSize` directly in `style` property. For centering Loader in parent element use new `center` flag instead of `layout='center'`. 

All components are memoized. So if you pass function as prop use `useCallback` or something similar to pass same reference.

All components are not registered to `ima.ui.atom.*` namespace. If you need it in your project you can still do it with `ns.namespace` and `ns.set` methods directly in your project.

Plugin settings was removed because it don't need now.