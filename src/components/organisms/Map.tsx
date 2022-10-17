import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import mapboxgl, { Map as MapboxMap, NavigationControl } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { style } from "./style";
import { MapContext } from "./MapContext";

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

	const { setMap } = useContext(MapContext);

	useEffect(() => {
		if (!mapReady) return;

		const map = new MapboxMap({
			container: "map",
			center: [-157.8103446269198, 21.350181086214107],
			// pitch: 75,
			// bearing: -17,
			zoom: 12,
			style,
		});

		const nav = new NavigationControl({
			visualizePitch: true,
		});
		map.addControl(nav, "top-left");

		setMap(map);

		// @ts-expect-error for debugging
		window.map = map;

		map.on("click", e => [console.log(e)]);
	}, [mapReady]);

	return <MapWrapper ref={() => setMapReady(true)} id="map" />;
};
