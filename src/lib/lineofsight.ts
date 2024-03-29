import { Position, GeoJSON } from "geojson";
import SphericalMercator from "@mapbox/sphericalmercator";
import { dem, tilename } from "dem";
import length from "@turf/length";
import { bulge, line } from "utils";
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

export interface LineOfSightOptions {
	/**
	 * Whether to calculate sub-zero heights, or treat as 0
	 */
	considerBathymetry?: boolean;
	/**
	 * Whether or not to include earth's curvature in height calculations
	 */
	considerEarthCurvature?: boolean;
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
	options?: LineOfSightOptions
): Promise<Results> {
	const {
		considerBathymetry = false,
		considerEarthCurvature = false,
		tileZoom = config.TILE_ZOOM,
	} = options ?? {};

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

	const startAltitude = start[2];
	const endAltitude = end[2];

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

			let earthCurvatureOffset = 0;
			if (considerEarthCurvature) {
				const latLngOfPixel = merc.ll([pixel.x, pixel.y], tileZoom);

				const origin2ThisPointGeoJson: GeoJSON = {
					type: "Feature",
					properties: {},
					geometry: {
						type: "LineString",
						coordinates: [start, latLngOfPixel],
					},
				};

				// Round down to reduce floating point CPU load in step that follows
				const distanceFromStartToThisPoint = Math.floor(
					length(origin2ThisPointGeoJson, {
						units: "meters",
					})
				);

				earthCurvatureOffset = bulge(distance, distanceFromStartToThisPoint);
			}

			let height = considerBathymetry ? elevation : Math.max(0, elevation);

			if (considerEarthCurvature) {
				height = height + earthCurvatureOffset;
			}

			return height;
		})
		.filter(result => result !== null) as number[];

	const elevationProfile = elevations.map((height, i) => [
		(i / elevations.length) * distance,
		height,
	]);

	const first =
		startAltitude || startAltitude === 0
			? [elevationProfile[0][0], startAltitude]
			: elevationProfile[0];

	const last =
		endAltitude || endAltitude === 0
			? [elevationProfile[elevationProfile.length - 1][0], endAltitude]
			: elevationProfile[elevationProfile.length - 1];

	const m = (first[1] - last[1]) / (first[0] - last[0]);

	const losLine: number[][] = [];
	for (let i = 0; i < elevationProfile.length; i++) {
		losLine.push([
			elevationProfile[i][0],
			first[1] + m * elevationProfile[i][0],
		]);
	}

	const los = !elevationProfile.some((point, i) => point[1] > losLine[i][1]);

	return {
		elevationProfile,
		losLine,
		los,
	};
}
