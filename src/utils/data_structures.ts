/**
 * Util functions for working with arrays, objects, and other native javascript
 * data structures
 */

/**
 * Takes in an array, and returns same array with first item missing
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function shift(array: any[]) {
	const newArray = [...array];
	newArray.shift();
	return newArray;
}
