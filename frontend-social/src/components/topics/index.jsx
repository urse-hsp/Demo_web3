import React, { useState, useEffect, useCallback } from "react";
import { Outlet, Link } from "react-router-dom";
import moment from "moment";
import * as Promise from "bluebird";

import CONFIG from "@/config";
import Header from "@/layout/header";
import Footer from "@/layout/footer";
import "./index.scss";
import { getTopicsByAddress } from "@models/api";

const LIMIT = 10;
export default function Node() {
	/*==================================================
	Data
	==================================================*/
	const address = window.location.pathname.slice(8);
	const [page, setPage] = useState(0);
	const [topics, setTopics] = useState([]);

	/*==================================================
	Function
	==================================================*/

	/*==================================================
	Handle
	==================================================*/
	const getIndexTopics = useCallback(async (page) => {
		setPage(page);
		let result = await getTopicsByAddress(address, page, LIMIT);
		if (result.code === 200) {
			setTopics(result.data);
		}
	}, []);
	/*==================================================
	UseEffect
	==================================================*/
	useEffect(() => {
		document.title = `地址 ${address} 下的所有主题 - ${CONFIG.WEBSITE}`;
	}, []);

	useEffect(() => {
		(async () => {
			// End
			const topicsPro = getTopicsByAddress(address);
			const promiseAllResult = await Promise.map(
				[topicsPro],
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
					<div className="wrap">
						<div className="node-top">
							<p>地址：{address} 下所有主题</p>
						</div>
						<ul className="topic-list">
							{topics.map((item) => {
								return (
									<li key={item.topic_hash}>
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
														OP:
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
					</div>
				</div>
			</div>
			<Footer />
			<Outlet />
		</>
	);
}
