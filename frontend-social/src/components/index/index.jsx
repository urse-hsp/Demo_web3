import React, { useState, useEffect, useCallback } from "react";
import { Outlet, Link } from "react-router-dom";
// import { useHistory } from "react-router-dom";
import * as Promise from "bluebird";

import { getTopics, getTopicsHot, getNodesNew, getNodesHot, getWebsiteInfo, getNodes } from "@models/api";
import moment from "moment";
import Jazzicon, { jsNumberForAddress } from "react-jazzicon";
import Web3 from "@models/web3";
import { BigNumber } from "bignumber.js";
import CONFIG from "@/config";

//
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import Select from "react-select";

import Header from "@/layout/header";
import Footer from "@/layout/footer";
import Storage from "@models/storage";
import Utils from "@models/utils";
import "./index.scss";

import "moment/locale/zh-cn";
moment.locale("zh-cn");

const LIMIT = 30;
export default function Index({ theme }) {
	/*==================================================
	Data
	==================================================*/
	const [page, setPage] = useState(0);
	const [topics, setTopics] = useState([]);
	const [topicsHot, setTopicsHot] = useState([]);
	const [topicsHis, setTopicsHis] = useState(null);
	const [nodeNew, setNodeNew] = useState([]);
	const [nodeHot, setNodeHot] = useState([]);
	const [website, setWebsite] = useState({});

	const [balance, setBalance] = useState(0);
	const [networkSymbol, setNetworkSymbol] = useState("-");

	const [cmInstance, setCmInstance] = useState(null);
	const [nodes, setNodes] = useState([]);
	const [submitting, setSubmitting] = useState(false);

	const { web3, currentAccount, social } = Web3.useContainer();
	const { global, setGlobal, networkId } = Storage.useContainer();
	const { setTheme } = Utils.useContainer();

	// const history = useHistory();

	/*==================================================
	Function
	==================================================*/
	const getCmInstanceCallback = useCallback((editor) => {
		setCmInstance(editor);
	}, []);
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
	const handlerClear = () => {
		setGlobal("HISTORY", { data: [] });
	};
	const getIndexTopics = useCallback(async (page) => {
		setPage(page);
		let result = await getTopics(page, LIMIT);
		if (result.code === 200) {
			setTopics(result.data);
		}
	}, []);
	const submitTopic = async () => {
		const nodeObj = JSON.parse(global.CREATE_NODE);
		if (!global.CREATE_TITLE) {
			return alert("请输入标题");
		}
		if (!nodeObj || !global.CREATE_NODE) {
			return alert("请选择需要发布的节点");
		}
		setSubmitting(true);

		const gasValue = await web3.eth.getGasPrice();
		const start_nonce = await web3.eth.getTransactionCount(currentAccount);

		console.log("gasValue", gasValue, start_nonce);
		console.log("提交", nodeObj);
		const channel_id = "1";
		const message = currentAccount;
		const signature = "";
		const node_id = nodeObj.value;
		const title = global.CREATE_TITLE;
		const content = global.CREATE_CONTENT;

		console.log("create", channel_id, message, node_id, title, content);
		// uint256 transmitter_id, uint256 contributor_info, uint256 node_id, string calldata title, string calldata content

		let gasAmount = await social.methods.create(channel_id, message, signature, node_id, title, content).estimateGas({
			gasPrice: gasValue,
			from: currentAccount,
			nonce: start_nonce + 1,
		});
		// gasAmount = gasAmount > 100000 ? gasAmount * 10 : gasAmount;

		social.methods
			.create(channel_id, message, signature, node_id, title, content)
			.send({
				gasLimit: gasAmount * 10,
				gasPrice: gasValue,
				from: currentAccount,
				nonce: start_nonce + 1,
			})
			.on("transactionHash", function (transactionHash) {
				// 草稿
				const draftStorage = JSON.parse(global.DRAFT);
				var tempObj = draftStorage ? draftStorage.data : {};
				const draft = {
					topic_hash: transactionHash,
					block_number: "",
					block_hash: "",
					location: networkId,
					content: global.CREATE_CONTENT,
					event: "Create",
					author_address: currentAccount,
					author_address: currentAccount,
					transmitter_id: channel_id,
					node_id: nodeObj.value,
					timestamp: parseInt(new Date().getTime() / 1000),
					title: global.CREATE_TITLE,
				};
				if (tempObj[transactionHash]) {
					tempObj[transactionHash].Create = draft;
				} else {
					tempObj[transactionHash] = {
						Create: draft,
					};
				}
				setGlobal("DRAFT", { data: tempObj });

				setSubmitting(false);
				setGlobal("CREATE_TITLE", "");
				setGlobal("CREATE_NODE", "");
				setGlobal("CREATE_CONTENT", "");
				window.location.href = `/t/${transactionHash}`;
				return Promise.resolve();
			})
			.once("confirmation", function (confirmationNumber, receipt) {
				console.log("confirmation", confirmationNumber, receipt);
				// setReceipt(receipt);
				// success
			})
			.on("error", function (error, receipt) {
				setSubmitting(false);
			});
	};

	/*==================================================
	UseEffect
	==================================================*/
	useEffect(() => {
		setTheme(theme);
	}, [theme, setTheme]);

	useEffect(() => {
		document.title = `${CONFIG.WEBSITE}`;
		const historyTopic = JSON.parse(global.HISTORY);
		const historyAry = historyTopic ? historyTopic.data : [];

		setTopicsHis(
			historyAry.length ? (
				<ul>
					{historyAry.map((item) => {
						return (
							<li key={item.transaction_hash}>
								<Link to={`/t/${item.topic_hash}`}>{item.title}</Link>
							</li>
						);
					})}
				</ul>
			) : (
				<div className="null">暂无</div>
			)
		);
	}, [global]);

	useEffect(() => {
		(async () => {
			const topicsPro = getTopics(page, LIMIT);
			const topicsHot = getTopicsHot();
			const nodeNew = getNodesNew();
			const nodeHot = getNodesHot();
			const websiteInfo = getWebsiteInfo();
			const promiseAllResult = await Promise.map(
				[topicsPro, topicsHot, nodeNew, nodeHot, websiteInfo],
				function (thing) {
					return new Promise(function (resolve, reject) {
						resolve(thing);
					});
				},
				{
					concurrency: 5,
				}
			);
			setTopics(promiseAllResult[0].data);
			setTopicsHot(promiseAllResult[1].data);
			setNodeNew(promiseAllResult[2].data);
			setNodeHot(promiseAllResult[3].data);
			setWebsite(promiseAllResult[4].data);
			// end
		})();
	}, []);

	useEffect(() => {
		(async () => {
			if (currentAccount && web3) {
				const balance = await web3.eth.getBalance(currentAccount);
				setBalance(
					BigNumber(balance)
						.div(10 ** 18)
						.toFixed(2)
				);
			}
		})();
	}, [currentAccount, web3]);

	useEffect(() => {
		let targetNetWork = CONFIG.chains.find((element) => {
			return element.networkId === Number(networkId);
		});
		if (!targetNetWork) return;
		setNetworkSymbol(targetNetWork.nativeCurrency ? targetNetWork.nativeCurrency.symbol : "🤑");
	}, [networkId]);

	// edit
	// getnode
	useEffect(() => {
		(async () => {
			const nodeResult = await getNodes();
			if (nodeResult.code === 200) {
				const opts = [];
				nodeResult.data.forEach((item) => {
					opts.push({
						value: item.node_id,
						name: item.name,
						label: item.aliases ? `${item.name} (${item.aliases})` : item.name,
					});
				});
				setNodes(opts);
			}
		})();
	}, []);

	useEffect(() => {
		if (!cmInstance) return;
		cmInstance.doc.clearHistory();
	}, [cmInstance]);

	/*==================================================
	DOM
	==================================================*/
	return (
		<>
			<Header />
			<div className="core home">
				<div className="container">
					<div className="flex">
						<div className="home-main middle">
							<div className="nodes">
								<ul className="nodes-first">
									<li>加密货币</li>
									<li>交易所</li>
									<li>公链</li>
									<li className="active">Dapp</li>
									<li>工具</li>
									<li>Wiki</li>
									<li>城市</li>
									<li>工作</li>
									<li>活动</li>
									<li>全部</li>
								</ul>
								<ul className="nodes-sub">
									<li>DeFi</li>
									<li>Swap</li>
									<li>NFT</li>
									<li>SocialFi</li>
									<li>GameFi</li>
									<li>元宇宙</li>
									<li>跨链桥</li>
									<li>其他</li>
								</ul>
							</div>
							<ul className="topic-list">
								{topics.map((item) => {
									return (
										<li key={item.transaction_hash}>
											<div className="flex">
												<div className="reply-wrap">
													<div className="reply">{item.total_reply}</div>
												</div>
												<div className="topic">
													<Link to={`/t/${item.topic_hash}`}>
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
							{!topics.length && <div className="null">暂无信息</div>}

							<div className="pagination">
								<div className="flex justify">
									<button
										disabled={page === 0}
										onClick={() => {
											getIndexTopics(page - 1);
										}}>
										上一页
									</button>
									<button
										disabled={topics.length < LIMIT}
										onClick={() => {
											getIndexTopics(page + 1);
										}}>
										下一页
									</button>
								</div>
							</div>
							<div className=" create">
								<div className="create-wrap">
									<h2>发表新主题</h2>
									<div className="edit-wrap">
										<input
											type="text"
											placeholder="* 请输入主题标题，如果标题能够表达完整内容，则正文可以为空"
											value={global.CREATE_TITLE}
											onChange={(e) => {
												setGlobal("CREATE_TITLE", e.target.value);
											}}
										/>
										<div className="select-area">
											<div className="flex justify">
												<Select
													className="select-node"
													defaultValue={JSON.parse(global.CREATE_NODE)}
													onChange={(value) => {
														setGlobal("CREATE_NODE", value);
													}}
													options={nodes}
													placeholder="* 所属节点"
												/>
												<div>
													<a href="https://chainlist.org/zh" target="_blank" rel="noopener noreferrer">
														➕ <span className="p-none"> 添加</span>
													</a>
												</div>
											</div>
										</div>
										<SimpleMDE
											value={global.CREATE_CONTENT}
											onChange={(value) => {
												setGlobal("CREATE_CONTENT", value);
											}}
											// https://github.com/Ionaru/easy-markdown-editor#configuration
											getCodemirrorInstance={getCmInstanceCallback}
										/>
										<button className="submit" onClick={submitTopic} disabled={submitting}>
											📋 发表主题
										</button>
										<button className="submit" disabled="disabled">
											🌸 免手续费发表
										</button>
									</div>
								</div>
							</div>
						</div>
						<div className="home-sidebar right">
							{currentAccount ? (
								<div className="sidebar-item">
									<div className="personal-center">
										<div className="address-info">
											<div className="flex">
												{currentAccount && (
													<Jazzicon
														diameter={36}
														paperStyles={{
															borderRadius: "2px",
															verticalAlign: "middle",
														}}
														seed={jsNumberForAddress(currentAccount)}
													/>
												)}
												<div className="address-des">
													<strong className="address-name">
														<Link to={`/${currentAccount}`}>{currentAccount.slice(0, 8)}</Link>
													</strong>
													<p>
														余额 {balance} {networkSymbol.toUpperCase()}
													</p>
												</div>
											</div>
											{/* <div className="address-action">
                        <div className="flex justify">
                          <div className="item">节点收藏</div>
                          <div className="item">主题收藏</div>
                          <div className="item">最近阅读</div>
                        </div>
                      </div> */}
										</div>
									</div>
								</div>
							) : (
								<></>
							)}
							<div className="sidebar-item">
								<h2>今日热议</h2>
								{topicsHot.length ? (
									<ul>
										{topicsHot.map((item) => {
											return (
												<li key={item.topic_hash}>
													<Link to={`/t/${item.topic_hash}`}>{item.title}</Link>
												</li>
											);
										})}
									</ul>
								) : (
									<div className="null">暂无</div>
								)}
							</div>
							{global.HISTORY && (
								<div className="sidebar-item">
									<div className="flex justify">
										<h2>最近阅读</h2>
										<p className="clear" onClick={handlerClear}>
											清除
										</p>
									</div>
									{topicsHis}
								</div>
							)}
							<div className="sidebar-item ">
								<h2>最热节点</h2>
								<div className="nodes">
									{nodeHot.map((item) => {
										return (
											<Link to={`/n/${item.node_id}`} key={item.node_id}>
												{item.name}
											</Link>
										);
									})}
								</div>
							</div>
							<div className="sidebar-item ">
								<h2>新增节点</h2>
								<div className="nodes">
									{nodeNew.map((item) => {
										return (
											<Link to={`/n/${item.node_id}`} key={item.node_id}>
												{item.name}
											</Link>
										);
									})}
								</div>
							</div>
							<div className="sidebar-item ">
								<h2>本站数据</h2>
								<ul className="statistics">
									<li>
										会员 <strong>{website.address}</strong>
									</li>
									<li>
										主题 <strong>{website.topics}</strong>
									</li>
									<li>
										回复 <strong>{website.replys}</strong>
									</li>
								</ul>
							</div>
						</div>
					</div>
				</div>
			</div>
			<Footer />
			<Outlet />
		</>
	);
}
