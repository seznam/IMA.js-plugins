import type { MediaUnit, PropertyValue } from './utils';
import { asMedia } from './utils';

export type MediaType = 'all' | 'print' | 'screen' | 'speech';

export function maxWidthMedia(
  maxWidth: PropertyValue,
  type: MediaType = 'all'
): MediaUnit {
  return asMedia(`~"${type} and (max-width: ${maxWidth.toString()})"`);
}

export function minWidthMedia(
  minWidth: PropertyValue,
  type: MediaType = 'all'
): MediaUnit {
  return asMedia(`~"${type} and (min-width: ${minWidth.toString()})"`);
}

export function minAndMaxWidthMedia(
  minWidth: PropertyValue,
  maxWidth: PropertyValue,
  type: MediaType = 'all'
): MediaUnit {
  return asMedia(
    `~"${type} and (min-width: ${minWidth.toString()}) and (max-width: ${maxWidth.toString()})"`
  );
}

export function maxHeightMedia(
  maxHeight: PropertyValue,
  type: MediaType = 'all'
): MediaUnit {
  return asMedia(`~"${type} and (max-height: ${maxHeight.toString()})"`);
}

export function minHeightMedia(
  minHeight: PropertyValue,
  type: MediaType = 'all'
): MediaUnit {
  return asMedia(`~"${type} and (min-height: ${minHeight.toString()})"`);
}
