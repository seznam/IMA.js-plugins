import type { Unit } from './utils';
import { asUnit } from './utils';

export type MediaType = 'all' | 'print' | 'screen' | 'speach';

export function maxWidthMedia(maxWidth: Unit, type: MediaType = 'all'): Unit {
  return asUnit(
    '',
    [maxWidth.toString()],
    `~"${type}` + ' and (max-width: ${parts})"'
  );
}

export function minWidthMedia(minWidth: Unit, type: MediaType = 'all'): Unit {
  return asUnit(
    '',
    [minWidth.toString()],
    `~"${type}` + ' and (min-width: ${parts})"'
  );
}

export function minAndMaxWidthMedia(
  minWidth: Unit,
  maxWidth: Unit,
  type: MediaType = 'all'
): Unit {
  return asUnit(
    maxWidth.toString(),
    [minWidth.toString()],
    `~"${type}` + ' and (min-width: ${parts}) and (max-width: ${unit})"'
  );
}

export function maxHeightMedia(maxHeight: Unit, type: MediaType = 'all'): Unit {
  return asUnit(
    '',
    [maxHeight.toString()],
    `~"${type}` + ' and (max-height: ${parts})"'
  );
}

export function minHeightMedia(minHeight: Unit, type: MediaType = 'all'): Unit {
  return asUnit(
    '',
    [minHeight.toString()],
    `~"${type}` + ' and (min-height: ${parts})"'
  );
}
