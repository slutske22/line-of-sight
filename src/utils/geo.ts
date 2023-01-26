import { FeatureCollection, LineString, Polygon, Position } from "geojson";
import { lineString } from "@turf/helpers";
import bezier from "@turf/bezier-spline";
// import along from "@turf/along";
import turfbearing from "@turf/bearing";

/**
 * Number of interpolated points to break the geojson line/path into
 */
export const FRAMES = 300;

/**
 * Util function to transform GeoJSON into a tronfyres-readable flight path.  Intakes
 * a GeoJSON FeatureCollection that contains a single Polygon or LineString, transforms
 * the line into a bezier spline for smoothness, and then interpolates points along
 * that spline.  Produces a hi res sampling of ship positions (and their bearings) along
 * the path initially set by the GeoJSON
 */
export const geojson2flightpath = (
	geojson: FeatureCollection<Polygon | LineString>
): { position: Position; bearing: number }[] => {
	/**
	 * First transform geojson into leaflet latlng array
	 */
	const latLngs = geojson.features[0].geometry.coordinates[0] as Position[];

	/**
	 * Smooth out the path using turf bezier spline
	 */
	const turfLineString = lineString(latLngs);
	const spline = bezier(turfLineString, { resolution: 100000 });

	/**
	 * Resample and interpolate along polyline/polygon with n number of points
	 */
	// const points: Position[] = [];
	// for (let i = 0; i < numberOfPoints; i++) {
	// 	const point = along(spline, i / numberOfPoints);

	// 	points.push(point.geometry.coordinates);
	// }

	/**
	 * Get bearings at each point, from point n to point n+1
	 */
	const positions = spline.geometry.coordinates.map((point, i) => {
		const nextIndex = spline.geometry.coordinates[i + 1] ? i + 1 : 0;
		const bearing = turfbearing(point, spline.geometry.coordinates[nextIndex]);

		return {
			position: point,
			bearing,
		};
	});

	return positions;
};
