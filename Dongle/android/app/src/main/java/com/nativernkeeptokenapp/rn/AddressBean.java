package com.nativernkeeptokenapp.rn;

import io.realm.RealmObject;
import io.realm.annotations.PrimaryKey;

public class AddressBean extends RealmObject {

    @PrimaryKey
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
