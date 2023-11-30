import React, { useState, useEffect } from "react";
import { Outlet, Link } from "react-router-dom";
import CONFIG from "@/config";
import Web3 from "@models/web3";

import Header from "@/layout/header";
import Footer from "@/layout/footer";
import "./index.scss";
import { getAddressInfo } from "@models/api";
// socal
import discord from "@assets/social/discord.svg";
import github from "@assets/social/github.svg";
import telegram from "@assets/social/telegram.svg";
import twitter from "@assets/social/twitter.svg";
import youtube from "@assets/social/youtube.svg";

export default function Attribute({ match }) {
	/*==================================================
	Data
	==================================================*/
	const address = window.location.pathname.slice(3);
	const [userName, setUserName] = useState("");
	const [userDescription, setUserDescription] = useState("");
	const [avatarValue, setAavatar] = useState("");
	const [websiteValue, setWebsite] = useState("");
	const [twitterValue, setTwitter] = useState("");
	const [youtubeValue, setYoutube] = useState("");
	const [telegramValue, setTelegram] = useState("");
	const [githubValue, setGithub] = useState("");
	const [discordValue, setDiscord] = useState("");
	const { web3, currentAccount, social } = Web3.useContainer();
	const [submitting, setSubmitting] = useState(false);

	/*==================================================
	Function
	==================================================*/

	/*==================================================
	Handle
	==================================================*/
	const submitTopic = async () => {
		const opt = {
			name: userName,
			description: userDescription,
			email: "",
			website: websiteValue,
			avatar: avatarValue,
			discord: discordValue,
			github: githubValue,
			twitter: twitterValue,
			youtube: youtubeValue,
			telegram: telegramValue,
		};
		let arr = [];
		Object.keys(opt).map((item) => {
			if (opt[item]) {
				arr.push(web3.utils.utf8ToHex(`${item} ${opt[item]}`));
			}
		});
		if (!arr.length) {
			return alert("请填写信息");
		}
		console.log("arr", arr.length);

		const gasValue = await web3.eth.getGasPrice();

		// uint256 channel_id, bytes32 message, string calldata signature, bytes[] calldata data
		const channel_id = "1";
		const message = currentAccount;
		const signature = "";
		const data = arr;
		setSubmitting(true);
		social.methods
			.attributes(channel_id, message, signature, data)
			.send({
				gasPrice: gasValue,
				from: currentAccount,
			})
			.on("transactionHash", function (transactionHash) {
				console.log("transactionHash", transactionHash);
				setSubmitting(false);
				alert("发布成功，等待区块链打包完成。");
				window.location.href = `/${currentAccount}`;
			})
			.on("error", function (error, receipt) {
				setSubmitting(false);
				return;
			});
	};

	/*==================================================
	UseEffect
	==================================================*/
	useEffect(() => {
		document.title = `编辑个人信息 - ${CONFIG.WEBSITE}`;
	}, []);

	useEffect(() => {
		(async () => {
			const ads = await getAddressInfo(address);
			if (ads.code === 200 && ads.data.length) {
				console.log("ads", ads.data[0]);
				const info = ads.data[0];
				if (info.name) {
					setUserName(info.name);
				}
				if (info.avatar) {
					setAavatar(info.avatar);
				}
				if (info.description) {
					setUserDescription(info.description);
				}
				if (info.website) {
					setWebsite(info.website);
				}
				if (info.twitter) {
					setTwitter(info.twitter);
				}
				if (info.youtube) {
					setYoutube(info.youtube);
				}
				if (info.telegram) {
					setTelegram(info.telegram);
				}
				if (info.github) {
					setGithub(info.github);
				}
				if (info.discord) {
					setDiscord(info.discord);
				}
			}
		})();
	}, []);
	/*==================================================
	DOM
	==================================================*/
	return (
		<>
			<Header />
			<div className="core attribute">
				<div className="container">
					<div className="attribute-wrap">
						<h1>编辑个人信息</h1>
						<div className="media">
							<ul>
								<li>
									<div className="flex">
										<div className="media-item">地址</div>
										<div className="media-info">
											<strong className="address-value">{address.slice(0, 16)}...</strong>
											<i>（当前地址）</i>
										</div>
									</div>
								</li>
								<li>
									<div className="flex">
										<div className="media-item">昵称</div>
										<div className="media-info user-name">
											<div className="flex">
												<input
													type="text"
													value={userName}
													onChange={(e) => {
														setUserName(e.target.value);
													}}
												/>
											</div>
											<p className="des">支持字母/数字/多字节文字等</p>
										</div>
									</div>
								</li>
								<li>
									<div className="flex">
										<div className="media-item">描述</div>
										<div className="media-info user-name">
											<div className="flex">
												<input
													type="text"
													value={userDescription}
													onChange={(e) => {
														setUserDescription(e.target.value);
													}}
												/>
											</div>
											<p className="des">介绍自己</p>
										</div>
									</div>
								</li>{" "}
								*
								<li>
									<div className="flex">
										<div className="media-item"> 头像</div>
										<div className="media-info">
											<div className="flex">
												<span>https://</span>
												<input
													type="text"
													value={avatarValue}
													onChange={(e) => {
														setAavatar(e.target.value);
													}}
												/>
											</div>
											{avatarValue && <img src={`https://${avatarValue}`} alt="avatar" />}
										</div>
									</div>
								</li>
								<li>
									<div className="flex">
										<div className="media-item">网站</div>
										<div className="media-info">
											<div className="flex">
												<span>https://</span>
												<input
													type="text"
													value={websiteValue}
													onChange={(e) => {
														setWebsite(e.target.value);
													}}
												/>
											</div>
											{websiteValue && <p className="web-review">{`https://${websiteValue}`}</p>}
										</div>
									</div>
								</li>
								<li>
									<div className="flex">
										<div className="media-item">
											<img src={twitter} className="icon" alt="twitter" />
										</div>
										<div className="media-info">
											<div className="flex">
												<span>https://twitter.com/</span>
												<input
													type="text"
													value={twitterValue}
													onChange={(e) => {
														setTwitter(e.target.value);
													}}
												/>
											</div>
										</div>
									</div>
								</li>
								<li>
									<div className="flex">
										<div className="media-item">
											<img src={youtube} className="icon" alt="youtube" />
										</div>
										<div className="media-info">
											<div className="flex">
												<span>https://www.youtube.com/channel/</span>
												<input
													type="text"
													value={youtubeValue}
													onChange={(e) => {
														setYoutube(e.target.value);
													}}
												/>
											</div>
										</div>
									</div>
								</li>
								<li>
									<div className="flex">
										<div className="media-item">
											<img src={telegram} className="icon" alt="telegram" />
										</div>
										<div className="media-info">
											<div className="flex">
												<span>https://t.me/</span>
												<input
													type="text"
													value={telegramValue}
													onChange={(e) => {
														setTelegram(e.target.value);
													}}
												/>
											</div>
										</div>
									</div>
								</li>
								<li>
									<div className="flex">
										<div className="media-item">
											<img src={github} className="icon" alt="github" />
										</div>
										<div className="media-info">
											<div className="flex">
												<span>https://github.com/</span>
												<input
													type="text"
													value={githubValue}
													onChange={(e) => {
														setGithub(e.target.value);
													}}
												/>
											</div>
										</div>
									</div>
								</li>
								<li>
									<div className="flex">
										<div className="media-item">
											<img src={discord} className="icon" alt="discord" />
										</div>
										<div className="media-info">
											<div className="flex">
												<span>https://discord.com/invite/</span>
												<input
													type="text"
													value={discordValue}
													onChange={(e) => {
														setDiscord(e.target.value);
													}}
												/>
											</div>
										</div>
									</div>
								</li>
								<li className="submit-area">
									<div className="flex">
										<div className="media-item"></div>
										<div className="media-info">
											<button onClick={submitTopic}>提交信息</button>
										</div>
									</div>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
			<Footer />
			<Outlet />
		</>
	);
}
