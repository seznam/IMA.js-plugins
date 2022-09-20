import { asUnit, Unit } from './utils';

export type MediaType = 'all' | 'print' | 'screen' | 'speach';

/**
 *
 * @param maxWidth
 * @param type
 */
export function maxWidthMedia(maxWidth: number, type: MediaType = 'all'): Unit {
  return asUnit(
    '',
    [maxWidth.toString()],
    `~"${type}` + ' and (max-width: ${parts})"'
  );
}

/**
 *
 * @param minWidth
 * @param type
 */
export function minWidthMedia(minWidth: number, type: MediaType = 'all'): Unit {
  return asUnit(
    '',
    [minWidth.toString()],
    `~"${type}` + ' and (min-width: ${parts})"'
  );
}

/**
 *
 * @param minWidth
 * @param maxWidth
 * @param type
 */
export function minAndMaxWidthMedia(
  minWidth: number,
  maxWidth: number,
  type: MediaType = 'all'
): Unit {
  return asUnit(
    maxWidth.toString(),
    [minWidth.toString()],
    `~"${type}` + ' and (min-width: ${parts}) and (max-width: ${unit})"'
  );
}

/**
 *
 * @param maxHeight
 * @param type
 */
export function maxHeightMedia(
  maxHeight: number,
  type: MediaType = 'all'
): Unit {
  return asUnit(
    '',
    [maxHeight.toString()],
    `~"${type}` + ' and (max-height: ${parts})"'
  );
}

/**
 *
 * @param minHeight
 * @param type
 */
export function minHeightMedia(
  minHeight: number,
  type: MediaType = 'all'
): Unit {
  return asUnit(
    '',
    [minHeight.toString()],
    `~"${type}` + ' and (min-height: ${parts})"'
  );
}
