/* eslint-disable no-restricted-properties */
import CONFIG from "@/config";

async function fetchUrl(path) {
	const response = await fetch(`${CONFIG.API}${path}`, {
		method: "GET",
	});
	return response.json();
}

// - API: Address
//   - getAddressInfo(address)
async function getAddressInfo(address) {
	return await fetchUrl(`/address?address=${address}`);
}

// - API: Nodes
//   - `/node/` :getNode(node)
//   - `/nodes/` :getNodes()
//   - `/nodes/hot` :getNodesHot()
//   - `/nodes/new` :getNodesNew()

async function getNode(index) {
	return await fetchUrl(`/node?node_id=${index}`);
}
async function getNodes() {
	return await fetchUrl(`/nodes`);
}
async function getNodesHot() {
	return await fetchUrl(`/nodes/hot`);
}
async function getNodesNew() {
	return await fetchUrl(`/nodes/new`);
}

// - API: Topics
async function getTopic(hash) {
	return await fetchUrl(`/topic?topic_hash=${hash}`);
}
async function getTopics(page = 0, limit = 10) {
	return await fetchUrl(`/topics?page=${page}&limit=${limit}`);
}
async function getTopicsByNode(node, page = 0, limit = 10) {
	return await fetchUrl(`/topics?node_id=${node}&page=${page}&limit=${limit}`);
}
async function getTopicsByAddress(ads, page = 0, limit = 10) {
	return await fetchUrl(`/topics?address=${ads}&page=${page}&limit=${limit}`);
}
async function getTopicsHot() {
	return await fetchUrl(`/topics/hot`);
}

// - API: Appends
async function getTopicAppends(hash) {
	return await fetchUrl(`/appends?topic_hash=${hash}`);
}

// - API: Replys
async function getReplysByAddress(ads, page = 0, limit = 10) {
	return await fetchUrl(`/replys?address=${ads}&page=${page}&limit=${limit}`);
}
async function getReplysByTopic(hash) {
	return await fetchUrl(`/replys?topic_hash=${hash}`);
}
async function getWebsiteInfo() {
	return await fetchUrl(`/status`);
}

// followings | followers
async function getFollowings(address) {
	return await fetchUrl(`/followings?address=${address}`);
}
async function getFollowers(address) {
	return await fetchUrl(`/followers?address=${address}`);
}

// 获取主题的Append

export {
	getAddressInfo,
	// node
	getNode,
	getNodes,
	getNodesHot,
	getNodesNew,
	// topic
	getTopic,
	getTopics,
	getTopicsByNode,
	getTopicsByAddress,
	getTopicsHot,
	// append
	getTopicAppends,
	// replys
	getReplysByAddress,
	getReplysByTopic,
	// web
	getWebsiteInfo,
	getFollowings,
	getFollowers,
};
