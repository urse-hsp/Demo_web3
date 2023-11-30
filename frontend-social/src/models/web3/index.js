/* eslint-disable prefer-promise-reject-errors */
import { useState, useEffect, useCallback } from "react";
import { createContainer } from "unstated-next";

// Wallet Models
import Web3 from "web3";
import detectEthereumProvider from "@metamask/detect-provider";

import Storage from "@models/storage";
import CONFIG from "@/config";
import ERC20_ABI from "./erc20_abi.json";
import ABI_social from "./social.json";

function useWeb3Hook() {
	// Web3
	const [web3, setWeb3] = useState(null);
	const [provider, setProvider] = useState(null);
	const [isInited, setInited] = useState(false);
	const [currentAccount, setCurrentAccount] = useState(null);
	const [social, setSocial] = useState(null);

	// Other
	const { walletType, networkId, setNetworkId, setWalletType } = Storage.useContainer();

	/*==================================================
	Function
	==================================================*/

	/*==================================================
	Handle
	==================================================*/

	const handleConnect = useCallback(
		async (network_id, wallet_type, auto_connect) => {
			let chainsInfo = CONFIG.chains.find((item) => {
				return item.networkId === Number(network_id);
			});
			if (!chainsInfo) {
				alert(`不支持的网络，需要切换到支持的网络`);
				return true;
			}

			try {
				let providerInstance = null;
				switch (wallet_type) {
					case "MetaMask":
						providerInstance = await detectEthereumProvider();
						break;
					default:
						providerInstance = await detectEthereumProvider();
						break;
				}

				let account = [];
				if (providerInstance) {
					// 解锁 MateMask
					const accounts = await providerInstance.request({
						method: "eth_requestAccounts",
					});
					account = accounts[0];
				} else {
					if (!auto_connect) {
						alert(`Please install ${wallet_type} !`);
						return "Please install";
					}
					return;
				}

				const walletChainId = await providerInstance.request({
					method: "eth_chainId",
				});
				let providerChainId = walletChainId.toString().indexOf("0x") === 0 ? parseInt(walletChainId, 16) : walletChainId;

				// Change to current network
				if (Number(network_id) !== providerChainId) {
					try {
						await providerInstance.request({
							method: "wallet_switchEthereumChain",
							params: [{ chainId: `0x${network_id.toString(16)}` }],
						});
					} catch (switchError) {
						console.error("wallet_switchEthereumChain", switchError);
						// This error code indicates that the chain has not been added to MetaMask.
						if (switchError.code === 4902) {
							try {
								let params = {
									chainId: `0x${network_id.toString(16)}`,
									chainName: chainsInfo.name,
									nativeCurrency: chainsInfo.nativeCurrency,
									rpcUrls: chainsInfo.rpc,
									blockExplorerUrls: [chainsInfo.explorers[0].url],
								};
								await providerInstance.request({
									method: "wallet_addEthereumChain",
									params: [params],
								});
							} catch (addError) {
								alert(addError.message);
								return addError.message;
							}
						} else if (switchError.code === 4001) {
							return alert(`❌ 你拒绝了 "切换网络" 的请求`);
						} else if (switchError.code === -32002) {
							return alert(`😊 已经发送了 "切换网络" 的请求，\n请动动你发财的小手在钱包内确认一下。`);
						} else {
							alert(switchError.message);
							return switchError.message;
						}
					}
				}

				let web3instance = new Web3(providerInstance);
				let CONTRACT_ACCOUNT = CONFIG.networks[network_id].contracts;

				const basicContract = new web3instance.eth.Contract(ABI_social, CONTRACT_ACCOUNT.social);
				// Set
				setNetworkId(network_id);
				setWalletType(wallet_type);
				setWeb3(web3instance);
				setProvider(providerInstance);
				setInited(true);
				setCurrentAccount(web3instance.utils.toChecksumAddress(account));
				setSocial(basicContract);
				return null;
			} catch (e) {
				setWalletType("");
				let messgae = e.message;
				switch (e.code) {
					case -32002:
						messgae = "Please confirm your operation in MetaMask";
						break;
					default:
						break;
				}
				console.error("最终错误", e);
				alert(messgae);
				return messgae;
			}
		},
		[setNetworkId, setWalletType]
	);

	const handleDisconnect = useCallback(async () => {
		// Contract
		// setWalletType("");
		// setNetworkId(CONFIG.DEFAULT_NETWORK_LOCATION);

		setWeb3(null);
		setProvider(null);
		setInited(false);
		setCurrentAccount(null);
		setSocial(null);

		// if (!isInited) return;
		// provider.isWalletLink && provider.close();
		// provider.disconnect && (await provider.disconnect("UI"));
		// alert(`Wallet is disconnected from (${walletType})`);
	}, []);

	/*==================================================
	UseEffect
	==================================================*/
	useEffect(() => {
		if (!networkId || !walletType) {
			return;
		}
		setTimeout(() => {
			handleConnect(networkId, walletType, true);
		}, 10);
	}, [handleConnect, networkId, walletType]);

	useEffect(() => {
		if (!provider) return;
		if (!provider.on) return;
		provider.on("accountsChanged", (_accounts, a, b) => {
			// Handle the new _accounts, or lack thereof.
			// "_accounts" will always be an array, but it can be empty.
			if (!_accounts.length) {
				return;
			}
			if (currentAccount === _accounts[0]) {
				return;
			}
			setCurrentAccount(_accounts[0]);
			window.location.reload();
		});

		// Subscribe to chainId change
		// chainId doc: https://chainid.network/
		provider.on("chainChanged", async (chainId) => {
			// Handle the new chain.
			// Correctly handling chain changes can be complicated.
			// We recommend reloading the page unless you have good reason not to.
			const chainIdValue = chainId.toString().indexOf("0x") === 0 ? parseInt(chainId, 16) : chainId;
			let network = CONFIG.chains.find((element) => {
				return element.chainId === Number(chainIdValue);
			});
			setNetworkId(network.networkId);
			window.location.reload();
		});

		// Subscribe to provider disconnection
		provider.once("disconnect", async (event) => {
			await handleDisconnect();
		});
	}, [provider, currentAccount, handleDisconnect, setNetworkId]);

	//
	const getGasPrice = useCallback(() => {
		if (!web3) return Promise.resolve("0");
		return web3.eth.getGasPrice();
	}, [web3]);

	const getContract = useCallback(
		(ABI, address) => {
			if (!web3 || !address) return Promise.resolve("0");
			return new web3.eth.Contract(ABI, address);
		},
		[web3]
	);
	const getErcContract = useCallback((address) => getContract(ERC20_ABI, address), [getContract]);

	const getTokenData = useCallback(
		(tokenAddress) => {
			const ercContract = getErcContract(tokenAddress);
			return Promise.all([ercContract.methods.symbol().call(), ercContract.methods.name().call(), ercContract.methods.decimals().call()])
				.then(([symbol, name, decimals]) => ({
					symbol,
					name,
					decimals: parseInt(decimals, 10),
					tokenAddress,
				}))
				.catch(() => null);
		},
		[getErcContract]
	);

	return {
		web3,
		provider,
		isInited,
		currentAccount,

		async connect(location, wallet_type) {
			return await handleConnect(location, wallet_type);
		},
		async disconnect() {
			return await handleDisconnect();
		},
		getContract,
		getTokenData,
		getErcContract,
		getGasPrice,
		//
		social,
	};
}

const Web3Models = createContainer(useWeb3Hook);

export default Web3Models;
