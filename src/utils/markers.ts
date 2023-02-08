import { Marker } from "mapbox-gl";

/**
 * Utility for creating a mapbox icon based on an image path and css id
 */
export const createMarker = (options: {
	iconPath: string;
	id: string;
}): Marker => {
	const el = document.createElement("div");
	el.className = "map-icon-wrapper";

	const icon = document.createElement("img");
	icon.src = options.iconPath;
	icon.id = options.id;

	el.appendChild(icon);

	return new Marker(el);
};
