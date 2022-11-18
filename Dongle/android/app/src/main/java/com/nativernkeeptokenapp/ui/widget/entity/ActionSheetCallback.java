package com.nativernkeeptokenapp.ui.widget.entity;

import com.nativernkeeptokenapp.entity.SignAuthenticationCallback;
import com.nativernkeeptokenapp.entity.tokens.Token;
import com.nativernkeeptokenapp.web3.entity.Web3Transaction;

/**
 * Created by JB on 27/11/2020.
 */
public interface ActionSheetCallback
{
    void getAuthorisation(SignAuthenticationCallback callback);
    void sendTransaction(Web3Transaction tx);
    void dismissed(String txHash, long callbackId, boolean actionCompleted);
    void notifyConfirm(String mode);
    default void signTransaction(Web3Transaction tx) { } // only WalletConnect uses this so far

    default void buttonClick(long callbackId, Token baseToken) { }; //for message only actionsheet
}
