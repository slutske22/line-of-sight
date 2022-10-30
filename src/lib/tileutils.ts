import cover from "@mapbox/tile-cover";
import { dem, tilename } from "dem";
import { Geometry } from "geojson";
import getPixels from "get-pixels";
import { NdArray } from "ndarray";
import { config } from "./config";

/**
 * Util function to get tilesnames for tiles that cover a given GeoJSON geometry
 */
export const getTileNames = (geometry: Geometry) => {
	const tiles = cover.tiles(geometry, {
		min_zoom: config.TILE_ZOOM,
		max_zoom: config.TILE_ZOOM,
	});

	return tiles;
};

/**
 * Async util to get pixels from tile, downloads image and converts to ndarray using `get-pixels`
 */
export const getPixelsFromTile = ([x, y, z]: number[]): Promise<
	NdArray<Uint8Array>
> => {
	return new Promise((resolve, reject) => {
		getPixels(
			config.TILES_URL.replace("{x}", x.toString())
				.replace("{y}", y.toString())
				.replace("{z}", z.toString()),
			function (error, pixels) {
				if (error) {
					reject(error);
				}
				resolve(pixels);
			}
		);
	});
};

/**
 * For a given set of XYZ slippymap tile coordinates, retrieve all tile images for those tiles,
 * convert to ndArray, and then save processed results to `dem` object
 */
export const getDem = async (tiles: number[][]) => {
	await Promise.all(
		tiles.map(async ([x, y, z]) => {
			const tileName = tilename(x, y, z);
			if (dem[tileName]) return;

			const tilePixelData = await getPixelsFromTile([x, y, z]).then(
				pixels => pixels
			);
			dem[tileName] = tilePixelData;
		})
	);
};

/**
 * Take in a projection point and return the tile coordinates { X, Y, Z } of that point
 */
export function getTileCoordOfProjectedPoint(projectedPoint: {
	x: number;
	y: number;
}) {
	return {
		X: Math.floor(projectedPoint.x / 256),
		Y: Math.floor(projectedPoint.y / 256),
		Z: config.TILE_ZOOM,
	};
}
