import { NdArray } from "ndarray";

/**
 * Util function to construct tilenames in a consistent fashion, as the `tilename` string
 * will be used to create and retrieve ndarrays from the `dem` object
 */
export const tilename = (
	/**
	 * X coordinate of the tile
	 */
	x: number,
	/**
	 * Y coordinate of the tile
	 */
	y: number,
	/**
	 * Z coordinate of the tile
	 */
	z: number
) => `${x}-${y}-${z}`;

/**
 * Digital Elevation Model data used in the application
 *
 * In-memory storage for all dem tiles, already processed and trasnformed into ndarrays
 */
export const dem: {
	/**
	 * Key value for a DEM tile, key is the tile name, value is the ndarray containing the tiles
	 * rgb pixel values
	 */
	[key: string]: NdArray<Uint8Array>;
} = {};

// @ts-expect-error for debugging
window.dem = dem;
