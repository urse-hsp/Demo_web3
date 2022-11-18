package com.nativernkeeptokenapp.web3;

import com.nativernkeeptokenapp.web3.entity.WalletAddEthereumChainObject;

public interface OnWalletAddEthereumChainObjectListener
{
    void onWalletAddEthereumChainObject(long callbackId, WalletAddEthereumChainObject chainObject);
}
