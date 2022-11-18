package com.nativernkeeptokenapp.service;

import com.nativernkeeptokenapp.entity.ServiceErrorException;

public interface AnalyticsServiceType<T> {

    void track(String eventName);

    void track(String eventName, T event);

    void flush();


}