package com.nativernkeeptokenapp.entity;
import com.nativernkeeptokenapp.entity.cryptokeys.KeyEncodingType;
import com.nativernkeeptokenapp.service.KeyService;

public interface ImportWalletCallback
{
    void walletValidated(String address, KeyEncodingType type, KeyService.AuthenticationLevel level);
}
