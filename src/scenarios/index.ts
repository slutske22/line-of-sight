import { LngLatLike, Map } from "mapbox-gl";
import { Position, GeoJSON } from "geojson";
import { lineOfSight, LineOfSightOptions, Results } from "lib/lineofsight";
import * as beacons from "./beacons";
import { radiotower } from "./radiotower";
import { batyhmetry } from "./bathymetry";

export interface Scenario {
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
	/**
	 * Options to pass to the line of sight function
	 */
	options?: LineOfSightOptions;
	/**
	 * Any special behavior the scenario should execute
	 */
	customBehavior?: (
		map: Map,
		setResults: (value: React.SetStateAction<Results>) => void
	) => void;
	/**
	 * Code to clean up custom behavior
	 */
	cleanupCustomBehavior?: (
		map: Map,
		setResults: (value: React.SetStateAction<Results>) => void
	) => void;
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
	radiotower,
	{
		title: "Lighthouse",
		subtitle: "Water to Ground",
		startingView: beacons.view,
		source: beacons.source,
		destination: beacons.destination,
	},
	batyhmetry,
];

/**
 * Util function to set up scene - fly to position, draw lines and icons, clean up
 * previous scene icons and lines
 */
export const setupScenario = async (
	map: Map,
	scenario: Scenario,
	setResults: (value: React.SetStateAction<Results>) => void
): Promise<Results> => {
	map.flyTo(scenario.startingView);

	const groundLine = map.getLayer("ground-line");
	const movingPathLine = map.getLayer("moving-path-line");

	if (groundLine) {
		map.removeLayer("ground-line");
		map.removeSource("ground-line");
	}

	if (movingPathLine) {
		map.removeLayer("moving-path-line");
		map.removeSource("moving-path-line");
	}

	const origin2destinationGeoJson: GeoJSON = {
		type: "Feature",
		properties: {},
		geometry: {
			type: "LineString",
			coordinates: [scenario.source, scenario.destination],
		},
	};

	const results = await lineOfSight(
		scenario.source,
		scenario.destination,
		scenario.options
	);

	map.addSource("ground-line", {
		type: "geojson",
		data: origin2destinationGeoJson,
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
			"line-color": results.los ? "green" : "red",
			"line-width": 2,
		},
	});

	setResults(results);

	if (scenario.customBehavior) {
		scenario.customBehavior(map, setResults);
	}

	return results;
};
