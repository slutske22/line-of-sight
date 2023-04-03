import { Scenario } from "scenarios";

export const lighthouse: Scenario = {
	title: "Lighthouse",
	subtitle: "Earth's Curvature",
	description:
		"The view from Kaena Point on Oahu to Ninini point lighthouse on Kauai has no mountainous obsctructions.  However, the curvature of the earth prevents direct line of sight between these 2 points.  <br /><br />This scenario is the only one that considers earth's curvature in line of sight calculations.",
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
