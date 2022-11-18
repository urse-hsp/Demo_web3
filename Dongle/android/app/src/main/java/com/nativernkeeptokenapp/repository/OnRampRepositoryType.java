package com.nativernkeeptokenapp.repository;

import com.nativernkeeptokenapp.entity.OnRampContract;
import com.nativernkeeptokenapp.entity.tokens.Token;

public interface OnRampRepositoryType {
    String getUri(String address, Token token);

    OnRampContract getContract(Token token);
}
