import { Scenario } from "scenarios";

export const batyhmetry: Scenario = {
	title: "Submarine",
	subtitle: "Bathymetric",
	startingView: {
		center: { lng: -157.49400319946662, lat: 21.0620539193483 },
		zoom: 9,
		bearing: 0,
	},
	source: [-157.25994396989591, 20.931003669240553, -1000],
	destination: [-157.6957750616636, 21.17524483750961, 0],
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
	},
	cleanupCustomBehavior: map => {
		if (map.getLayer("bathymetry-raster")) {
			map.removeLayer("bathymetry-raster");
			map.removeSource("bathymetry-raster");
		}
	},
};
