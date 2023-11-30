import { useState } from "react";
import { createContainer } from "unstated-next";
import { storage } from "@/utils";
import CONFIG from "@/config";

const keys = {
	CREATE_TITLE: "",
	CREATE_NODE: null,
	CREATE_CONTENT: "",
	HISTORY: null,
	REPLY: null,
	REPLY_TO: null,
	DRAFT: null,
};
const keyInit = {};
Object.keys(keys).map((key) => {
	const storageInfo = storage(key);
	keyInit[key] = storageInfo || keys[key];
});

const defaultStates = {
	NETWORK_ID: storage("NETWORK_ID") || CONFIG.DEFAULT_NETWORK_LOCATION,
	WALLET_TYPE: storage("WALLET_TYPE") || CONFIG.DEFAULT_WALLET_TYPE,
};
function useStorage(customInitialStates = {}) {
	const initStates = Object.assign({}, defaultStates, customInitialStates);
	const [networkId, setNetworkId] = useState(initStates.NETWORK_ID);
	const [walletType, setWalletType] = useState(initStates.WALLET_TYPE);
	const [network, setNetwork] = useState(CONFIG.networks[initStates.NETWORK_ID]);

	// create
	const [global, setGlobal] = useState(keyInit);

	return {
		networkId,
		walletType,
		network,
		setNetworkId: (payload) => {
			storage("NETWORK_ID", payload);
			CONFIG.NETWORK_ID = payload;
			setNetworkId(payload);
			setNetwork(CONFIG.networks[payload]);
		},
		setWalletType: (payload) => {
			storage("WALLET_TYPE", payload);
			CONFIG.WALLET_TYPE = payload;
			setWalletType(payload);
		},
		global,
		setGlobal: (key, value) => {
			const temp = {};
			if (typeof keys[key] === "object") {
				temp[key] = JSON.stringify(value);
				storage(key, JSON.stringify(value));
				setGlobal(Object.assign({}, global, temp));
			} else {
				temp[key] = value;
				storage(key, value);
				setGlobal(Object.assign({}, global, temp));
			}
		},
	};
}

const Storage = createContainer(useStorage);

export default Storage;
