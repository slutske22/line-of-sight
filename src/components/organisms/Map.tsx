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

	const { setMap } = useContext(DataContext);

	useEffect(() => {
		if (!mapReady) return;

		const map = new MapboxMap({
			container: "map",
			center: { lng: 173.768832412135, lat: -40.99157323594519 },
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

		map.on("click", e => [console.log(e)]);
	}, [mapReady]);

	return <MapWrapper ref={() => setMapReady(true)} id="map" />;
};
