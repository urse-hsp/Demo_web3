package com.nativernkeeptokenapp.rn;

import io.realm.RealmObject;
import io.realm.annotations.PrimaryKey;

public class RNAddressBean {

    public RNAddressBean(String address, String addressName,String chainName) {
        this.address = address;
        this.addressName = addressName;
        this.chainName = chainName;
    }

    private String address;
    private String addressName;
    private String chainName;

    public String getChainName() {
        return chainName;
    }

    public void setChainName(String chainName) {
        this.chainName = chainName;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getAddressName() {
        return addressName;
    }

    public void setAddressName(String addressName) {
        this.addressName = addressName;
    }
}
