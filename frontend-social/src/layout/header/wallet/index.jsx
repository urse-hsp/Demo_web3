import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Storage from "@models/storage";
import { formatAddress } from "@utils";
import CONFIG from "@/config";
import Web3 from "@models/web3";
import Modal from "@/layout/modal";

import "./index.scss";

// network
import c65 from "@assets/network/okc.svg";
import c1230 from "@assets/network/fibo.svg";
const network = {
	c65: c65,
	c1230: c1230,
};

// Wallet Connected
function WalletConnected() {
	const navigate = useNavigate();
	/*==================================================
	Data
	==================================================*/
	const [shortName, setShortName] = useState("-");
	const { currentAccount, disconnect } = Web3.useContainer();
	const { networkId } = Storage.useContainer();

	/*==================================================
	Function
	==================================================*/

	/*==================================================
	Handle
	==================================================*/
	const goLink = (path) => {
		const addressNow = window.location.pathname.slice(1, 3);
		if (addressNow === "0x") {
			window.location.href = path;
		} else {
			navigate(`${path}`);
		}
	};

	/*==================================================
	UseEffect
	==================================================*/
	useEffect(() => {
		let targetNetWork = CONFIG.chains.find((element) => {
			return element.networkId === Number(networkId);
		});
		setShortName(targetNetWork.shortName);
	}, [networkId]);

	/*==================================================
	DOM
	==================================================*/
	return (
		<>
			<div className="wallet-connected">
				<div className="btn-after-connect">
					<span>{shortName.toUpperCase()}</span>
					<span onClick={() => goLink(`/${currentAccount}`)}>
						&nbsp;({formatAddress(currentAccount)}
						)&nbsp;
					</span>
					<span className="close-link emoji" onClick={disconnect} alt="disconnect">
						❌
					</span>
				</div>
			</div>
		</>
	);
}

// Wallet Not Connected
function WalletNotConnected() {
	/*==================================================
	Data
	==================================================*/
	const [isModalVisible, setIsModalVisible] = useState(false);

	const { networkId } = Storage.useContainer();
	// const { networkId, setWalletType } = Storage.useContainer();
	const { connect } = Web3.useContainer();
	const [preChainId, setPreChainId] = useState(Number(networkId));
	const [submitting, setSubmitting] = useState(false);

	/*==================================================
	Function
	==================================================*/
	const handleChangeChain = (networkId) => {
		setSubmitting(true);
		setPreChainId(networkId);
		handleConnect(networkId, CONFIG.DEFAULT_WALLET_TYPE);
	};
	/*==================================================
	Handle
	==================================================*/
	const handleConnect = async (network_id, wallet_type) => {
		if (!(network_id && wallet_type)) {
			return setIsModalVisible(true);
		}
		try {
			let result = await connect(network_id, wallet_type);
			if (!result) {
				setPreChainId(Number(networkId));
				setIsModalVisible(false);
			}
		} catch (error) {
			// If it is a rollback, continue to let the user choose
			if (error === "rollback") {
				return handleConnect();
			}
		}
	};

	/*==================================================
	DOM
	==================================================*/
	return (
		<div className="wallet-not-connected">
			<button className="btn-connect-wallet" onClick={() => setIsModalVisible(true)}>
				<span className="emoji">🔗</span> 连接钱包
			</button>
			<Modal
				isVisible={isModalVisible}
				title="选择你要使用的网络"
				content={
					<>
						{Object.keys(CONFIG.networks).map((network_id) => {
							let element = CONFIG.networks[Number(network_id)];
							return (
								<button
									key={element.chainId}
									className={element.chainId === preChainId ? "active" : ""}
									onClick={() => {
										handleChangeChain(element.chainId);
									}}
									disabled={submitting}>
									<img src={network[`c${element.chainId}`]} className="chain-icon" />
									{element.name}
								</button>
							);
						})}
						<hr />
						<br />
						<div>
							<button className="">{CONFIG.WALLET_TYPE || CONFIG.DEFAULT_WALLET_TYPE}</button>
						</div>
					</>
				}
				footer={
					<button onClick={() => setIsModalVisible(false)}>
						<span className="emoji">✖️</span> 关闭
					</button>
				}
				onClose={() => setIsModalVisible(false)}
			/>
		</div>
	);
}

function Wallet() {
	/*==================================================
	Data
	==================================================*/
	const { currentAccount } = Web3.useContainer();

	/*==================================================
	Function
	==================================================*/

	/*==================================================
	Handle
	==================================================*/

	/*==================================================
	UseEffect
	==================================================*/

	/*==================================================
	DOM
	==================================================*/
	return <div className="wallet-area">{currentAccount ? <WalletConnected /> : <WalletNotConnected />}</div>;
}

export default Wallet;
