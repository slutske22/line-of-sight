import { Position, GeoJSON } from "geojson";
import SphericalMercator from "@mapbox/sphericalmercator";
import { TILE_ZOOM } from "./constants";
import {
	getDem,
	getTileCoordOfProjectedPoint,
	getTileNames,
} from "./tileutils";

const merc = new SphericalMercator({
	size: 256,
	antimeridian: true,
});

/**
 * Central library function.  Takes in 2 points
 */
export async function lineOfSight(start: Position, end: Position) {
	const origin2destinationGeoJson: GeoJSON = {
		type: "Feature",
		properties: {},
		geometry: {
			type: "LineString",
			coordinates: [start, end],
		},
	};

	const tilenames = getTileNames(origin2destinationGeoJson.geometry);
	await getDem(tilenames);

	/**
	 * Transform start and end LngLats into pixel values, according to
	 * spherical mercator projection and defined zoom level
	 */
	const startPx = merc.px(start as [number, number], TILE_ZOOM);
	const endPx = merc.px(end as [number, number], TILE_ZOOM);

	console.log("startPx", startPx);
	console.log("endPx", endPx);

	console.log(
		"the tile of the start point is",
		getTileCoordOfProjectedPoint({ x: startPx[0], y: startPx[1] })
	);

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
		const xyPositionOnTile = {
			x: Math.floor(pixel.x) - X * 256,
			y: Math.floor(pixel.y) - Y * 256,
		};
	});

	console.log(pixelsAlongLine);
}
