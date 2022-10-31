/**
 * Algorithm configuration parameters
 */
export const config = {
	/**
	 * The url to get RGB-encoded dem tiles from
	 */
	TILES_URL:
		"https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png",
	/**
	 * The zoom level for which to retrieve the tiles
	 */
	TILE_ZOOM: 12,
	/**
	 * Function to transform an RGB pixel value into an elevation value, in meters
	 */
	heightFunction: (red: number, green: number, blue: number): number =>
		red * 256 + green + blue / 256 - 32768,
};
