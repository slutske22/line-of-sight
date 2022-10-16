import React, { useEffect, useState } from "react";
import styled from "styled-components";
import mapboxgl, { Map as MapboxMap } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken =
	"pk.eyJ1IjoiYWxleHlvdXNlZmlhbiIsImEiOiJjbDBod3MxeWowYjFwM2pwNTgzNmZheGd5In0.IcoiTPi2qbE1YxjC-LD-cw";

const MapWrapper = styled.div`
	height: 100%;
	width: 100%;
	border: 1px solid red;
`;

/**
 * Main map component
 */
export const Map: React.FC = () => {
	const [mapReady, setMapReady] = useState(false);

	useEffect(() => {
		if (!mapReady) return;

		const map = new MapboxMap({
			container: "map",
			center: [-158, 21.4],
			// center: [11.39085, 47.27574],
			zoom: 10,
			style: {
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
			},
		});

		map.on("click", e => [console.log(e)]);
	}, [mapReady]);

	return <MapWrapper ref={() => setMapReady(true)} id="map" />;
};
