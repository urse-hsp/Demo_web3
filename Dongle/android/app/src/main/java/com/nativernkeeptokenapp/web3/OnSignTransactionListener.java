package com.nativernkeeptokenapp.web3;

import com.nativernkeeptokenapp.web3.entity.Web3Transaction;

public interface OnSignTransactionListener {
    void onSignTransaction(Web3Transaction transaction, String url);
}
