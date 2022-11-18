package com.nativernkeeptokenapp.entity;

import com.nativernkeeptokenapp.entity.tokens.Token;

public interface BuyCryptoInterface {
    void handleBuyFunction(Token token);
    void handleGeneratePaymentRequest(Token token);
}
