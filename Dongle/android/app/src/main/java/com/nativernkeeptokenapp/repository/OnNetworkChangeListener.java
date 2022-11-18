package com.nativernkeeptokenapp.repository;

import com.nativernkeeptokenapp.entity.NetworkInfo;

public interface OnNetworkChangeListener {
	void onNetworkChanged(NetworkInfo networkInfo);
}
