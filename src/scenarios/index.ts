import { LngLatLike, Map } from "mapbox-gl";
import { Position } from "geojson";
import * as beacons from "./beacons";

interface Scenario {
	/**
	 * The display title of the scenario
	 */
	title: string;
	/**
	 * The dispay subtitle of the scenario
	 */
	subtitle: string;
	/**
	 * What view the map should start on for the scenario
	 */
	startingView: {
		center: LngLatLike;
		zoom: number;
		bearing?: number;
	};
	/**
	 * The origin point we are trying to calculate line of sight from
	 */
	source: Position;
	/**
	 * The destination point we are trying to calculate line of sight to
	 */
	destination: Position;
}

export const scenarios: Scenario[] = [
	{
		title: "Light the Beacons",
		subtitle: "Ground to Ground",
		startingView: {
			center: { lng: 173.768832412135, lat: -40.99157323594519 },
			zoom: 10,
			bearing: -45,
		},
		source: [173.6865235396258, -41.12975102937678],
		destination: [173.80549394420922, -40.87416361138374],
	},
	{
		title: "Radio Tower",
		subtitle: "Air to Ground, in Motion",
		startingView: {
			center: [-157.8103446269198, 21.350181086214107],
			zoom: 12,
		},
		source: beacons.source,
		destination: beacons.destination,
	},
	{
		title: "Lighthouse",
		subtitle: "Water to Ground",
		startingView: beacons.view,
		source: beacons.source,
		destination: beacons.destination,
	},
	{
		title: "Submarine",
		subtitle: "Bathymetric",
		startingView: beacons.view,
		source: beacons.source,
		destination: beacons.destination,
	},
];

/**
 * Util function to set up scene - fly to position, draw lines and icons, clean up
 * previous scene icons and lines
 */
export const setupScenario = (map: Map, scenario: Scenario) => {
	map.flyTo(scenario.startingView);

	const groundLine = map.getLayer("ground-line");

	if (groundLine) {
		map.removeLayer("ground-line");
		map.removeSource("ground-line");
	}

	map.addSource("ground-line", {
		type: "geojson",
		data: {
			type: "Feature",
			properties: {},
			geometry: {
				type: "LineString",
				coordinates: [scenario.source, scenario.destination],
			},
		},
	});

	map.addLayer({
		id: "ground-line",
		type: "line",
		source: "ground-line",
		layout: {
			"line-join": "round",
			"line-cap": "round",
		},
		paint: {
			"line-color": "red",
			"line-width": 2,
		},
	});
};
