package com.nativernkeeptokenapp.service;

import android.content.Context;
import android.os.Bundle;
import android.text.TextUtils;

import com.nativernkeeptokenapp.BuildConfig;
import com.nativernkeeptokenapp.C;
import com.nativernkeeptokenapp.entity.AnalyticsProperties;
import com.mixpanel.android.mpmetrics.MixpanelAPI;

import org.json.JSONException;
import org.json.JSONObject;


public class AnalyticsService<T> implements AnalyticsServiceType<T> {

    private final MixpanelAPI mixpanelAPI;

    public static native String getAnalyticsKey();

    static {
        System.loadLibrary("keys");
    }

    public AnalyticsService(Context context)
    {
        mixpanelAPI = MixpanelAPI.getInstance(context, getAnalyticsKey());
    }

    @Override
    public void track(String eventName)
    {
        //firebaseAnalytics.logEvent(FirebaseAnalytics.Event.SELECT_CONTENT, eventName);
        mixpanelAPI.track(eventName);
    }

    @Override
    public void track(String eventName, T event)
    {
        AnalyticsProperties analyticsProperties = (AnalyticsProperties) event;

        trackFirebase(analyticsProperties, eventName);
        trackMixpanel(analyticsProperties, eventName);
    }

    private void trackFirebase(AnalyticsProperties analyticsProperties, String eventName)
    {
        Bundle props = new Bundle();
        if(!TextUtils.isEmpty(analyticsProperties.getWalletType()))
        {
            props.putString(C.AN_WALLET_TYPE, analyticsProperties.getWalletType());
        }

        if(!TextUtils.isEmpty(analyticsProperties.getData()))
        {
            props.putString(C.AN_USE_GAS, analyticsProperties.getData());
        }

        props.putString(C.APP_NAME, BuildConfig.APPLICATION_ID);

    }

    private void trackMixpanel(AnalyticsProperties analyticsProperties, String eventName)
    {
        try
        {
            JSONObject props = new JSONObject();

            if (!TextUtils.isEmpty(analyticsProperties.getWalletType()))
            {
                props.put(C.AN_WALLET_TYPE, analyticsProperties.getWalletType());
            }

            if (!TextUtils.isEmpty(analyticsProperties.getData()))
            {
                props.put(C.AN_USE_GAS, analyticsProperties.getData());
            }

            mixpanelAPI.track(eventName, props);
        }
        catch(JSONException e)
        {
            //Something went wrong
        }
    }



    @Override
    public void flush()
    {
        //Nothing like flush in firebase
        mixpanelAPI.flush();
    }

}