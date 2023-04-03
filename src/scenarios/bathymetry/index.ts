import { Marker } from "mapbox-gl";
import { Scenario } from "scenarios";
import { createMarker } from "utils";
import SubmarineIcon from "./submarine.svg";
import BoatIcon from "./boat.svg";

let submarineMarker: Marker;
let boatMarker: Marker;

export const batyhmetry: Scenario = {
	title: "Submarine",
	subtitle: "Bathymetric",
	description:
		"Bathymetric depths can be used to determine line of sight under water.  In this scenario, a submarine's communication with a surface-level ship is obscured by Penguin Bank, an underwater shield volcano.",
	startingView: {
		center: { lng: -157.49400319946662, lat: 21.0620539193483 },
		zoom: 9,
		bearing: 0,
	},
	source: [-157.6957750616636, 21.17524483750961, 0],
	destination: [-157.25994396989591, 20.931003669240553, -1000],
	options: {
		considerBathymetry: true,
	},
	customBehavior: map => {
		map.addSource("bathymetry-raster", {
			type: "raster",
			tiles: [
				"https://server.arcgisonline.com/ArcGIS/rest/services/Ocean_Basemap/MapServer/tile/{z}/{y}/{x}",
			],
		});

		map.addLayer({
			id: "bathymetry-raster",
			type: "raster",
			source: "bathymetry-raster",
		});

		map.moveLayer("ground-line");

		submarineMarker = createMarker({
			iconPath: SubmarineIcon,
			id: "sub-icon",
		})
			.setLngLat([-157.25994396989591, 20.931003669240553])
			.addTo(map);

		boatMarker = createMarker({
			iconPath: BoatIcon,
			id: "boat-icon",
		})
			.setLngLat([-157.6957750616636, 21.17524483750961])
			.addTo(map);
	},

	cleanupCustomBehavior: map => {
		if (map.getLayer("bathymetry-raster")) {
			map.removeLayer("bathymetry-raster");
			map.removeSource("bathymetry-raster");
		}
		submarineMarker?.remove();
		boatMarker?.remove();
	},
};
