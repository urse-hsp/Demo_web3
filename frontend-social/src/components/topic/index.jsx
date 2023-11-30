import React, { useState, useEffect, useCallback } from "react";
import { Outlet, Link } from "react-router-dom";
import Jazzicon, { jsNumberForAddress } from "react-jazzicon";
import * as Promise from "bluebird";
import ReactMarkdown from "react-markdown";
import Web3 from "@models/web3";
import Modal from "@/layout/modal";

// import { Link } from "react-router-dom";
import { getTopic, getTopicAppends, getReplysByTopic, getNode, getAddressInfo } from "@models/api";
import moment from "moment";
import CONFIG from "@/config";

import Header from "@/layout/header";
import Footer from "@/layout/footer";
import Storage from "@models/storage";
import Utils from "@models/utils";
import "./index.scss";

// socal
import discord from "@assets/social/discord.svg";
import github from "@assets/social/github.svg";
import telegram from "@assets/social/telegram.svg";
import twitter from "@assets/social/twitter.svg";
import youtube from "@assets/social/youtube.svg";
import ethaddress from "@assets/social/eth.svg";
import website from "@assets/social/website.svg";

export default function Topic() {
	const currentHash = window.location.pathname.slice(3);

	/*==================================================
	Data
	==================================================*/
	const [topic, setTopic] = useState(null);
	const [appends, setAppends] = useState([]);
	const [replys, setReplys] = useState([]);
	const [nodeInfo, setNodeInfo] = useState(null);
	const [addressInfo, setAddressInfo] = useState(null);

	const [replyValue, setReplyValue] = useState("");
	const [appendValue, setAppendValue] = useState("");
	const [submitting, setSubmitting] = useState(false);
	const [isToggleOn, setIsToggleOn] = useState(false);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [replySource, setReplySource] = useState(null);
	const [replyToValue, setReplyToValue] = useState("");
	const [replyToItem, setReplyToItem] = useState(null);

	const { global, setGlobal, networkId } = Storage.useContainer();
	const { web3, currentAccount, social, getGasPrice } = Web3.useContainer();

	/*==================================================
  F unction
  ==================================================*/

	/*==================================================
	Handle
	==================================================*/
	const handAppendTigger = () => {
		setIsToggleOn(!isToggleOn);
	};
	const handReplyTo = (item) => {
		console.log("item", item.content, item);
		setReplyToItem(item);
		setReplySource(
			<>
				<div className="tie-author">
					<div className="author-info">
						<Link to={`/${item.author_address}`}>{item.author_address_name ? item.author_address_name : `${item.author_address.slice(0, 8)}...`}</Link>
						<span>发表在 </span>
						<a href={`${CONFIG.networks[item.location].explorer_tx}/${item.topic_hash}`} target="_blank" rel="noopener noreferrer">
							{item.topic_hash.slice(0, 10)}...
						</a>
						<span className="nick-from">[{CONFIG.networks[item.topic_location].name}]</span>
					</div>
				</div>
				<ReactMarkdown>{item.content}</ReactMarkdown>
			</>
		);
		setIsModalVisible(true);
	};

	const searchReplyAuthor = useCallback(
		(hash) => {
			const target = replys.find((item) => {
				return item.transaction_hash === hash;
			});
			return target ? (
				<>
					<Link to={`/${target.author_address}`}>{target.author_address_name ? target.author_address_name : `${target.author_address.slice(0, 8)}...`}</Link>
					<span>发表在</span>
				</>
			) : (
				<></>
			);
		},
		[replys]
	);

	const searchReplySource = useCallback(
		(hash) => {
			const target = replys.find((item) => {
				return item.transaction_hash === hash;
			});
			return <ReactMarkdown>{target.content}</ReactMarkdown>;
		},
		[replys]
	);
	const handlerReplyChange = (e) => {
		setReplyValue(e.target.value);
		const replyStorage = JSON.parse(global.REPLY);
		var replysObj = replyStorage ? replyStorage.data : {};
		replysObj[currentHash] = e.target.value;
		setGlobal("REPLY", { data: replysObj });
	};

	const handlerReplyToChange = (e) => {
		setReplyToValue(e.target.value);
		const replyStorage = JSON.parse(global.REPLY_TO);
		var replyObj = replyStorage ? replyStorage.data : {};
		replyObj[`${currentHash}_${replyToItem.transaction_hash}`] = e.target.value;
		setGlobal("REPLY_TO", { data: replyObj });
	};
	const handleReplyTo = async () => {
		if (!replyToValue) {
			return alert("暂无回复内容");
		}
		setSubmitting(true);
		const gasValue = await getGasPrice();
		console.log("gasValue", gasValue, replyToItem);

		const channel_id = "1";
		const message = currentAccount;
		const signature = "";
		const topic_location = topic.location;
		const topic_hash = topic.topic_hash;
		const content = replyToValue;
		const reply_location = replyToItem.location;
		const reply_hash = replyToItem.transaction_hash;
		// uint256 channel_id, bytes32 message, string calldata signature, uint256 topic_location, string calldata topic_hash, string calldata content
		// uint256 reply_location, string calldata reply_hash
		social.methods
			.reply(channel_id, message, signature, topic_location, topic_hash, content, reply_location, reply_hash)
			.send({
				gasPrice: gasValue,
				from: currentAccount,
			})
			.on("transactionHash", function (transactionHash) {
				// 草稿
				const draftStorage = JSON.parse(global.DRAFT);
				var tempObj = draftStorage ? draftStorage.data : {};
				const draft = {
					block_hash: "",
					block_number: "",
					location: networkId,
					content: replyToValue,
					event: "ReplyTo",
					author_address: currentAccount,
					author_address_avatar: "",
					author_address_name: "",
					reply_location: replyToItem.location,
					reply_hash: replyToItem.transaction_hash,
					timestamp: parseInt(new Date().getTime() / 1000),
					topic_hash: topic.topic_hash,
					topic_network: topic.location,
					topic_title: topic.title,
					transaction_hash: transactionHash,
				};
				console.log("draft replyto", JSON.stringify(draft));
				if (tempObj[topic.topic_hash]) {
					tempObj[topic.topic_hash].Reply = draft;
				} else {
					tempObj[topic.topic_hash] = {
						Reply: draft,
					};
				}
				setGlobal("DRAFT", { data: tempObj });

				// Reply
				const replyStorage = JSON.parse(global.REPLY_TO);
				var replysObj = replyStorage ? replyStorage.data : {};
				delete replysObj[`${currentHash}_${replyToItem.transaction_hash}`];
				setGlobal("REPLY_TO", { data: replysObj });
				// Reply
				console.log("transactionHash", transactionHash);
				setSubmitting(false);
				window.location.reload();
				return Promise.resolve();
			})
			.on("error", function (error, receipt) {
				setSubmitting(false);
			});
	};
	const handleReply = async () => {
		if (!replyValue) {
			return alert("暂无回复内容");
		}
		setSubmitting(true);

		const gasValue = await web3.eth.getGasPrice();

		const channel_id = "1";
		const message = currentAccount;
		const signature = "";
		const topic_location = topic.location;
		const topic_hash = topic.topic_hash;
		const content = replyValue;
		// uint256 channel_id, bytes32 message, string calldata signature, uint256 topic_location, string calldata topic_hash, string calldata content
		console.log("==.", topic, channel_id, message, signature, topic_location, topic_hash, content);
		social.methods
			.reply(channel_id, message, signature, topic_location, topic_hash, content)
			.send({
				gasPrice: gasValue,
				from: currentAccount,
			})
			.on("transactionHash", function (transactionHash) {
				// 草稿
				const draftStorage = JSON.parse(global.DRAFT);
				var tempObj = draftStorage ? draftStorage.data : {};
				const draft = {
					transaction_hash: topic.topic_hash,
					block_hash: "",
					block_number: "",
					location: networkId,
					content: replyValue,
					event: "Reply",
					author_address: currentAccount,
					reply_hash: "",
					reply_location: "",
					timestamp: parseInt(new Date().getTime() / 1000),
					topic_hash: topic.topic_hash,
					topic_network: topic.location,
					transaction_hash: transactionHash,
				};

				if (tempObj[topic.topic_hash]) {
					tempObj[topic.topic_hash].Reply = draft;
				} else {
					tempObj[topic.topic_hash] = {
						Reply: draft,
					};
				}
				setGlobal("DRAFT", { data: tempObj });
				console.log("tempObj", tempObj);

				// Reply
				const replyStorage = JSON.parse(global.REPLY);
				var replysObj = replyStorage ? replyStorage.data : {};
				delete replysObj[currentHash];
				setGlobal("REPLY", { data: replysObj });

				console.log("transactionHash", transactionHash);
				setSubmitting(false);

				window.location.reload();
				return Promise.resolve();
			})
			.on("error", function (error, receipt) {
				setSubmitting(false);
			});
	};
	const handleAppendChange = async (e) => {
		setAppendValue(e.target.value);
	};
	const handleAppend = async (e) => {
		if (!appendValue) {
			return alert("暂无补充内容");
		}
		setSubmitting(true);
		const gasValue = await web3.eth.getGasPrice();

		/**
		 * uint256 channel_id,
		 * bytes32 message,
		 * string calldata signature,
		 * uint256 topic_location,
		 * string calldata topic_hash,
		 * string calldata content
		 */
		const channel_id = "1";
		const message = currentAccount;
		const signature = "";
		const topic_location = topic.location;
		const topic_hash = topic.topic_hash;
		const content = appendValue;

		console.log("topic", topic);
		console.log("---->", channel_id, message, signature, topic_location, topic_hash, content);
		social.methods
			.append(channel_id, message, signature, topic_location, topic_hash, content)
			.send({
				gasPrice: gasValue,
				from: currentAccount,
			})
			.on("transactionHash", function (transactionHash) {
				// 草稿
				const draftStorage = JSON.parse(global.DRAFT);
				var tempObj = draftStorage ? draftStorage.data : {};
				const draft = {
					block_hash: "",
					block_number: "",
					location: networkId,
					event: "Append",
					author_address: currentAccount,
					timestamp: parseInt(new Date().getTime() / 1000),
					topic_location: topic.location,
					topic_hash: topic.topic_hash,
					content: appendValue,
					transaction_hash: transactionHash,
				};
				if (tempObj[topic.topic_hash]) {
					tempObj[topic.topic_hash].Append = draft;
				} else {
					tempObj[topic.topic_hash] = {
						Append: draft,
					};
				}
				setGlobal("DRAFT", { data: tempObj });
				console.log("tempObj", tempObj);

				console.log("transactionHash", transactionHash);
				setSubmitting(false);
				window.location.reload();
				return Promise.resolve();
			})
			.on("error", function (error, receipt) {
				setSubmitting(false);
			});
	};

	const handleFollow = async (e) => {
		setSubmitting(true);
		const isFollow = window.confirm("关注作者地址，可以接受作者的发布动态(资金变化也可以做推送,推送功能需要用户设置邮箱)");
		if (!isFollow) {
			setSubmitting(false);
			return;
		}
		const gasValue = await web3.eth.getGasPrice();

		// follow(uint256 channel_id, bytes32 message, string calldata signature, address target, bool status)
		const channel_id = "1";
		const message = currentAccount;
		const signature = "";
		const target = topic.author_address;
		const status = true;
		const remark = "";

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
		if (topic) {
			document.title = `${topic.title} - ${CONFIG.WEBSITE}`;

			// 写回复
			const replyStorage = JSON.parse(global.REPLY);
			var replysObj = replyStorage ? replyStorage.data : {};
			if (replysObj[currentHash]) {
				setReplyValue(replysObj[currentHash]);
			}

			// 写缓存
			const historyTopic = JSON.parse(global.HISTORY);
			var historyAry = historyTopic ? historyTopic.data : [];
			const currentArticle = {
				title: topic.title,
				topic_hash: topic.topic_hash,
			};
			historyAry.unshift(currentArticle);
			const links = {};
			const targetArray = [];
			const historyLength = historyAry.length >= 10 ? 10 : historyAry.length;
			for (var index = 0, len = historyLength; index < len; index++) {
				var element = historyAry[index];
				if (!links[element.topic_hash]) {
					links[element.topic_hash] = true;
					targetArray.push(element);
				}
			}
			setGlobal("HISTORY", { data: targetArray });
		}
	}, [topic]);

	useEffect(() => {
		(async () => {
			const topicsPro = getTopic(currentHash);
			const topicsAppendPro = getTopicAppends(currentHash);
			const topicsReplys = getReplysByTopic(currentHash);
			// 获取Node信息，Address 信息
			// ❌
			const promiseAllResult = await Promise.map(
				[topicsPro, topicsAppendPro, topicsReplys],
				function (thing) {
					return new Promise(function (resolve, reject) {
						resolve(thing);
					});
				},
				{
					concurrency: 5,
				}
			);

			const draftStorage = JSON.parse(global.DRAFT);
			var tempObj = draftStorage ? draftStorage.data : {};
			// 主题
			if (promiseAllResult[0].data.length) {
				if (tempObj[currentHash]) {
					delete tempObj[currentHash].Create;
					if (Object.keys(tempObj[currentHash]).length === 0) {
						delete tempObj[currentHash];
					}
					setGlobal("DRAFT", { data: tempObj });
				}

				setTopic(promiseAllResult[0].data[0]);
			} else {
				if (tempObj[currentHash]) {
					const targetTopic = tempObj[currentHash].Create;
					if (targetTopic) {
						setTopic(targetTopic);
					}
				}
			}

			// 补充
			setAppends(promiseAllResult[1].data);
			if (tempObj[currentHash] && tempObj[currentHash].Append) {
				const appendLocal = promiseAllResult[1].data.find((item) => {
					return item.transaction_hash === tempObj[currentHash].Append.transaction_hash;
				});
				if (appendLocal) {
					delete tempObj[currentHash].Append;
					if (Object.keys(tempObj[currentHash]).length === 0) {
						delete tempObj[currentHash];
					}
					setGlobal("DRAFT", { data: tempObj });
				} else {
					setAppends(promiseAllResult[1].data.concat([tempObj[currentHash].Append]));
				}
			}

			// 如果有回复
			setReplys(promiseAllResult[2].data);
			if (tempObj[currentHash] && tempObj[currentHash].Reply) {
				const replyLocal = promiseAllResult[2].data.find((item) => {
					return item.transaction_hash === tempObj[currentHash].Reply.transaction_hash;
				});
				if (replyLocal) {
					delete tempObj[currentHash].Reply;
					if (Object.keys(tempObj[currentHash]).length === 0) {
						delete tempObj[currentHash];
					}
					setGlobal("DRAFT", { data: tempObj });
				} else {
					setReplys(promiseAllResult[2].data.concat([tempObj[currentHash].Reply]));
				}
			}

			// end
		})();
	}, []);

	useEffect(() => {
		(async () => {
			if (topic) {
				const nodePro = getNode(topic.node_id);
				const addressPro = getAddressInfo(topic.author_address);
				// const nodeNew = getAddressInfo();
				// 获取Node信息，Address 信息
				const promiseAllResult = await Promise.map(
					[nodePro, addressPro],
					function (thing) {
						return new Promise(function (resolve, reject) {
							resolve(thing);
						});
					},
					{
						concurrency: 5,
					}
				);
				setNodeInfo(promiseAllResult[0].data[0] || null);
				setAddressInfo(promiseAllResult[1].data[0] || null);
			}
		})();
	}, [topic]);

	/*==================================================
	DOM
	==================================================*/
	return (
		<>
			<Header />
			<div className="core topic">
				<div className="container">
					<div className="topic-wrap">
						{topic && (
							<div className="topic-detail">
								<h1 className="topic-title">{topic.title}</h1>
								<div className="topic-info">
									<span>
										作者:
										<Link to={`/${topic.author_address}`}>{addressInfo && addressInfo.name ? addressInfo.name : topic.author_address.slice(0, 8)}</Link>
									</span>
									<span>
										发布于:
										{moment(topic.timestamp * 1000).format("YYYY-MM-DD HH:mm")}
									</span>
									<span>网络: {CONFIG.networks[topic.location].name}</span>
									<span>
										所属节点: <Link to={`/n/${topic.node_id}`}>{nodeInfo ? nodeInfo.name : topic.node_id}</Link>
									</span>
									{!topic.block_hash && <span className="wait">确认中...</span>}
								</div>
								<div className="topic-content">
									<ReactMarkdown>{topic.content}</ReactMarkdown>
								</div>
							</div>
						)}
						{appends.length ? (
							<div className="topic-append">
								<ul>
									{appends.map((item) => {
										if (topic.author_address === item.author_address) {
											return (
												<li className="append-item" key={item.transaction_hash}>
													<div className="append-content">
														<ReactMarkdown>{item.content}</ReactMarkdown>
													</div>
													<p className="append-info">
														{!item.block_hash && <span className="wait">确认中...</span>}
														<span>
															补充于:
															<i>{moment(item.timestamp * 1000).format("YYYY-MM-DD HH:mm")}</i>
														</span>
														<span>网络: {CONFIG.networks[item.location].name}</span>

														<span>
															<a href={`${CONFIG.networks[item.location].explorer_tx}/${item.transaction_hash}`} target="_blank" rel="noopener noreferrer" title="链上查看">
																链上查看
															</a>
														</span>
													</p>
												</li>
											);
										}
									})}
								</ul>
							</div>
						) : (
							<></>
						)}
						{addressInfo && (
							<div className="topic-author">
								{addressInfo.name && <p>作者信息</p>}
								<ul className="social-links">
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
								</ul>
							</div>
						)}
						<div className="topic-action">
							<div className="flex justify">
								<ul>
									{topic && topic.author_address === currentAccount ? (
										<li className="append-tigger" onClick={handAppendTigger}>
											📝 追加内容
										</li>
									) : (
										<li className="pick" onClick={handleFollow}>
											😍 关注作者
										</li>
									)}
								</ul>
								{topic && (
									<ul>
										<li>
											<a href={`${CONFIG.networks[topic.location].explorer_tx}/${currentHash}`} target="_blank" rel="noopener noreferrer" title="浏览器内查看">
												浏览器内查看原文
											</a>
										</li>
									</ul>
								)}
							</div>
						</div>
						{topic && topic.author_address === currentAccount && isToggleOn && (
							<div className="append-panel">
								<textarea value={appendValue} onChange={handleAppendChange}></textarea>
								<button onClick={handleAppend} disabled={submitting}>
									追加
								</button>
							</div>
						)}
					</div>
					<div className="replys">
						{topic && replys.length ? (
							<ul>
								{replys.map((item, index) => {
									return (
										<li className="reply-item" key={item.transaction_hash}>
											<div className="flex">
												<div className="author-avatar">
													{item.author_address_avatar ? (
														<img
															src={item.author_address_avatar.indexOf("http") === 0 ? `${item.author_address_avatar}` : `https://${item.author_address_avatar}`}
															alt="avatar"
															width="48"
															height="48"
														/>
													) : (
														<Jazzicon
															diameter={48}
															paperStyles={{
																borderRadius: "50%",
																verticalAlign: "middle",
															}}
															seed={jsNumberForAddress(item.author_address)}
														/>
													)}
												</div>
												<div className="author-main">
													<div className="reply-top flex justify">
														<div>
															<strong className="address-name">
																<Link to={`/${item.author_address}`}>{item.author_address_name ? item.author_address_name : `${item.author_address.slice(0, 8)}...`}</Link>
															</strong>
															<span className="address-description">{item.author_address_description}</span>
														</div>
														<div>
															<a href={`${CONFIG.networks[item.location].explorer_tx}/${item.transaction_hash}`} target="_blank" rel="noopener noreferrer">
																浏览器内查看
															</a>
														</div>
													</div>
													{item.reply_hash ? (
														<>
															<div className="reply-target">
																<div className="tie-author">
																	<div className="author-info">
																		{searchReplyAuthor(item.reply_hash)}
																		<span>
																			<a href={`${CONFIG.networks[item.location].explorer_tx}/${item.reply_hash}`} target="_blank" rel="noopener noreferrer">
																				{item.reply_hash.slice(0, 10)}...
																			</a>
																		</span>
																		<span className="nick-from">[{CONFIG.networks[item.reply_location].name}]</span>
																	</div>
																</div>
																<div className="tie-cnt">
																	<div className="reply-content">{searchReplySource(item.reply_hash)}</div>
																</div>
															</div>
															<div className="reply-content">
																<ReactMarkdown>{item.content}</ReactMarkdown>
															</div>
														</>
													) : (
														<div className="reply-content">
															<ReactMarkdown>{item.content}</ReactMarkdown>
														</div>
													)}
													<div className="reply-area">
														<p className="reply-info">
															<span>
																{index + 1} 楼{item.author_address === topic.author_address && <>（楼主）</>}
															</span>
															<span>
																发布于:
																<i>{moment(item.timestamp * 1000).format("YYYY-MM-DD HH:mm")}</i>
															</span>
															<span className="network">网络: {CONFIG.networks[item.location].name}</span>
															{/* <span>类型: {item.event}</span> */}
															<span className="reply-button" onClick={() => handReplyTo(item)}>
																回复
															</span>
															{!item.block_hash && <span className="wait">确认中...</span>}
														</p>
														{/* <div className="temp-reply">
                              <textarea cols="30" rows="1"></textarea>
                              <button>回复</button>
                            </div> */}
													</div>
												</div>
											</div>
										</li>
									);
								})}
							</ul>
						) : (
							<></>
						)}
						<div className="reply-enter">
							<textarea onChange={handlerReplyChange} value={replyValue} />
							<div className="reply-des flex justify">
								<p className="markdown">
									* 支持&nbsp;
									<a href="https://www.markdownguide.org/basic-syntax/" target="_blank" rel="noopener noreferrer">
										Markdown格式
									</a>
								</p>
								<div>
									<button className="reply-button" disabled={submitting} onClick={handleReply}>
										回复
									</button>
								</div>
							</div>
						</div>
					</div>

					<Modal
						isVisible={isModalVisible}
						title="回复:"
						content={
							<>
								<div className="sources-reply">{replySource}</div>
								<textarea
									cols="30"
									rows="1"
									value={replyToValue}
									onChange={(e) => {
										handlerReplyToChange(e);
									}}></textarea>
							</>
						}
						footer={
							<>
								<button disabled={submitting} onClick={handleReplyTo}>
									回复
								</button>
							</>
						}
						onClose={() => setIsModalVisible(false)}
					/>
				</div>
			</div>
			<Footer />
			<Outlet />
		</>
	);
}
