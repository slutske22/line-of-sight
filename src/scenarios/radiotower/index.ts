import { LineString, lineString } from "@turf/helpers";
import { FeatureCollection, Point, Polygon, Position } from "geojson";
import { Scenario } from "scenarios";
import { createMarker, geojson2flightpath } from "utils";
import { GeoJSONSource, Marker } from "mapbox-gl";
import bezier from "@turf/bezier-spline";
import bbox from "@turf/bbox";
import xyz from "xyz-affair";
import { lineOfSight } from "lib/lineofsight";
import { getDem } from "lib/tileutils";
import { config } from "lib/config";
import planepathjson from "./planepath.json";
import PlaneIcon from "./plane-icon.png";

/**
 * Coordinates for the target destination
 */
const DESTINATION = [-157.7694392095103, 21.44933977381804, 75];

/**
 * The GeoJSON path of the plane
 */
const planepath = planepathjson as unknown as FeatureCollection<
	Polygon | LineString
>;

/**
 * Altitude of the plane in meters
 */
const ALTITUDE = 750;

/**
 * Target destination as geojson
 */
const destination: FeatureCollection<Point> = {
	type: "FeatureCollection",
	features: [
		{
			type: "Feature",
			properties: {},
			geometry: {
				type: "Point",
				coordinates: DESTINATION,
			},
		},
	],
};

/**
 * GeoJSON of all things that comprise area that needs tiles
 */
const allGeoJson: FeatureCollection = {
	type: "FeatureCollection",
	features: [...planepath.features, ...destination.features],
};

/**
 * First transform geojson into leaflet latlng array
 */
const latLngs =
	planepath.features[0].geometry.coordinates[0].reverse() as Position[];

/**
 * Smooth out the path using turf bezier spline
 */
const turfLineString = lineString(latLngs);
const spline = bezier(turfLineString, { resolution: 100000 });

/**
 * Series of positions along the path used for animating position
 */
const positions = geojson2flightpath(
	planepath as unknown as FeatureCollection<LineString>
);

let interval: NodeJS.Timeout;
let index = 0;
let marker: Marker;

export const radiotower: Scenario = {
	title: "Radio Tower",
	subtitle: "Air to Ground, in Motion",
	description:
		"A plane flying at 750m altitude tries to maintain line of sight with a radio tower while flying through the Ko'olau mountain range.  Position and line of sight refreshes at a rate of ~3hz. As all DEM data in the flight path is already preloaded and preprocessed, there is no lag in calculating the elevation profile or line of sight.",
	startingView: {
		center: { lng: -157.77804436552205, lat: 21.336150930713714 },
		zoom: 10,
		bearing: 0,
	},
	source: [...positions[0].position, ALTITUDE],
	destination: DESTINATION,
	customBehavior: async (map, setResults) => {
		/**
		 * Add GeoJSON of flight path to map
		 */
		map.addSource("moving-path-line", {
			type: "geojson",
			data: spline,
		});

		map.addLayer({
			id: "moving-path-line",
			type: "line",
			source: "moving-path-line",
			layout: {
				"line-join": "round",
				"line-cap": "round",
			},
			paint: {
				"line-color": "blue",
				"line-width": 2,
			},
		});

		/**
		 * Create GeoJSON of flight path, with detination, and get all tiles in that area
		 */
		const [minX, minY, maxX, maxY] = bbox(allGeoJson);
		const tiles: { x: number; y: number; z: number }[] = xyz(
			[
				[minX, minY],
				[maxX, maxY],
			],
			config.TILE_ZOOM
		);

		await getDem(tiles.map(({ x, y, z }) => [x, y, z]));

		marker = createMarker({
			iconPath: PlaneIcon,
			id: "plane-icon",
		})
			.setLngLat(positions[0].position as [number, number])
			.addTo(map);

		/**
		 * Continuously update path and LoS
		 */
		interval = setInterval(async () => {
			/**
			 * Set the position and rotation of the plane icon
			 */
			marker.setLngLat(positions[index].position as [number, number]);
			const icon = marker.getElement().querySelector("img");
			if (icon) {
				icon.style.rotate = `${positions[index].bearing - map.getBearing()}deg`;
			}

			/**
			 * Update the line of sight line to go betwen plane and target
			 */
			(map.getSource("ground-line") as GeoJSONSource).setData({
				type: "Feature",
				properties: {},
				geometry: {
					type: "LineString",
					coordinates: [
						positions[index].position as [number, number],
						DESTINATION,
					],
				},
			});

			const result = await lineOfSight(
				[...positions[index].position, ALTITUDE],
				DESTINATION
			);

			setResults(result);

			index = index >= positions.length - 2 ? 0 : index + 1;
		}, 300);
	},
	cleanupCustomBehavior: (_map, _setResults) => {
		clearInterval(interval);
		marker?.remove();
	},
};
