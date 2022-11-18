package com.nativernkeeptokenapp.rn;

import io.realm.RealmObject;
import io.realm.annotations.PrimaryKey;

public class ChainBean extends RealmObject {

    @PrimaryKey
    private String contract;
    private String name;
    private String num;
    private String decimal;

    public String getDecimal() {
        return decimal;
    }

    public void setDecimal(String decimal) {
        this.decimal = decimal;
    }

    public String getNum() {
        return num;
    }

    public void setNum(String num) {
        this.num = num;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getContract() {
        return contract;
    }

    public void setContract(String contract) {
        this.contract = contract;
    }
}
