import React, { useState, useEffect, useCallback } from "react";
import { Outlet, Link, useParams } from "react-router-dom";
import moment from "moment";
import CONFIG from "@/config";
import Jazzicon, { jsNumberForAddress } from "react-jazzicon";
import Web3 from "@models/web3";
import * as Promise from "bluebird";

import Header from "@/layout/header";
import Footer from "@/layout/footer";
import "./index.scss";
import { getTopicsByAddress, getReplysByAddress, getNodes, getAddressInfo, getFollowings, getFollowers } from "@models/api";

// socal
import blockscan from "@assets/assets/blockscan.svg";
import opensea from "@assets/assets/opensea.svg";
import debank from "@assets/assets/debank.svg";
// socal
import discord from "@assets/social/discord.svg";
import github from "@assets/social/github.svg";
import linkedin from "@assets/social/linkedin.svg";
import telegram from "@assets/social/telegram.svg";
import twitter from "@assets/social/twitter.svg";
import youtube from "@assets/social/youtube.svg";
import website from "@assets/social/website.svg";
// chat
import chat from "@assets/chat/blockscan.svg";

export default function Address() {
	/*==================================================
	Data
	==================================================*/
	// const { ads } = useParams();
	console.log("window.location.pathname", window.location.pathname.slice(1));
	const address = window.location.pathname.slice(1);

	const [addressInfo, setAddressInfo] = useState({
		name: "",
	});
	const [list, setList] = useState([]);
	const [replys, setReplys] = useState([]);
	const [nodes, setNodes] = useState([]);

	const [submitting, setSubmitting] = useState(false);
	const [followings, setFollowings] = useState([]);
	const [followers, setFollowers] = useState([]);

	const { web3, currentAccount, social, getGasPrice } = Web3.useContainer();
	const isAddress = web3 && web3.utils.isAddress(address);

	/*==================================================
	Function
	==================================================*/
	const showNodeInfo = useCallback(
		(node_id) => {
			if (nodes.length) {
				const info = nodes.find((item) => item.value === Number(node_id));
				return info ? info.name : "未知";
			} else {
				return node_id;
			}
		},
		[nodes]
	);
	/*==================================================
	Handle
	==================================================*/

	const goLink = (address) => {
		window.location.href = `/${address}`;
	};

	const handleFollow = async (e) => {
		setSubmitting(true);
		const isFollow = window.confirm("在这里点关注，关注时会对该用户备注'大帅逼'");
		if (!isFollow) {
			setSubmitting(false);
			return;
		}
		const gasValue = await web3.eth.getGasPrice();

		// follow(uint256 channel_id, bytes32 message, string calldata signature, address target, bool status)
		const channel_id = "1";
		const message = currentAccount;
		const signature = "";
		const target = address;
		const status = true;
		const remark = "大帅逼";

		social.methods
			.follow(channel_id, message, signature, target, status, remark)
			.send({
				gasPrice: gasValue,
				from: currentAccount,
			})
			.on("transactionHash", function (transactionHash) {
				console.log("transactionHash", transactionHash);
				setSubmitting(false);
				alert("关注成功，等待区块链打包完成。");
				window.location.reload();
				return Promise.resolve();
			})
			.on("error", function (error, receipt) {
				setSubmitting(false);
			});
	};

	/*==================================================
	UseEffect
	==================================================*/
	useEffect(() => {
		(async () => {
			const nodes = getNodes();
			const ads = getAddressInfo(address);

			const promiseAllResult = await Promise.map(
				[nodes, ads],
				function (thing) {
					return new Promise(function (resolve, reject) {
						resolve(thing);
					});
				},
				{
					concurrency: 5,
				}
			);
			console.log("addressResult", ads);

			if (promiseAllResult[0].code === 200) {
				const opts = [];
				promiseAllResult[0].data.forEach((item) => {
					opts.push({
						value: item.node_id,
						name: item.name,
						label: item.aliases ? `${item.name} (${item.aliases})` : item.name,
					});
				});
				setNodes(opts);
			}
			if (promiseAllResult[1].code === 200 && promiseAllResult[1].data.length) {
				setAddressInfo(promiseAllResult[1].data[0]);
			}
		})();
	}, [address]);
	useEffect(() => {
		if (addressInfo) {
			document.title = `${CONFIG.WEBSITE} > ${addressInfo.name ? addressInfo.name : address}`;
		}
	}, [addressInfo]);

	useEffect(() => {
		(async () => {
			let result = await getTopicsByAddress(address, 0, 5);
			let resultReplys = await getReplysByAddress(address, 0, 5);

			let resultFollowings = await getFollowings(address);
			let resultFollowers = await getFollowers(address);

			if (result.code === 200) {
				setList(result.data);
			}
			if (resultReplys.code === 200) {
				setReplys(resultReplys.data);
			}
			if (resultFollowings.code === 200) {
				setFollowings(resultFollowings.data);
			}
			if (resultFollowers.code === 200) {
				setFollowers(resultFollowers.data);
			}
		})();
	}, []);
	/*==================================================
	DOM
	==================================================*/
	return (
		<>
			<Header />
			<div className="core address">
				<div className="container">
					<div className="address-wrap">
						{addressInfo && (
							<div className="node-info">
								<div className="node-img">
									{addressInfo.avatar ? (
										<img src={addressInfo.avatar.indexOf("http") === 0 ? `${addressInfo.avatar}` : `https://${addressInfo.avatar}`} className="avatar" alt="avatar" />
									) : (
										<Jazzicon
											diameter={120}
											paperStyles={{
												borderRadius: "22px",
												verticalAlign: "middle",
											}}
											seed={jsNumberForAddress(address)}
										/>
									)}
								</div>
								<div className="node-des">
									<div className="flex">
										<h1 className="node-name">{addressInfo.name ? addressInfo.name : address.slice(0, 8)}</h1>
										<a href={`https://chat.blockscan.com/index?a=${address}`} target="_blank" rel="noopener noreferrer" title="start a chat">
											<img src={chat} className="chat" alt="chat" />
										</a>
									</div>
									<p className="show-address">{address}</p>
									<p className="address-desc">{addressInfo.description}</p>
									<div className="address-assets">
										<ul>
											{isAddress && (
												<>
													<li>
														<a href={`https://blockscan.com/address/${address}`} target="_blank" rel="noopener noreferrer">
															<img src={blockscan} alt="blockscan" />
														</a>
													</li>
													<li>
														<a href={`https://debank.com/profile/${address}`} target="_blank" rel="noopener noreferrer">
															<img src={debank} alt="debank" />
														</a>
													</li>
													<li>
														<a href={`https://opensea.io/${address}`} target="_blank" rel="noopener noreferrer">
															<img src={opensea} alt="opensea" />
														</a>
													</li>
												</>
											)}
											{/* 媒体 */}
											{addressInfo.website && (
												<li>
													<a href={`https://${addressInfo.website}`} target="_blank" rel="noopener noreferrer" title="Website">
														<img src={website} className="website" alt="website" />
													</a>
												</li>
											)}
											{addressInfo.twitter && (
												<li>
													<a href={`https://twitter.com/${addressInfo.twitter}`} target="_blank" rel="noopener noreferrer" title="Twitter">
														<img src={twitter} className="twitter" alt="twitter" />
													</a>
												</li>
											)}
											{addressInfo.youtube && (
												<li>
													<a href={`https://www.youtube.com/channel/${addressInfo.youtube}`} target="_blank" rel="noopener noreferrer" title="Youtube">
														<img src={youtube} className="youtube" alt="youtube" />
													</a>
												</li>
											)}
											{addressInfo.telegram && (
												<li>
													<a href={`https://t.me/${addressInfo.telegram}`} target="_blank" rel="noopener noreferrer" title="Telegram">
														<img src={telegram} className="telegram" alt="telegram" />
													</a>
												</li>
											)}
											{addressInfo.github && (
												<li>
													<a href={`https://github.com/${addressInfo.github}`} target="_blank" rel="noopener noreferrer" title="Github">
														<img src={github} className="github" alt="github" />
													</a>
												</li>
											)}
											{addressInfo.discord && (
												<li>
													<a href={`https://discord.com/invite/${addressInfo.discord}`} target="_blank" rel="noopener noreferrer" title="Discord">
														<img src={discord} className="discord" alt="discord" />
													</a>
												</li>
											)}
											{addressInfo.linkedin && (
												<li>
													<a href={`https://www.linkedin.cn/incareer/in/${addressInfo.linkedin}`} target="_blank" rel="noopener noreferrer" title="Linkedin">
														<img src={linkedin} className="linkedin" alt="linkedin" />
													</a>
												</li>
											)}
										</ul>
									</div>
									<div className="address-assets">
										<div className="flex">
											{currentAccount && currentAccount.toLowerCase() === address.toLowerCase() && (
												<>
													<Link to={`/a/${address}`}>编辑个人信息</Link> &nbsp;&nbsp; / &nbsp;&nbsp; 查看我的收藏
												</>
											)}
										</div>
									</div>

									<div className="address-assets">
										<span className="following">
											<strong>{addressInfo.following || 0}</strong> 正在关注&nbsp;&nbsp;&nbsp;&nbsp;<strong>{addressInfo.followers || 0}</strong> 关注者
										</span>
										&nbsp;&nbsp;
										{address === currentAccount ? <></> : <button onClick={handleFollow}>Follow</button>}
									</div>
								</div>
							</div>
						)}
					</div>
					<div className="all-topics">
						<div className="area-top flex justify">
							<h2>最近主题</h2>
							<Link className="more" to={`/topics/${address}`}>
								More
							</Link>
						</div>
						{list.length ? (
							<ul className="topic-list">
								{list.map((item) => {
									return (
										<li key={item.transaction_hash}>
											<div className="flex">
												<div className="reply-wrap">
													<div className="reply">{item.total_reply}</div>
												</div>
												<div className="topic">
													<Link to={`/t/${item.transaction_hash}`}>
														<p>{item.title}</p>
													</Link>

													<p className="topic-info">
														<span>
															<Link to={`/n/${item.node_id}`}>{showNodeInfo(item.node_id)}</Link>
														</span>
														<span>
															By:
															<Link to={`/${item.author_address}`}>{item.author_address_name ? item.author_address_name : item.author_address.slice(0, 8)}</Link>
														</span>
														<span>
															发布于:
															<i>{moment(item.timestamp * 1000).format("MM-DD HH:mm")}</i>
														</span>

														{item.lastest_reply_address && (
															<>
																<span>
																	最后回复来自:
																	<Link to={`/${item.lastest_reply_address}`}>{item.lastest_reply_name ? item.lastest_reply_name : item.lastest_reply_address.slice(0, 8)}</Link>
																	{moment(item.lastest_reply_timestamp * 1000).fromNow()}
																</span>
															</>
														)}
													</p>
												</div>
											</div>
										</li>
									);
								})}
							</ul>
						) : (
							<p className="null">暂无</p>
						)}
					</div>
					<div className="all-replys">
						<div className="area-top flex justify">
							<h2>最近回复</h2>
							<Link className="more" to={`/replys/${address}`}>
								More
							</Link>
						</div>
						{replys.length ? (
							<ul>
								{replys.map((item) => {
									return (
										<li className="reply-item" key={item.transaction_hash}>
											<div className="reply-top flex justify">
												<Link to={`/t/${item.topic_hash}`}>{item.topic_title ? item.topic_title : `${item.topic_hash.slice(0, 20)}...`}</Link>
												<p className="reply-info">
													<span>
														发布于:
														<i>{moment(item.timestamp * 1000).format("YYYY-MM-DD HH:mm")}</i>
													</span>
													<span>网络: {CONFIG.networks[item.location].name}</span>
													{/* <span>类型: {item.event}</span> */}
												</p>
											</div>
											<p>{item.content}</p>
										</li>
									);
								})}
							</ul>
						) : (
							<p className="null">暂无</p>
						)}
					</div>

					<div className="all-follow">
						<div className="area-top flex justify">
							<h2>正在关注的人</h2>
						</div>
						{followings.length ? (
							<ul>
								{followings.map((item) => {
									return (
										<li className="follow-item" key={item.to_address}>
											<div className="follow-top flex  ">
												{item.to_address_avatar ? (
													<div className="follow-img">
														<img src={`https://${item.to_address_avatar}`} alt="from address avatar" />
													</div>
												) : (
													<Jazzicon
														diameter={120}
														paperStyles={{
															borderRadius: "5px",
															verticalAlign: "middle",
														}}
														seed={jsNumberForAddress(item.to_address)}
													/>
												)}
												<div className="follow-main">
													<div>
														<strong className="link" onClick={() => goLink(item.to_address)}>
															{item.to_address_name ? item.to_address_name : `${item.to_address.slice(0, 8)}...`}
														</strong>
														&nbsp;&nbsp;
														<span className="show-address">{item.address_remark}</span>
													</div>
													<p className="show-address"> {item.to_address}</p>
													<p>{item.to_address_description}</p>
												</div>
											</div>
										</li>
									);
								})}
							</ul>
						) : (
							<p className="null">暂无</p>
						)}
					</div>
					<div className="all-follow">
						<div className="area-top flex justify">
							<h2>追随者</h2>
						</div>
						{followers.length ? (
							<ul>
								{followers.map((item) => {
									return (
										<li className="follow-item" key={item.from_address}>
											<div className="follow-top flex  ">
												{item.from_address_avatar ? (
													<div className="follow-img">
														<img src={`https://${item.from_address_avatar}`} alt="from address avatar" />
													</div>
												) : (
													<Jazzicon
														diameter={64}
														paperStyles={{
															borderRadius: "50%",
															verticalAlign: "middle",
														}}
														seed={jsNumberForAddress(item.from_address)}
													/>
												)}
												<div className="follow-main">
													<strong className="link" onClick={() => goLink(item.from_address)}>
														{item.from_address_name ? item.from_address_name : `${item.from_address.slice(0, 8)}...`}
													</strong>
													<p className="show-address"> {item.from_address}</p>
													<p>{item.from_address_description ? item.from_address_description : "暂无信息"}</p>
												</div>
											</div>
										</li>
									);
								})}
							</ul>
						) : (
							<p className="null">暂无</p>
						)}
					</div>
				</div>
			</div>
			<Footer />
			<Outlet />
		</>
	);
}
