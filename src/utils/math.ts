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
 * @param d The distance between two points on a circle, in meters (the arc distance, not the chord distance)
 * @param r The radius of the circle
 */
export function bulge(d: number, r = 6.371e6) {
	const chord = 2 * r * Math.sin(d / (2 * r));
	return -(chord ** 2) / (8 * r);
}

export function bulge2(total: number, d: number, r = 6.371e6) {
	return r * (1 - Math.cos(total / r / 2) / Math.cos(total / r / 2 - d / r));
}
