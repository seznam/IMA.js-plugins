
import AbstractEntity from './AbstractEntity';

/**
 * Deeply freezes the provided data.
 *
 * Note that the method cannot properly handle data with circular
 * references.
 *
 * Also note that any embedded entity will be skipped over, allowing each
 * entity class to have consistent mutability of its instances.
 *
 * @param {*} data The data that should become deeply frozen.
 */
export function deepFreeze(data) {
	if (!(data instanceof Object)) {
		return; // Primitive values are immutable
	}

	for (let propertyName of Object.keys(data)) {
		const value = data[propertyName];
		if (value instanceof AbstractEntity) {
			// Skip embedded entities so they can have a consistent mutability
			// behavior.
			continue;
		}

		deepFreeze(data[propertyName]);
	}

	Object.freeze(data);
}
