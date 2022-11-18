package com.nativernkeeptokenapp.web3.entity;

public class BlockChainInfo {
    private int chainId;
    private String rpcUrl;

    public int getChainId() {
        return chainId;
    }

    public void setChainId(int chainId) {
        this.chainId = chainId;
    }

    public String getRpcUrl() {
        return rpcUrl;
    }

    public void setRpcUrl(String rpcUrl) {
        this.rpcUrl = rpcUrl;
    }
}
