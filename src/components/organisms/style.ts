import { Style } from "mapbox-gl";

/**
 * The style of the map.  Contains information about its layers and data sources
 */
export const style: Style = {
	version: 8,
	sources: {
		osm: {
			type: "raster",
			tiles: [
				"https://stamen-tiles-c.a.ssl.fastly.net/terrain-background/{z}/{x}/{y}.png",
			],
			tileSize: 256,
			attribution: "&copy; OpenStreetMap Contributors",
			maxzoom: 19,
		},
		"mapbox-dem": {
			type: "raster-dem",
			url: "mapbox://mapbox.mapbox-terrain-dem-v1",
			tileSize: 512,
			maxzoom: 14,
		},
	},
	layers: [
		{
			id: "osm",
			type: "raster",
			source: "osm",
		},
		{
			id: "terrain",
			type: "hillshade",
			source: "mapbox-dem",
		},
	],
	terrain: {
		source: "mapbox-dem",
		exaggeration: 3.5,
	},
	fog: {
		"horizon-blend": 0.3,
		color: "#f8f0e3",
	},
};
