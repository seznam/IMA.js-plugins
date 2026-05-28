import type { MediaUnit, Unit } from './utils';
import { asMedia } from './utils';

export type MediaType = 'all' | 'print' | 'screen' | 'speech';

export function maxWidthMedia(
  maxWidth: Unit,
  type: MediaType = 'all'
): MediaUnit {
  return asMedia(`~"${type} and (max-width: ${maxWidth.toString()})"`);
}

export function minWidthMedia(
  minWidth: Unit,
  type: MediaType = 'all'
): MediaUnit {
  return asMedia(`~"${type} and (min-width: ${minWidth.toString()})"`);
}

export function minAndMaxWidthMedia(
  minWidth: Unit,
  maxWidth: Unit,
  type: MediaType = 'all'
): MediaUnit {
  return asMedia(
    `~"${type} and (min-width: ${minWidth.toString()}) and (max-width: ${maxWidth.toString()})"`
  );
}

export function maxHeightMedia(
  maxHeight: Unit,
  type: MediaType = 'all'
): MediaUnit {
  return asMedia(`~"${type} and (max-height: ${maxHeight.toString()})"`);
}

export function minHeightMedia(
  minHeight: Unit,
  type: MediaType = 'all'
): MediaUnit {
  return asMedia(`~"${type} and (min-height: ${minHeight.toString()})"`);
}
