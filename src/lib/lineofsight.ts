import { Position, GeoJSON } from "geojson";
import SphericalMercator from "@mapbox/sphericalmercator";
import { dem, tilename } from "dem";
import { Results } from "components";
import length from "@turf/length";
import {
	getDem,
	getTileCoordOfProjectedPoint,
	getTileNames,
} from "./tileutils";
import { config } from "./config";

const merc = new SphericalMercator({
	size: 256,
	antimeridian: true,
});

interface Options {
	/**
	 * Whether to calculate sub-zero heights, or treat as 0
	 */
	considerBathymetry?: boolean;
}

/**
 * Central library function.  Takes in 2 points
 */
export async function lineOfSight(
	start: Position,
	end: Position,
	options?: Options
): Promise<Results> {
	const { considerBathymetry = false } = options ?? {};

	const origin2destinationGeoJson: GeoJSON = {
		type: "Feature",
		properties: {},
		geometry: {
			type: "LineString",
			coordinates: [start, end],
		},
	};

	const distance = length(origin2destinationGeoJson) * 1000;

	const tilenames = getTileNames(origin2destinationGeoJson.geometry);
	await getDem(tilenames);

	/**
	 * Transform start and end LngLats into pixel values, according to
	 * spherical mercator projection and defined zoom level
	 */
	const startPx = merc.px(start as [number, number], config.TILE_ZOOM);
	const endPx = merc.px(end as [number, number], config.TILE_ZOOM);

	/**
	 * Get every pixel value (whole number { x,  y } value) along the line
	 */
	const pixelsAlongLine = [];
	const run = endPx[0] - startPx[0];
	const slope = (endPx[1] - startPx[1]) / run;

	for (let i = 0; i < run + 1; i++) {
		pixelsAlongLine.push({
			x: startPx[0] + i,
			y: startPx[1] + Math.round(slope * i),
		});
	}

	const elevations = pixelsAlongLine.map(pixel => {
		const { X, Y } = getTileCoordOfProjectedPoint(pixel);

		const tile = dem[tilename(X, Y, config.TILE_ZOOM)];

		const xyPositionOnTile = {
			x: Math.floor(pixel.x) - X * 256,
			y: Math.floor(pixel.y) - Y * 256,
		};

		const r = tile.get(xyPositionOnTile.x, xyPositionOnTile.y, 0);
		const g = tile.get(xyPositionOnTile.x, xyPositionOnTile.y, 1);
		const b = tile.get(xyPositionOnTile.x, xyPositionOnTile.y, 2);

		const elevation = config.heightFunction(r, g, b);

		return considerBathymetry ? elevation : Math.max(0, elevation);
	});

	return {
		elevationProfile: elevations.map((height, i) => [
			(i / elevations.length) * distance,
			height,
		]),
	};
}
