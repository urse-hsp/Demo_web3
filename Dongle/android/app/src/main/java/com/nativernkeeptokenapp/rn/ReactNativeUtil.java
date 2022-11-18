package com.nativernkeeptokenapp.rn;

import android.Manifest;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.net.Uri;
import android.net.wifi.WifiInfo;
import android.net.wifi.WifiManager;
import android.os.Build;
import android.telephony.TelephonyManager;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.core.app.ActivityCompat;
import androidx.core.content.FileProvider;

import com.facebook.drawee.backends.pipeline.Fresco;
import com.facebook.imagepipeline.core.ImagePipeline;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.reflect.TypeToken;
import com.nativernkeeptokenapp.BuildConfig;
import com.nativernkeeptokenapp.CommonWebActivity;
import com.nativernkeeptokenapp.service.RealmManager;

import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.File;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.InetAddress;
import java.net.NetworkInterface;
import java.net.SocketException;
import java.net.URL;
import java.util.ArrayList;
import java.util.Enumeration;
import java.util.List;

import io.realm.Realm;
import io.realm.RealmList;
import io.realm.RealmQuery;
import io.realm.RealmResults;

public class ReactNativeUtil extends ReactContextBaseJavaModule {


    private static ReactContext myContext;

    public ReactNativeUtil(@Nullable ReactApplicationContext reactContext) {
        super(reactContext);
        this.myContext = reactContext;
    }

    @NonNull
    @Override
    public String getName() {
        return "ReactNativeUtils";
    }

    private static String[] platforms = {
            "http://pv.sohu.com/cityjson",
            "http://pv.sohu.com/cityjson?ie=utf-8",
            "http://ip.chinaz.com/getip.aspx"
    };

    public static String getOutNetIP(Context context, int index) {
        if (index < platforms.length) {
            BufferedReader buff = null;
            HttpURLConnection urlConnection = null;
            try {
                URL url = new URL(platforms[index]);
                urlConnection = (HttpURLConnection) url.openConnection();
                urlConnection.setRequestMethod("GET");
                urlConnection.setReadTimeout(5000);//读取超时
                urlConnection.setConnectTimeout(5000);//连接超时
                urlConnection.setDoInput(true);
                urlConnection.setUseCaches(false);

                int responseCode = urlConnection.getResponseCode();
                if (responseCode == HttpURLConnection.HTTP_OK) {//找到服务器的情况下,可能还会找到别的网站返回html格式的数据
                    InputStream is = urlConnection.getInputStream();
                    buff = new BufferedReader(new InputStreamReader(is, "UTF-8"));//注意编码，会出现乱码
                    StringBuilder builder = new StringBuilder();
                    String line = null;
                    while ((line = buff.readLine()) != null) {
                        builder.append(line);
                    }

                    buff.close();//内部会关闭 InputStream
                    urlConnection.disconnect();

                    Log.e("xiaoman", builder.toString());
                    if (index == 0 || index == 1) {
                        //截取字符串
                        int satrtIndex = builder.indexOf("{");//包含[
                        int endIndex = builder.indexOf("}");//包含]
                        String json = builder.substring(satrtIndex, endIndex + 1);//包含[satrtIndex,endIndex)
                        JSONObject jo = new JSONObject(json);
                        String ip = jo.getString("cip");

                        return ip;
                    } else if (index == 2) {
                        JSONObject jo = new JSONObject(builder.toString());
                        return jo.getString("ip");
                    }
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        } else {
            return getInNetIp(context);
        }
        return getOutNetIP(context, ++index);
    }

    public static String getInNetIp(Context context) {
        //获取wifi服务
        WifiManager wifiManager = (WifiManager) context.getSystemService(Context.WIFI_SERVICE);
        //判断wifi是否开启
        if (!wifiManager.isWifiEnabled()) {
            wifiManager.setWifiEnabled(true);
        }

        WifiInfo wifiInfo = wifiManager.getConnectionInfo();
        int ipAddress = wifiInfo.getIpAddress();
        String ip = intToIp(ipAddress);

        return ip;
    }

    //这段是转换成点分式IP的码
    private static String intToIp(int ip) {
        return (ip & 0xFF) + "." + ((ip >> 8) & 0xFF) + "." + ((ip >> 16) & 0xFF) + "." + (ip >> 24 & 0xFF);
    }

    // 获取IP
    @ReactMethod
    public void getIP(Callback callback) {
        String ip = getOutNetIP(myContext, 0);

        callback.invoke(ip);
    }


    // 获取应用包名
    @ReactMethod
    public void getPackageName(Callback callback) {
        String name = getReactApplicationContext().getPackageName();
        callback.invoke(name);
    }

    /*
       清除缓存
    */
    @ReactMethod
    public void clearImgCache(Callback success, Callback error) {
        try {
            ImagePipeline imagePipeline = Fresco.getImagePipeline();
            imagePipeline.clearMemoryCaches();
            imagePipeline.clearDiskCaches();

            // combines above two lines
            imagePipeline.clearCaches();
            success.invoke("删除成功");
        } catch (Exception e) {
            error.invoke("删除失败");
        }
    }

    /*
      查看缓存区大小
   */
    @ReactMethod
    public void getImgCache(Callback success, Callback error) {
        try {

            //   Fresco.getImagePipelineFactory().getMainFileCache().trimToMinimum();
            Fresco.getImagePipelineFactory().getMainFileCache().trimToMinimum();
            long size = Fresco.getImagePipelineFactory().getMainFileCache().getSize();//b

            success.invoke(size + "");
        } catch (Exception e) {
            e.printStackTrace();
            error.invoke("获取失败");
        }
    }

    //打开定位Activity页面
    @ReactMethod
    public void startWebViewActivity(String walletInfo, String url, String blockChain) {
        Intent intent = new Intent(myContext, CommonWebActivity.class);
        intent.putExtra("url", url);
        intent.putExtra("walletInfo", walletInfo);
        intent.putExtra("blockChain", blockChain);
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_EXCLUDE_FROM_RECENTS);
        myContext.startActivity(intent);
    }

    //更新图库
    @ReactMethod
    public void upDataImage(String path) {
        myContext.sendBroadcast(new Intent(Intent.ACTION_MEDIA_SCANNER_SCAN_FILE, Uri.parse("file://" + path)));
    }


    @ReactMethod
    public void installApp(final String path, Callback successCallback) {
        try {
            Intent intent = new Intent(Intent.ACTION_VIEW);

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
                Uri apkUri = FileProvider.getUriForFile(myContext, BuildConfig.APPLICATION_ID + ".fileProvider", new File(path));
                intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
                intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                intent.setDataAndType(apkUri, "application/vnd.android.package-archive");
            } else {
                intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                Uri uri = Uri.fromFile(new File(path));
                intent.setDataAndType(uri, "application/vnd.android.package-archive");
            }
            myContext.startActivity(intent);

            successCallback.invoke(0);//成功
        } catch (Exception e) {
            successCallback.invoke(1);//失败
        }
    }

    public static final String WALLET_DB = "wallet_data-db.realm";
    public static final String KTOADDRESS_DB = "kto_address_data-db.realm";
    public static final String ETHADDRESS_DB = "eth_address_data-db.realm";

    //更新钱包
    @ReactMethod
    public void replaceRealm(String key, String json) {
        final MyWalletInfo walletInfo = new Gson().fromJson(json, new TypeToken<MyWalletInfo>() {
        }.getType());

        if (!key.equals(walletInfo.getKey())) {
            //失败回调
            WritableMap event = Arguments.createMap();
            //传递的参数
            event.putBoolean("mapBean", false);
            sendEventToRn("replace", event);
            return;
        }

        Realm realmInstance = new RealmManager().getRealmInstance(WALLET_DB);
        realmInstance.executeTransactionAsync(new Realm.Transaction() {
            @Override
            public void execute(Realm realm) {
                realm.copyToRealmOrUpdate(walletInfo);
            }
        }, new Realm.Transaction.OnSuccess() {
            @Override
            public void onSuccess() {
                //成功回调
                WritableMap event = Arguments.createMap();
                //传递的参数
                event.putBoolean("mapBean", true);
                sendEventToRn("replace", event);
            }
        }, new Realm.Transaction.OnError() {
            @Override
            public void onError(Throwable error) {
                //失败回调
                WritableMap event = Arguments.createMap();
                //传递的参数
                event.putBoolean("mapBean", false);
                sendEventToRn("replace", event);
            }
        });
    }

    //储存钱包地址数据库
    @ReactMethod
    public void putRealm(String json) {

        final MyWalletInfo walletInfo = new Gson().fromJson(json, new TypeToken<MyWalletInfo>() {
        }.getType());

        if (!walletInfo.getChainName().equalsIgnoreCase("all")) {
            walletInfo.setKey(walletInfo.getChainName() + walletInfo.getAddress());
        }

        MyWalletInfo realmWalletInfo = walletInfo;
        MyWalletInfo realmWalletInfo2 = walletInfo;
        MyWalletInfo realmWalletInfo3 = walletInfo;

        Realm realmInstance = new RealmManager().getRealmInstance(WALLET_DB);
        realmInstance.executeTransactionAsync(new Realm.Transaction() {
            @Override
            public void execute(Realm realm) {
                if (realmWalletInfo.getChainName().equalsIgnoreCase("all")) {

                    realmWalletInfo.setChainName("KTO");
                    realmWalletInfo.setKey("KTO" + realmWalletInfo.getAddress());
                    ChainBean chainBean1 = new ChainBean();
                    chainBean1.setContract("0xE388eb6aaBA54412c979564d6aC0537A8AB37f6D");
                    chainBean1.setName("KTO");
                    chainBean1.setNum("0");
                    chainBean1.setDecimal("11");
                    RealmList<ChainBean> list1 = new RealmList<>();
                    list1.add(chainBean1);
                    realmWalletInfo.setChainList(list1);
                    realm.copyToRealmOrUpdate(realmWalletInfo);

                    realmWalletInfo2.setChainName("ETH");
                    realmWalletInfo2.setKey("ETH" + realmWalletInfo2.getAddress());
                    ChainBean chainBean2 = new ChainBean();
                    chainBean2.setContract("0xeefba1e63905ef1d7acba5a8513c70307c1ce441");
                    chainBean2.setName("ETH");
                    chainBean2.setNum("0");
                    chainBean2.setDecimal("18");
                    RealmList<ChainBean> list2 = new RealmList<>();
                    list2.add(chainBean2);
                    realmWalletInfo2.setChainList(list2);
                    realm.copyToRealmOrUpdate(realmWalletInfo2);

                    realmWalletInfo3.setChainName("BSC");
                    realmWalletInfo3.setKey("BSC" + realmWalletInfo3.getAddress());
                    ChainBean chainBean3 = new ChainBean();
                    chainBean3.setContract("0xB8c77482e45F1F44dE1745F52C74426C631bDD52");
                    chainBean3.setName("BNB");
                    chainBean3.setNum("0");
                    chainBean3.setDecimal("18");
                    RealmList<ChainBean> list3 = new RealmList<>();
                    list3.add(chainBean3);
                    realmWalletInfo3.setChainList(list3);
                    realm.copyToRealmOrUpdate(realmWalletInfo3);

                } else {
                    RealmList<ChainBean> list = new RealmList<>();
                    ChainBean chainBean = new ChainBean();
                    if (realmWalletInfo.getChainName().equalsIgnoreCase("kto")) {
                        chainBean.setContract("0xE388eb6aaBA54412c979564d6aC0537A8AB37f6D");
                        chainBean.setName(realmWalletInfo.getChainName());
                        chainBean.setDecimal("11");
                    } else if (realmWalletInfo.getChainName().equalsIgnoreCase("eth")) {
                        chainBean.setContract("0xeefba1e63905ef1d7acba5a8513c70307c1ce441");
                        chainBean.setName(realmWalletInfo.getChainName());
                        chainBean.setDecimal("18");
                    } else if (realmWalletInfo.getChainName().equalsIgnoreCase("bsc")) {
                        chainBean.setContract("0xB8c77482e45F1F44dE1745F52C74426C631bDD52");
                        chainBean.setName("BNB");
                        chainBean.setDecimal("18");
                    }
                    chainBean.setNum("0");
                    list.add(chainBean);
                    realmWalletInfo.setChainList(list);
                    realm.copyToRealmOrUpdate(realmWalletInfo);
                }
            }
        }, new Realm.Transaction.OnSuccess() {
            @Override
            public void onSuccess() {

                realmInstance.executeTransaction(new Realm.Transaction() {
                    @Override
                    public void execute(Realm realm) {
                        //先查找后得到User对象
                        RealmResults<MyWalletInfo> all = realm.where(MyWalletInfo.class).findAll();
                        if (all.size() == 0)
                            return;

                        for (MyWalletInfo item : all) {

                            if (realmWalletInfo.getChainName().equalsIgnoreCase("all")) {
                                if (item.getKey().equalsIgnoreCase("KTO" + realmWalletInfo.getAddress())) {
                                    item.setChoose(true);
                                } else {
                                    item.setChoose(false);
                                }
                            } else {
                                if (item.getKey().equalsIgnoreCase(realmWalletInfo.getChainName() + realmWalletInfo.getAddress())) {
                                    item.setChoose(true);
                                } else {
                                    item.setChoose(false);
                                }
                            }

                        }
                    }
                });

                //成功回调
                WritableMap event = Arguments.createMap();
                //传递的参数
                event.putBoolean("mapBean", true);
                sendEventToRn("putRealm", event);
            }
        }, new Realm.Transaction.OnError() {
            @Override
            public void onError(Throwable error) {
                //失败回调
                WritableMap event = Arguments.createMap();
                //传递的参数
                event.putBoolean("mapBean", false);
                sendEventToRn("putRealm", event);
            }
        });
    }

    //获取钱包
    @ReactMethod
    public void findRealm(String name, String eventName) {
        Realm realmInstance = new RealmManager().getRealmInstance(WALLET_DB);

        RealmQuery<MyWalletInfo> query = realmInstance.where(MyWalletInfo.class);
        if (!name.equalsIgnoreCase("all")) {
            query.equalTo("chainName", name);
        }
        RealmResults<MyWalletInfo> list = query.findAll();

        List<RNWalletInfo> walletInfoList = new ArrayList<>();
        for (MyWalletInfo item : list) {
            RNWalletInfo myWalletInfo = new RNWalletInfo();
            myWalletInfo.setChainName(item.getChainName());
            myWalletInfo.setWalletName(item.getWalletName());
            myWalletInfo.setAddress(item.getAddress());
            myWalletInfo.setMnemonic(item.getMnemonic());
            myWalletInfo.setPath(item.getPath());
            myWalletInfo.setPublicKey(item.getPublicKey());
            myWalletInfo.setPrivateKey(item.getPrivateKey());
            myWalletInfo.setChoose(item.isChoose());
            myWalletInfo.setKey(item.getKey());
            myWalletInfo.setPassword(item.getPassword());
            myWalletInfo.setPasswordHint(item.getPasswordHint());
            List<ChainBean> chainBeanList = new ArrayList<>();
            for (ChainBean chain : item.getChainList()) {
                ChainBean chainBean = new ChainBean();
                chainBean.setContract(chain.getContract());
                chainBean.setDecimal(chain.getDecimal());
                chainBean.setNum(chain.getNum());
                chainBean.setName(chain.getName());
                chainBeanList.add(chainBean);
            }
            myWalletInfo.setChainList(chainBeanList);

            walletInfoList.add(myWalletInfo);
        }

        WritableMap event = Arguments.createMap();
        //传递的参数
        event.putString("mapBean", new Gson().toJson(walletInfoList));
        sendEventToRn(eventName, event);
    }

    //删除钱包
    @ReactMethod
    public void deleteWallet(String key) {
        Realm realmInstance = new RealmManager().getRealmInstance(WALLET_DB);
        realmInstance.executeTransactionAsync(new Realm.Transaction() {
            @Override
            public void execute(Realm realm) {
                //先查找后得到User对象
                RealmResults<MyWalletInfo> all = realm.where(MyWalletInfo.class).findAll();
                if (all.size() == 0)
                    return;

                for (MyWalletInfo item : all) {
                    if (item.getKey().equals(key)) {
                        item.deleteFromRealm();
                    }
                }
            }
        }, new Realm.Transaction.OnSuccess() {
            @Override
            public void onSuccess() {
                realmInstance.executeTransaction(new Realm.Transaction() {
                    @Override
                    public void execute(Realm realm) {
                        //先查找后得到User对象
                        RealmResults<MyWalletInfo> all = realm.where(MyWalletInfo.class).findAll();
                        if (all.size() == 0)
                            return;

                        for (MyWalletInfo item : all) {
                            item.setChoose(false);
                        }

                        all.get(0).setChoose(true);
                    }
                });

                //成功回调
                WritableMap event = Arguments.createMap();
                //传递的参数
                event.putBoolean("mapBean", true);
                sendEventToRn("deleteRealm", event);
            }
        }, new Realm.Transaction.OnError() {

            @Override
            public void onError(Throwable error) {
                //回调
                WritableMap event = Arguments.createMap();
                //传递的参数
                event.putBoolean("mapBean", false);
                sendEventToRn("deleteRealm", event);
            }
        });
    }

    //选择钱包
    @ReactMethod
    public void chooseWallet(String key) {
        Realm realmInstance = new RealmManager().getRealmInstance(WALLET_DB);
        realmInstance.executeTransaction(new Realm.Transaction() {
            @Override
            public void execute(Realm realm) {
                //先查找后得到User对象
                RealmResults<MyWalletInfo> all = realm.where(MyWalletInfo.class).findAll();
                if (all.size() == 0)
                    return;

                for (MyWalletInfo item : all) {
                    if (item.getKey().equals(key)) {
                        item.setChoose(true);
                    } else {
                        item.setChoose(false);
                    }
                }
            }
        });
    }

    //代币操作
    @ReactMethod
    public void operateChain(String key, String json, boolean type) {

        final ChainBean myChainBean = new Gson().fromJson(json, new TypeToken<ChainBean>() {
        }.getType());

        Realm realmInstance = new RealmManager().getRealmInstance(WALLET_DB);
        realmInstance.executeTransactionAsync(new Realm.Transaction() {
            @Override
            public void execute(Realm realm) {
                //先查找后得到对象
                RealmQuery<MyWalletInfo> query = realm.where(MyWalletInfo.class);
                query.equalTo("key", key);
                RealmResults<MyWalletInfo> list = query.findAll();

                if (list.size() == 0)
                    return;

                if (type) {
                    boolean type = true;

                    for (ChainBean item : list.get(0).getChainList()) {
                        if (item.getContract().equalsIgnoreCase(myChainBean.getContract())) {
                            type = false;
                        }
                    }

                    if (type) {
                        ChainBean chainBean = new ChainBean();
                        chainBean.setContract(myChainBean.getContract());
                        chainBean.setNum("0");
                        chainBean.setDecimal(myChainBean.getDecimal());
                        chainBean.setName(myChainBean.getName());
                        list.get(0).getChainList().add(chainBean);
                    }
                } else {
                    for (int i = 0; i < list.get(0).getChainList().size(); i++) {
                        if (list.get(0).getChainList().get(i).getContract().equalsIgnoreCase(myChainBean.getContract())) {
                            list.get(0).getChainList().get(i).deleteFromRealm();
                        }
                    }
                }

            }
        }, new Realm.Transaction.OnSuccess() {
            @Override
            public void onSuccess() {
                WritableMap event = Arguments.createMap();
                //传递的参数
                event.putBoolean("mapBean", true);
                sendEventToRn("addEvent", event);
            }
        }, new Realm.Transaction.OnError() {
            @Override
            public void onError(Throwable error) {
                //失败回调
                WritableMap event = Arguments.createMap();
                //传递的参数
                event.putBoolean("mapBean", false);
                sendEventToRn("addEvent", event);
            }
        });
    }

    //转账地址操作
    @ReactMethod
    public void operateAddress(String chainName, String json) {

        final AddressBean myAddressBean = new Gson().fromJson(json, new TypeToken<AddressBean>() {
        }.getType());

        AddressBean addressListBean = new AddressBean();

        Realm realmInstance = null;
        if (chainName.equalsIgnoreCase("kto")) {
            realmInstance = new RealmManager().getRealmInstance(KTOADDRESS_DB);
        } else {
            realmInstance = new RealmManager().getRealmInstance(ETHADDRESS_DB);
        }

        realmInstance.executeTransactionAsync(new Realm.Transaction() {
            @Override
            public void execute(Realm realm) {

                addressListBean.setAddress(myAddressBean.getAddress());
                addressListBean.setAddressName(myAddressBean.getAddressName());
                addressListBean.setChainName(myAddressBean.getChainName());
                realm.copyToRealmOrUpdate(addressListBean);

            }
        }, new Realm.Transaction.OnSuccess() {
            @Override
            public void onSuccess() {
                //成功回调
                WritableMap event = Arguments.createMap();
                //传递的参数
                event.putBoolean("mapBean", true);
                sendEventToRn("operateAddressRealm", event);
            }
        }, new Realm.Transaction.OnError() {
            @Override
            public void onError(Throwable error) {
                //失败回调
                WritableMap event = Arguments.createMap();
                //传递的参数
                event.putBoolean("mapBean", false);
                sendEventToRn("operateAddressRealm", event);
            }
        });
    }

    //获取所有转账地址
    @ReactMethod
    public void findAddressRealm(String name) {

        Realm realmInstance = null;

        if (name.equalsIgnoreCase("kto")) {
            realmInstance = new RealmManager().getRealmInstance(KTOADDRESS_DB);
        } else {
            realmInstance = new RealmManager().getRealmInstance(ETHADDRESS_DB);
        }

        RealmQuery<AddressBean> query = realmInstance.where(AddressBean.class);
        RealmResults<AddressBean> list = query.findAll();

        List<RNAddressBean> addressBeanList = new ArrayList<>();

        for (AddressBean item : list) {
            addressBeanList.add(new RNAddressBean(item.getAddress(), item.getAddressName(), item.getChainName()));
        }

        WritableMap event = Arguments.createMap();
        //传递的参数
        event.putString("mapBean", new Gson().toJson(addressBeanList));
        sendEventToRn("addressSuccess", event);
    }


    public static void sendEventToRn(String eventName, @Nullable WritableMap paramss) {
        myContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, paramss);
    }


}
