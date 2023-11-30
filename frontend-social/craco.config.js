const path = require("path");
const webpack = require("webpack");
require("react-scripts/config/env");

const CONFIG = {
	chains: require("./config/network.chains.json"),
	networks: {
		65: require("./config/network.okexchain.testnet.json"),
		1230: require("./config/network.fibochain.mainnet.json"),
	},
	WEBSITE: process.env.WEBSITE,
	API: process.env.API,
	CHANNEL_ID: process.env.CHANNEL_ID,
	DEFAULT_NETWORK_LOCATION: process.env.DEFAULT_LOCATION,
	DEFAULT_WALLET_TYPE: process.env.DEFAULT_WALLET_TYPE,
};

module.exports = {
	devServer: {
		port: 3001,
	},
	webpack: {
		alias: {
			"@": path.join(__dirname, "src"),
			"@common": path.join(__dirname, "src/common"),
			"@assets": path.join(__dirname, "src/assets"),
			"@models": path.join(__dirname, "src/models"),
			"@utils": path.join(__dirname, "src/utils"),
			"@api": path.join(__dirname, "src/api"),
		},
		configure: {
			resolve: {
				fallback: {
					crypto: false,
					stream: false,
					assert: false,
					http: false,
					https: false,
					url: false,
					os: false,
				},
			},
			plugins: [
				new webpack.ProvidePlugin({
					Buffer: ["buffer", "Buffer"],
					// process: "process/browser",
					process: "process/browser.js",
				}),
				new webpack.DefinePlugin({
					"process.env.CONFIG": JSON.stringify(CONFIG),
				}),
			],
		},
	},
};
