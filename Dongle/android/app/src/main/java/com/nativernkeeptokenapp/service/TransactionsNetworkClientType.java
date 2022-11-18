package com.nativernkeeptokenapp.service;

import com.nativernkeeptokenapp.entity.NetworkInfo;
import com.nativernkeeptokenapp.entity.Transaction;
import com.nativernkeeptokenapp.entity.TransactionMeta;

import io.reactivex.Single;

public interface TransactionsNetworkClientType {
    Single<Transaction[]> storeNewTransactions(String walletAddress, NetworkInfo networkInfo, String tokenAddress, long lastBlock);
    Single<TransactionMeta[]> fetchMoreTransactions(String walletAddress, NetworkInfo network, long lastTxTime);
    Single<Integer> readTransfers(String currentAddress, NetworkInfo networkByChain, TokensService tokensService, boolean nftCheck);
    void checkRequiresAuxReset(String walletAddr);
}
