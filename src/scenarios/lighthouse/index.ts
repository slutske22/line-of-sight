import { Scenario } from "scenarios";

export const lighthouse: Scenario = {
	title: "Lighthouse",
	subtitle: "Earth's Curvature",
	source: [-159.33582151534344, 21.955778653883932, 26],
	destination: [-158.2392986070897, 21.56146315476358],
	startingView: {
		center: [-158.28149742326337, 21.574992201741413],
		zoom: 10,
		bearing: 0,
	},
	options: {
		considerEarthCurvature: true,
	},
};
