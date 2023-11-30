import React, { useState, useEffect, useCallback } from "react";
import { Outlet, Link } from "react-router-dom";
import moment from "moment";
import * as Promise from "bluebird";

import CONFIG from "@/config";
import Header from "@/layout/header";
import Footer from "@/layout/footer";
import "./index.scss";
import { getReplysByAddress } from "@models/api";

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
		let result = await getReplysByAddress(address, page, LIMIT);
		if (result.code === 200) {
			setTopics(result.data);
		}
	}, []);
	/*==================================================
	UseEffect
	==================================================*/
	useEffect(() => {
		document.title = `地址 ${address} 下的所有回复 - ${CONFIG.WEBSITE}`;
	}, []);

	useEffect(() => {
		(async () => {
			// End
			const topicsPro = getReplysByAddress(address);
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
							<p>地址：{address} 下所有回复</p>
						</div>
						<ul className="topic-list">
							{topics.map((item) => {
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
