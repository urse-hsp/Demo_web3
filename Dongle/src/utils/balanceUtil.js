const { ethers } = require("ethers");
const erc20abi = require("./erc20.json")

import storage from '../utils/storageUtil' 

// 0xeefba1e63905ef1d7acba5a8513c70307c1ce441

// 单独获取资产
const ktoBalance = async (tokenAddress, userAddress) => {

    const blockChain = await storage.get(global.KTORpc)
    const provider = blockChain.value.rpcUrl

    const rpcprovider = new ethers.providers.JsonRpcProvider(provider)

    for (const chain of tokenAddress) {
        if (chain.contract !== '0xE388eb6aaBA54412c979564d6aC0537A8AB37f6D') {
            const contract = new ethers.Contract(chain.contract, erc20abi, rpcprovider);
            let balance = await contract.balanceOf(userAddress)
            chain.num = parseFloat(parseFloat(ethers.utils.formatEther(balance)).toFixed(6)).toString()
        } else {
            //主链
            const balance = await rpcprovider.getBalance(userAddress);
            let bignumber = parseFloat(parseFloat(ethers.utils.formatEther(balance)).toFixed(6)).toString()
            chain.num = bignumber;
        }
    }

    return tokenAddress;
}

const ethBalance = async (tokenAddress, userAddress) => {

    const blockChain = await storage.get(global.ETHRpc)
    const provider = blockChain.value.rpcUrl
    
    const rpcprovider = new ethers.providers.JsonRpcProvider(provider)

    for (const chain of tokenAddress) {
        if (chain.contract !== '0xeefba1e63905ef1d7acba5a8513c70307c1ce441') {
            const contract = new ethers.Contract(chain.contract, erc20abi, rpcprovider);
            let balance = await contract.balanceOf(userAddress)
            chain.num = parseFloat(parseFloat(ethers.utils.formatEther(balance)).toFixed(6)).toString()
        } else {
            //主链
            const balance = await rpcprovider.getBalance(userAddress);

            let bignumber = parseFloat(parseFloat(ethers.utils.formatEther(balance)).toFixed(6)).toString();
            chain.num = bignumber;
        }
    }
    return tokenAddress;
}

const bscBalance = async (tokenAddress, userAddress) => {

    const blockChain = await storage.get(global.BSCRpc)
    console.debug(blockChain)
    const provider = blockChain.value.rpcUrl
    
    const rpcprovider = new ethers.providers.JsonRpcProvider(provider)

    for (const chain of tokenAddress) {
        if (chain.contract !== '0xB8c77482e45F1F44dE1745F52C74426C631bDD52') {
            const contract = new ethers.Contract(chain.contract, erc20abi, rpcprovider);
            let balance = await contract.balanceOf(userAddress)
            chain.num = parseFloat(parseFloat(ethers.utils.formatEther(balance)).toFixed(6)).toString()
        } else {
            //主链
            const balance = await rpcprovider.getBalance(userAddress);

            let bignumber = parseFloat(parseFloat(ethers.utils.formatEther(balance)).toFixed(6)).toString();
            chain.num = bignumber;
        }
    }
    return tokenAddress;
}

export default {
    ktoBalance, ethBalance,bscBalance
}




