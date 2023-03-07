import { Scenario } from "scenarios";

export const lighthouse: Scenario = {
	title: "Lighthouse",
	subtitle: "Earth's Curvature",
	source: [-159.33582151534344, 21.955778653883932, 26],
	destination: [-158.2392986070897, 21.56146315476358],
	startingView: {
		center: [-158.75307273981738, 21.737710128202423],
		zoom: 8,
		bearing: 0,
	},
	options: {
		considerEarthCurvature: true,
	},
};
