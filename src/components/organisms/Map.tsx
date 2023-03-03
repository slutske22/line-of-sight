import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import mapboxgl, { Map as MapboxMap, NavigationControl } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { style } from "./style";
import { DataContext } from "./DataContext";

mapboxgl.accessToken =
	"pk.eyJ1IjoiYWxleHlvdXNlZmlhbiIsImEiOiJjbDBod3MxeWowYjFwM2pwNTgzNmZheGd5In0.IcoiTPi2qbE1YxjC-LD-cw";

const MapWrapper = styled.div`
	height: 100%;
	width: 100%;
`;

/**
 * Main map component
 */
export const Map: React.FC = () => {
	const [mapReady, setMapReady] = useState(false);

	const { map, setMap, results } = useContext(DataContext);

	useEffect(() => {
		if (!mapReady) return;

		const map = new MapboxMap({
			container: "map",
			center: [-157.7694392095103, 21.44933977381804],
			zoom: 10,
			bearing: -45,
			style,
		});

		const nav = new NavigationControl({
			visualizePitch: true,
		});
		map.addControl(nav, "top-left");

		setMap(map);

		// @ts-expect-error for debugging
		window.map = map;

		map.on("click", e => {
			console.log(e);
			console.log([e.lngLat.lng, e.lngLat.lat]);
		});
	}, [mapReady]);

	useEffect(() => {
		if (map) {
			map.setPaintProperty(
				"ground-line",
				"line-color",
				results.los ? "green" : "red"
			);
		}
	}, [map, results.los]);

	return <MapWrapper ref={() => setMapReady(true)} id="map" />;
};
