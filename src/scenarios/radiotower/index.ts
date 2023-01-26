import { LineString, lineString } from "@turf/helpers";
import { FeatureCollection, Polygon, Position } from "geojson";
import { Scenario } from "scenarios";
import { geojson2flightpath } from "utils";
import { GeoJSONSource, Marker } from "mapbox-gl";
import bezier from "@turf/bezier-spline";
import planepathjson from "./planepath.json";
// @ts-expect-error this should work
import PlaneIcon from "./plane-icon.png";

const planepath = planepathjson as unknown as FeatureCollection<
	Polygon | LineString
>;

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

const positions = geojson2flightpath(
	planepath as unknown as FeatureCollection<LineString>
);

let interval: NodeJS.Timeout;
let index = 0;

export const radiotower: Scenario = {
	title: "Radio Tower",
	subtitle: "Air to Ground, in Motion",
	startingView: {
		center: [-157.8103446269198, 21.350181086214107],
		zoom: 12,
	},
	source: positions[0].position,
	destination: [-157.7694392095103, 21.44933977381804],
	customBehavior: (map, _setResults) => {
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

		const el = document.createElement("div");
		el.className = "plane-icon-wrapper";

		const planeIcon = document.createElement("img");
		planeIcon.src = PlaneIcon;
		planeIcon.id = "plane-icon";
		planeIcon.style.rotate = `${map.getBearing() - positions[0].bearing}deg`;

		el.appendChild(planeIcon);

		const marker = new Marker(el)
			.setLngLat(positions[0].position as [number, number])
			.addTo(map);

		/**
		 * Continuously update path and LoS
		 */
		interval = setInterval(() => {
			/**
			 * Set the position and rotation of the plane icon
			 */
			marker.setLngLat(positions[index].position as [number, number]);
			planeIcon.style.rotate = `${
				positions[index].bearing - map.getBearing()
			}deg`;

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
						[-157.7694392095103, 21.44933977381804],
					],
				},
			});

			index = index >= positions.length - 2 ? 0 : index + 1;
		}, 100);
	},
	cleanupCustomBehavior: (_map, _setResults) => {
		clearInterval(interval);
	},
};
