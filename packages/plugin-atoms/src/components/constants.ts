export const LAYOUT = {
  RESPONSIVE: 'responsive',
  FILL: 'fill',
} as const;

export const LOADING = {
  LAZY: 'lazy',
  EAGER: 'eager',
} as const;

// https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement
const GLOBAL_ATTRIBUTES = [
  'accesskey',
  'autocapitalize',
  'autofocus',
  //'class', react className
  'contenteditable',
  'dir',
  'draggable',
  'enterkeyhint',
  'hidden',
  'id',
  'inert',
  'inputmode',
  'is',
  'itemid',
  'itemprop',
  'itemref',
  'itemscope',
  'itemtype',
  'lang',
  'nonce',
  'popover',
  'slot',
  'spellcheck',
  'style',
  'tabindex',
  'title',
  'translate',
];

// https://developer.mozilla.org/en-US/docs/Web/API/HTMLAnchorElement
export const LINK_ATTRIBUTES = [
  ...GLOBAL_ATTRIBUTES,
  //'charset', deprectecated
  //'coords', deprectecated
  'download',
  'href',
  'hreflang',
  //'name', deprectecated
  'ping',
  'referrerpolicy',
  'rel',
  //'rev', deprectecated
  'shape',
  'target',
  'type',
];

// https://developer.mozilla.org/en-US/docs/Web/API/HTMLIFrameElement
export const IFRAME_ATTRIBUTES = [
  ...GLOBAL_ATTRIBUTES,
  //'align', deprectecated
  'allow',
  'allowfullscreen',
  //'allowpaymentrequest', deprectecated
  //'frameborder', deprectecated
  'height',
  'loading',
  //'longdesc', deprectecated
  //'marginheight', deprectecated
  //'marginwidth', deprectecated
  'name',
  'referrerpolicy',
  'sandbox',
  //'scrolling', deprectecated
  'src',
  'srcdoc',
  'width',
];

// https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement
export const IMAGE_ATTRIBUTES = [
  ...GLOBAL_ATTRIBUTES,
  //'align', deprectecated
  'alt',
  //'border', deprectecated
  'crossorigin',
  'decoding',
  'fetchpriority',
  'height',
  //'hspace', deprectecated
  'ismap',
  'loading',
  //'longdesc', deprectecated
  //'name', deprectecated
  'referrerpolicy',
  'sizes',
  'src',
  'srcset',
  'usemap',
  //'vspace', deprectecated
  'width',
];

export const LIST_ATTRIBUTES = [...GLOBAL_ATTRIBUTES, 'compact', 'type'];
export const LIST_ITEM_ATTRIBUTES = [...GLOBAL_ATTRIBUTES, 'type', 'value'];
export const HEADLINE_ATTRIBUTES = [...GLOBAL_ATTRIBUTES];
export const DIV_ATTRIBUTES = [...GLOBAL_ATTRIBUTES];
export const PARAGRAPH_ATTRIBUTES = [...GLOBAL_ATTRIBUTES];
