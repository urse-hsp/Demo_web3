import React, { useState, useEffect, useCallback } from "react";
import { Outlet, Link } from "react-router-dom";
import moment from "moment";
import * as Promise from "bluebird";

import CONFIG from "@/config";
import Header from "@/layout/header";
import Footer from "@/layout/footer";
import "./index.scss";
import { getNode, getTopicsByNode } from "@models/api";

import twitter from "@assets/social/twitter-color.svg";
import website from "@assets/social/website-color.svg";

const LIMIT = 10;
export default function Node() {
	/*==================================================
	Data
	==================================================*/
	const nodeIndex = window.location.pathname.slice(3);

	const [page, setPage] = useState(0);
	const [topics, setTopics] = useState([]);

	const [node, setNode] = useState({
		name: "",
		img_url: process.env.PUBLIC_URL + "/logo.png",
		description: "",
	});

	/*==================================================
	Function
	==================================================*/

	/*==================================================
	Handle
	==================================================*/
	const getIndexTopics = useCallback(async (page) => {
		setPage(page);
		let result = await getTopicsByNode(nodeIndex, page, LIMIT);
		if (result.code === 200) {
			setTopics(result.data);
		}
	}, []);
	/*==================================================
	UseEffect
	==================================================*/
	useEffect(() => {
		if (node) {
			document.title = `${node.aliases ? node.name + " " + node.aliases : node.name} - ${CONFIG.WEBSITE}`;
		}
	}, [node]);

	useEffect(() => {
		(async () => {
			// End
			const topicsPro = getTopicsByNode(nodeIndex);
			const nodePro = getNode(nodeIndex);
			const promiseAllResult = await Promise.map(
				[topicsPro, nodePro],
				function (thing) {
					return new Promise(function (resolve, reject) {
						resolve(thing);
					});
				},
				{
					concurrency: 5,
				}
			);
			if (promiseAllResult[0].code === 200) {
				setTopics(promiseAllResult[0].data);
			}
			if (promiseAllResult[1].code === 200 && promiseAllResult[1].data.length) {
				setNode(promiseAllResult[1].data[0]);
			}
		})();
	}, []);
	/*==================================================
	DOM
	==================================================*/
	return (
		<>
			<Header />
			<div className="core node">
				<div className="container">
					<div className="node-wrap">
						{node && (
							<div className="node-info">
								<div className="node-img">
									<img src={node.img_url ? node.img_url : process.env.PUBLIC_URL + "/logo.png"} alt="node-img" />
								</div>
								<div className="node-des">
									<div className="flex justify">
										<h1 className="node-name">{node.name || "未知节点"}</h1>
										<p className="node-topics">合计 {node.topics} 个主题</p>
									</div>
									<p className="node-media">
										{node.website && (
											<span>
												<img src={website} className="icon" alt="website" />
												<a href={`${node.website}`} target="_blank" rel="noopener noreferrer">
													{node.website}
												</a>
											</span>
										)}
										{node.twitter && (
											<span>
												<img src={twitter} className="icon" alt="twitter" />
												<a href={`https://twitter.com/${node.twitter}`} target="_blank" rel="noopener noreferrer">
													{node.twitter}
												</a>
											</span>
										)}
									</p>
									<p className="node-description">
										{node.description ? (
											node.description
										) : (
											<span>
												暂无描述信息，可以在{" "}
												<a href={`https://github.com/anbang`} target="_blank" rel="noopener noreferrer">
													Github
												</a>{" "}
												中提交它的信息
											</span>
										)}
									</p>
								</div>
							</div>
						)}
						<ul className="topic-list">
							{topics.map((item) => {
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
														OP:
														<Link to={`/${item.author_address}`}>{item.author_address.slice(0, 8)}</Link>
													</span>
													<span>
														发布于:
														<i>{moment(item.timestamp * 1000).format("MM-DD HH:mm")}</i>
													</span>
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
					</div>
				</div>
			</div>
			<Footer />
			<Outlet />
		</>
	);
}
