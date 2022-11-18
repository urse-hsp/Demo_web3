// 查询合约列表
export function contractQueryApi(params) {
	return https.post('website/getTokenCode', params)
}

//查询kto链交易列表
export function getKTOTransfer(params) {
	return https.post('website/queryTxByAddr', params)
}
  
//获取bsc交易列表
export function getBSCTranscations(params) {
	return https.post('BSC-Transactions', params)
}

//获取BSC合约列表
export function getTokenSymbolList(params) {
	return https.post('website/getTokenSymbol', params)
}

//获取更新
export function getVersion(params) {
	return https.post('website/getDongleVersion', params)
}

//获取kto代币
export function getSymbolBalances(params) {
	return https.post('website/getSymbolBalances', params)
}

//获取dapp
export function getDappList(params) {
	return https.post('/website/getInformation', params)
}

//测试api
export function getTest(params) {
	return https.get('website/testApi', params)
}
