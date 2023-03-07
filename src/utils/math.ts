/**
 * Simple JS implementation of the Bresenham line algorithm
 */
export function line(x0: number, y0: number, x1: number, y1: number) {
	const result = [];
	const dx = Math.abs(x1 - x0);
	const dy = Math.abs(y1 - y0);
	const sx = x0 < x1 ? 1 : -1;
	const sy = y0 < y1 ? 1 : -1;
	let err = dx - dy;

	while (true) {
		result.push({ x: x0, y: y0 });

		if (x0 === x1 && y0 === y1) break;
		const e2 = 2 * err;
		if (e2 > -dy) {
			err -= dy;
			x0 += sx;
		}
		if (e2 < dx) {
			err += dx;
			y0 += sy;
		}
	}
	return result;
}

/**
 * Function to calculate the height different between the arc and a chord defined by two points on a circle.
 * See README for more details
 * @param total The total distance between two points on a circle, in meters (the arc distance, not the chord distance)
 * @param d The partial distance along the total distance
 * @param r The radius of the circle, defaults to earth's radius
 */
export function bulge(total: number, d: number, r = 6.371e6) {
	return r * (1 - Math.cos(total / r / 2) / Math.cos(total / r / 2 - d / r));
}
