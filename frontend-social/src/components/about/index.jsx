import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
// import { Link } from "react-router-dom";
// import moment from "moment";
import CONFIG from "@/config";
import Web3 from "@models/web3";

import Header from "@/layout/header";
import Footer from "@/layout/footer";
// import Storage from "@models/storage";
import Utils from "@models/utils";
import "./index.scss";
import social from "@assets/social.png";

export default function Us({ theme }) {
	/*==================================================
	Data
	==================================================*/
	const { setTheme } = Utils.useContainer();
	const { web3 } = Web3.useContainer();

	// 0x 75726c 20 68747470733a2f2f616e62616e672e626c6f672f
	//           14 68747470733a2f2f616e62616e672e626c6f672f
	const sources = "url https://abc.com/";
	const data =
		"0x75726c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001468747470733a2f2f616e62616e672e626c6f672f000000000000000000000000";
	console.log(`加密:${web3 && web3.utils.asciiToHex(sources)}`);
	console.log(`解析:${web3 && web3.utils.hexToAscii(data)}`);

	const name2 = "name 安邦斯密达";
	console.log(`=> 加密2:${web3 && web3.utils.utf8ToHex(name2)}`);
	console.log(`<= 解析2:${web3 && web3.utils.hexToUtf8(web3.utils.utf8ToHex(name2))}`);

	/*==================================================
	Function
	==================================================*/

	/*==================================================
	Handle
	==================================================*/

	/*==================================================
	UseEffect
	==================================================*/
	useEffect(() => {
		setTheme(theme);
	}, [theme, setTheme]);

	useEffect(() => {
		document.title = `${CONFIG.WEBSITE} > 关于 ${CONFIG.WEBSITE}`;
	});
	/*==================================================
	DOM
	==================================================*/
	return (
		<>
			<Header />
			<div className="core about">
				<div className="container">
					<div className="center">
						<h2>整体架构图</h2>
						<img src={social} className="social" alt="social" />
					</div>

					<div className="center">
						<h2>Channel 的表现形式可以任意</h2>
						<p>当前频道，表现形式是一个论坛性质的网站。但是该协议支持任何文字展示用途的交互方式。如下是一件简单的罗列</p>
						<ul>
							<li>
								<strong>Twitter</strong>:{" "}
								<a href="https://twitter.com/IAPonomarenko/status/1609305496007372800" target="_blank" rel="noopener noreferrer">
									推文预览
								</a>
							</li>
							<li>
								<strong>贴吧/论坛/社区</strong>: 百度贴吧/知乎问题/XXX
							</li>
							<li>
								<strong>文章博客</strong>:{" "}
								<a href="https://zhuanlan.zhihu.com/p/78165933" target="_blank" rel="noopener noreferrer">
									知乎专栏
								</a>
							</li>
							<li>
								<strong>新闻网站</strong>: XXXX
							</li>
							<li>
								<strong>公司宣发站点</strong>: XXXX
							</li>
							<li>
								<strong>XXXX</strong>: XXXX
							</li>
						</ul>
					</div>
					<div className="center">
						{/* ---- */}
						<h2>"协议层"的意义</h2>
						<p>
							自从有了文明以来，人类一直在寻找可以永久记录信息的媒介，比如商朝王室将文字记录在龟甲或兽骨上；之后出现了将文字记录在竹片，石碑，羊皮，纸张上的情况。
							现在常用的方式是将文字记录在个人电脑，移动硬盘，互联网应用，但是这些方式对于长久记录数据来说非常不友好。
						</p>
						<p>
							区块链的出现非常伟大，它或许可以永久的记录我们的作品，无论是文字，音乐，或是其它。在信息记录方面，相比中心化产品，区块链有着天然的优势。 当我们的作品记录在中心化产品时，
							它们可能因为电脑重装系统，移动硬盘丢失/损坏，互联网内容审核，自己误删除，或者账户不可用，产品停止维护等情况导致作品被永久丢失，我们甚至无法恢复这些数据，导致永远的丢失它们。
						</p>
						<p>
							区块链是一个蓬勃发展的行业，这个行业拥有各式各样的公链，不同公链之间的数据天生是被隔离的；默认情况下，我们无法在不同的公链之间进行信息交流。
							Social的初衷是做一个基于区块链的跨链交流聚合器！通过 Social X
							你可以选择任何一条公链永久记录你的作品；同理，其他人也可以使用他们喜欢的公链针对你的信息进行点评和互动。虽然我们处在不同的公链上，但这并不会影响我们愉快的交流。
						</p>
						<p>因为区块链记录任何信息都是需要付费的，所以 Social 的合约会设计的尽可能简单和省钱。追求核心与实用，尽量不做那些花里胡哨的功能。</p>
						<h3>合约开源</h3>
						<p>合约代码开源在Github，也会在所在公链的区块链浏览器上进行验证和代码开源。任何人都可以通过开源代码轻松获取到。</p>
						<p>
							使用区块链记录数据的唯一风险：
							<strong>你发布作品所使用的公链停止维护了</strong>！
						</p>

						{/* ---- */}
						<br />
						<br />
						<br />
						<br />
						<br />
						<br />
						<h2>"频道"的说明</h2>
						<p>任何人都可以使用区块链永久记录任何作品，但是应用会有自己的业务方向。有权拒绝不符合自己应用约定的内容</p>
						<ul>
							<li>拒绝政治，色情，毒品相关内容，这些内容会被禁止展示。</li>
							<li>
								辱骂他人的言论会被禁止展示。
								<ul>
									<li>区块链的每次记录都是需要付费的，请珍惜自己的钱，也尊重他人的阅读时间。请尽量发一些有意义的内容。</li>
								</ul>
							</li>
						</ul>
						<p>提示：区块链上的数据是不可撤销的，请谨慎发布你的作品。你的作品一旦发布，将无法删除。</p>
					</div>
					<div className="center">
						<h2>TODO List</h2>
						<ul>
							<li>点击数</li>
							<li>收藏帖子 | 中心化使用</li>
							<li>
								消息推送功能
								<ul>
									<li>收到回复</li>
									<li>主题被收藏</li>
									<li>关注的人动态（有消息推送给粉丝。或者发邮件给粉丝）</li>
								</ul>
							</li>
							<li>主题的管理网站(不和谐帖子的隐藏，需要隐藏)</li>
							<li>代发交易</li>
							<li>
								采摘功能
								<ul>
									<li>收藏主题</li>
									<li>转发主题</li>
									<li>收到到指定分类</li>
								</ul>
							</li>
							<li>
								关注是支持描述的，所以可以有很多玩法
								<ul>
									<li>关注时可以设置分组（关注时候，列到某个组内）</li>
									<li>关注时可以设置备注信息（关注的时候，设置备注名，否则长时间就会忘记它是谁了）</li>
									<li>后续我会做一个规范，开放到Github，用来支持更多功能，目前暂时:分组+备注</li>
								</ul>
							</li>
						</ul>
					</div>
					<div className="center">
						<h2>正式版开发:需要的技术人员名单</h2>
						<ul>
							<li>
								<strong>产品</strong>: 康康
							</li>
							<li>
								<strong>设计</strong>: 江珊
							</li>
							<li>
								<strong>前端</strong>: 凯莉
							</li>
							<li>
								<strong>后端</strong>: 建峰
							</li>
							<li>
								<strong>合约</strong>: 安邦
							</li>
							<li>
								<strong>测试</strong>: 浩文
							</li>
						</ul>
						<p>当前演示版因为时间紧急，所以只实现了核心功能和整体的技术架构。如果计划上线正式版，需要名单中人员一起参与项目开发。</p>
					</div>
				</div>
			</div>
			<Footer />
			<Outlet />
		</>
	);
}
