const webpack = require("webpack");
module.exports = function override(config) {
	const fallback = config.resolve.fallback || {};
	Object.assign(fallback, {
		path: require.resolve("path-browserify"),
		stream: require.resolve("stream-browserify"),
		buffer: require.resolve("buffer-browserify"),
		assert: require.resolve("assert-browserify"),
	});
	config.resolve.fallback = fallback;
	config.plugins = (config.plugins || []).concat([
		new webpack.ProvidePlugin({
			process: "process/browser",
			Buffer: ["buffer", "Buffer"],
		}),
	]);
	return config;
};
