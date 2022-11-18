package com.nativernkeeptokenapp.repository;

import com.nativernkeeptokenapp.entity.CurrencyItem;

import java.util.ArrayList;

public interface CurrencyRepositoryType {
    String getDefaultCurrency();

    void setDefaultCurrency(String currency);

    ArrayList<CurrencyItem> getCurrencyList();
}
