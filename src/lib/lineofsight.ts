import { Position, GeoJSON } from "geojson";
import SphericalMercator from "@mapbox/sphericalmercator";
import { dem, tilename } from "dem";
import length from "@turf/length";
import { line } from "utils";
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
	/**
	 * Zoom level to use when getting DEM and analyzing pixels
	 */
	tileZoom?: number;
}

/**
 * Results object
 */
export interface Results {
	/**
	 * Elevation profile data, as an array of [x,y] points
	 */
	elevationProfile: number[][];
	/**
	 * Direct line from origin to destination, as an array of [x,y] points
	 */
	losLine: number[][];
	/**
	 * Whether or not there is a direct line of sight from origin to destination
	 */
	los: boolean;
}

/**
 * Central library function.  Takes in 2 points
 */
export async function lineOfSight(
	start: Position,
	end: Position,
	options?: Options
): Promise<Results> {
	const { considerBathymetry = false, tileZoom = config.TILE_ZOOM } =
		options ?? {};

	const origin2destinationGeoJson: GeoJSON = {
		type: "Feature",
		properties: {},
		geometry: {
			type: "LineString",
			coordinates: [start, end],
		},
	};

	const distance = length(origin2destinationGeoJson) * 1000;

	const tilenames = getTileNames(origin2destinationGeoJson.geometry, tileZoom);
	await getDem(tilenames);

	const altitude = start[2];

	/**
	 * Transform start and end LngLats into pixel values, according to
	 * spherical mercator projection and defined zoom level
	 */
	const startPx = merc.px(start as [number, number], tileZoom);
	const endPx = merc.px(end as [number, number], tileZoom);

	/**
	 * Get every pixel value (whole number { x,  y } value) along the line
	 */
	const pixelsAlongLine = line(startPx[0], startPx[1], endPx[0], endPx[1]);

	const elevations = pixelsAlongLine
		.map(pixel => {
			const { X, Y } = getTileCoordOfProjectedPoint(pixel, tileZoom);

			const tile = dem[tilename(X, Y, tileZoom)];

			const xyPositionOnTile = {
				x: Math.floor(pixel.x) - X * 256,
				y: Math.floor(pixel.y) - Y * 256,
			};

			if (!tile) {
				return null;
			}

			const r = tile.get(xyPositionOnTile.x, xyPositionOnTile.y, 0);
			const g = tile.get(xyPositionOnTile.x, xyPositionOnTile.y, 1);
			const b = tile.get(xyPositionOnTile.x, xyPositionOnTile.y, 2);

			const elevation = config.heightFunction(r, g, b);

			return considerBathymetry ? elevation : Math.max(0, elevation);
		})
		.filter(result => result !== null) as number[];

	const elevationProfile = elevations.map((height, i) => [
		(i / elevations.length) * distance,
		height,
	]);

	const first = altitude
		? [elevationProfile[0][0], altitude]
		: elevationProfile[0];
	const last = elevationProfile[elevationProfile.length - 1];

	const m = (first[1] - last[1]) / (first[0] - last[0]);

	const losLine: number[][] = [];
	for (let i = 0; i < elevationProfile.length; i++) {
		losLine.push([
			elevationProfile[i][0],
			elevationProfile[0][1] +
				m * elevationProfile[i][0] +
				(altitude ? altitude : 0),
		]);
	}

	const los = !elevationProfile.some((point, i) => point[1] > losLine[i][1]);

	return {
		elevationProfile,
		losLine,
		los,
	};
}
