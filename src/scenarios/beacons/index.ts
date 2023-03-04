import { lineOfSight, Results } from "lib/lineofsight";
import { GeoJSONSource, Marker } from "mapbox-gl";
import { Scenario } from "scenarios";
import length from "@turf/length";
import { GeoJSON } from "geojson";
import { createMarker } from "utils";
import FlameIcon from "./flame.png";

const flameMarkers: Marker[] = [];

export const beacons: Scenario = {
	title: "Light the Beacons",
	subtitle: "Ground to Ground",
	startingView: {
		center: { lng: -156.8689024974429, lat: 21.105369994433644 },
		zoom: 10,
		bearing: 0,
	},
	source: [-156.72926450297342, 21.151428547423208],
	destination: [-156.8689024974429, 21.105369994433644],
	customBehavior: async (map, setResults) => {
		const points = [
			[-157.25863033466868, 21.217680498195293],
			[-157.2292021634388, 21.212756841342568],
			[-157.19908970187566, 21.153451821502998],
			[-157.16422054651207, 21.168991505484072],
			[-157.15558097391977, 21.143419714462937],
			[-157.012236913989, 21.129974761295983],
			[-156.91177578394633, 21.122571687227065],
			[-156.88565048966623, 21.113647520504458],
			[-156.84979897281627, 21.1324953091067],
			[-156.81380187865813, 21.127785849952247],
			[-156.79332517436342, 21.15785512296516],
			[-156.72926450297342, 21.151428547423208],
		];

		const rays: Results[] = [];

		for (let i = 0; i < points.length - 1; i++) {
			let ray = await lineOfSight(points[i], points[i + 1]);

			/**
			 * If we are creating LoS for any ray except the first, we need to add
			 * the distance of all previous rays to get the x-offset of the graph correct
			 */
			if (i > 0) {
				const previousPath: GeoJSON = {
					type: "Feature",
					properties: {},
					geometry: {
						type: "LineString",
						coordinates: points.filter((p, ind) => ind <= i),
					},
				};

				const prevDistance = length(previousPath) * 1000;

				ray = {
					elevationProfile: ray.elevationProfile.map(([x, y]) => [
						x + prevDistance,
						y,
					]),
					losLine: ray.losLine.map(([x, y]) => [x + prevDistance, y]),
					los: ray.los,
				};
			}

			rays.push(ray);
		}

		const result: Results = {
			elevationProfile: rays.map(r => r.elevationProfile).flat(),
			losLine: rays.map(r => r.losLine).flat(),
			los: rays.every(r => r.los),
		};

		(map.getSource("ground-line") as GeoJSONSource).setData({
			type: "Feature",
			properties: {},
			geometry: {
				type: "LineString",
				coordinates: points,
			},
		});

		points.forEach((point, i) => {
			const marker = createMarker({
				iconPath: FlameIcon,
				id: `flame-marker-${i}`,
				className: "flame-marker",
			})
				.setLngLat(point as [number, number])
				.addTo(map);

			flameMarkers.push(marker);
		});

		setResults(result);
	},
	cleanupCustomBehavior: () => {
		flameMarkers.forEach(marker => marker.remove());
	},
};
