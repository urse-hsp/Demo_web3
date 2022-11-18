package com.nativernkeeptokenapp.viewmodel;

import static com.alphawallet.ethereum.EthereumNetworkBase.MAINNET_ID;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.util.Log;
import android.webkit.WebView;
import android.widget.Toast;

import androidx.annotation.Nullable;
import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;
import androidx.preference.PreferenceManager;

import com.nativernkeeptokenapp.C;
import com.nativernkeeptokenapp.R;
import com.nativernkeeptokenapp.entity.AnalyticsProperties;
import com.nativernkeeptokenapp.entity.ImportWalletCallback;
import com.nativernkeeptokenapp.interact.ImportWalletInteract;
import com.nativernkeeptokenapp.interact.SetDefaultWalletInteract;
import com.nativernkeeptokenapp.repository.TokenRepository;
import com.nativernkeeptokenapp.service.AnalyticsServiceType;
import com.nativernkeeptokenapp.ui.WalletConnectActivity;
import com.nativernkeeptokenapp.entity.DAppFunction;
import com.nativernkeeptokenapp.entity.NetworkInfo;
import com.nativernkeeptokenapp.entity.Operation;
import com.nativernkeeptokenapp.entity.QRResult;
import com.nativernkeeptokenapp.entity.SendTransactionInterface;
import com.nativernkeeptokenapp.entity.SignAuthenticationCallback;
import com.nativernkeeptokenapp.entity.Wallet;
import com.nativernkeeptokenapp.interact.CreateTransactionInteract;
import com.nativernkeeptokenapp.repository.EthereumNetworkRepositoryType;
import com.nativernkeeptokenapp.service.AssetDefinitionService;
import com.nativernkeeptokenapp.service.GasService;
import com.nativernkeeptokenapp.service.KeyService;
import com.nativernkeeptokenapp.service.TokensService;
import com.nativernkeeptokenapp.util.AWEnsResolver;
import com.nativernkeeptokenapp.web3.entity.WalletAddEthereumChainObject;
import com.nativernkeeptokenapp.web3.entity.Web3Transaction;
import com.alphawallet.token.entity.Signable;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.util.List;
import java.util.concurrent.TimeUnit;

import javax.inject.Inject;

import dagger.hilt.android.lifecycle.HiltViewModel;
import io.reactivex.Observable;
import io.reactivex.Single;
import io.reactivex.android.schedulers.AndroidSchedulers;
import io.reactivex.disposables.Disposable;
import io.reactivex.schedulers.Schedulers;
import io.realm.Realm;
import timber.log.Timber;

@HiltViewModel
public class DappBrowserViewModel extends BaseViewModel {
    private static final int BALANCE_CHECK_INTERVAL_SECONDS = 20;

    private final MutableLiveData<NetworkInfo> activeNetwork = new MutableLiveData<>();
    private final SetDefaultWalletInteract setDefaultWalletInteract;
    private final AssetDefinitionService assetDefinitionService;
    private final CreateTransactionInteract createTransactionInteract;
    private final TokensService tokensService;
    private final EthereumNetworkRepositoryType ethereumNetworkRepository;
    private final KeyService keyService;
    private final GasService gasService;
    private final ImportWalletInteract importWalletInteract;
    private final AWEnsResolver ensResolver;
    private final AnalyticsServiceType analyticsService;

    private String importWalletType = "";

    private final MutableLiveData<Wallet> wallet = new MutableLiveData<>();

    @Nullable
    private Disposable balanceTimerDisposable;

    @Inject
    DappBrowserViewModel(
            SetDefaultWalletInteract setDefaultWalletInteract,
            AssetDefinitionService assetDefinitionService,
            CreateTransactionInteract createTransactionInteract,
            TokensService tokensService,
            EthereumNetworkRepositoryType ethereumNetworkRepository,
            KeyService keyService,
            ImportWalletInteract importWalletInteract,
            AnalyticsServiceType analyticsService,
            GasService gasService) {
        this.setDefaultWalletInteract = setDefaultWalletInteract;
        this.assetDefinitionService = assetDefinitionService;
        this.createTransactionInteract = createTransactionInteract;
        this.tokensService = tokensService;
        this.ethereumNetworkRepository = ethereumNetworkRepository;
        this.keyService = keyService;
        this.importWalletInteract = importWalletInteract;
        this.analyticsService = analyticsService;
        this.ensResolver = new AWEnsResolver(TokenRepository.getWeb3jService(MAINNET_ID), keyService.getContext());
        this.gasService = gasService;
    }

    public AssetDefinitionService getAssetDefinitionService() {
        return assetDefinitionService;
    }

    public LiveData<NetworkInfo> activeNetwork() {
        return activeNetwork;
    }

    public LiveData<Wallet> defaultWallet() {
        return wallet;
    }

    public NetworkInfo getActiveNetwork() {
        return ethereumNetworkRepository.getActiveBrowserNetwork();
    }

    public void checkForNetworkChanges() {
        activeNetwork.postValue(ethereumNetworkRepository.getActiveBrowserNetwork());
    }

    private void checkBalance(final Wallet wallet) {
        final NetworkInfo info = getActiveNetwork();
        if (info != null && wallet != null) {
            disposable = tokensService.getChainBalance(wallet.address.toLowerCase(), info.chainId)
                    .subscribeOn(Schedulers.io())
                    .observeOn(Schedulers.io())
                    .subscribe(w -> {
                    }, e -> {
                    });
        }
    }

    public void signMessage(Signable message, DAppFunction dAppFunction) {
        disposable = createTransactionInteract.sign(wallet.getValue(), message,
                getActiveNetwork().chainId)
                .subscribeOn(Schedulers.computation())
                .observeOn(AndroidSchedulers.mainThread())
                .subscribe(sig -> dAppFunction.DAppReturn(sig.signature, message),
                        error -> dAppFunction.DAppError(error, message));
    }

    public void setLastUrl(Context context, String url) {
        PreferenceManager.getDefaultSharedPreferences(context)
                .edit().putString(C.DAPP_LASTURL_KEY, url).apply();
    }

    public void setHomePage(Context context, String url) {
        PreferenceManager.getDefaultSharedPreferences(context)
                .edit().putString(C.DAPP_HOMEPAGE_KEY, url).apply();
    }

    public String getHomePage(Context context) {
        return PreferenceManager.getDefaultSharedPreferences(context).getString(C.DAPP_HOMEPAGE_KEY, null);
    }


    public void share(Context context, String url) {
        Intent intent = new Intent();
        intent.setAction(Intent.ACTION_SEND);
        intent.putExtra(Intent.EXTRA_TEXT, url);
        intent.setType("text/plain");
        context.startActivity(intent);
    }

    public void onClearBrowserCacheClicked(Context context) {
        WebView webView = new WebView(context);
        webView.clearCache(true);
        Toast.makeText(context, context.getString(R.string.toast_browser_cache_cleared),
                Toast.LENGTH_SHORT).show();
    }

    public void setNetwork(long chainId) {
        NetworkInfo info = ethereumNetworkRepository.getNetworkByChain(chainId);
        if (info != null) {
            ethereumNetworkRepository.setActiveBrowserNetwork(info);
            gasService.startGasPriceCycle(chainId);
        }
    }


    public void getAuthorisation(Wallet wallet, Activity activity, SignAuthenticationCallback callback) {
        keyService.getAuthenticationForSignature(wallet, activity, callback);
    }

    public void resetSignDialog() {
        keyService.resetSigningDialog();
    }

    public void completeAuthentication(Operation signData) {
        keyService.completeAuthentication(signData);
    }

    public void failedAuthentication(Operation signData) {
        keyService.failedAuthentication(signData);
    }

    public void showSend(Context ctx, QRResult result) {
        /*Intent intent = new Intent(ctx, SendActivity.class);
        boolean sendingTokens = (result.getFunction() != null && result.getFunction().length() > 0);
        String address = defaultWallet.getValue().address;
        int decimals = 18;

        intent.putExtra(C.EXTRA_SENDING_TOKENS, sendingTokens);
        intent.putExtra(C.EXTRA_CONTRACT_ADDRESS, address);
        intent.putExtra(C.EXTRA_NETWORKID, result.chainId);
        intent.putExtra(C.EXTRA_SYMBOL, ethereumNetworkRepository.getNetworkByChain(result.chainId).symbol);
        intent.putExtra(C.EXTRA_DECIMALS, decimals);
        intent.putExtra(C.Key.WALLET, defaultWallet.getValue());
        intent.putExtra(C.EXTRA_AMOUNT, result);
        intent.setFlags(Intent.FLAG_ACTIVITY_MULTIPLE_TASK);
        ctx.startActivity(intent);*/
        Toast.makeText(ctx, "发送", Toast.LENGTH_LONG);
    }

    public void sendTransaction(final Web3Transaction finalTx, long chainId, SendTransactionInterface callback) {
        if (finalTx.isConstructor()) {
            disposable = createTransactionInteract
                    .createWithSig(wallet.getValue(), finalTx.gasPrice, finalTx.gasLimit, finalTx.payload, chainId)
                    .subscribe(txData -> callback.transactionSuccess(finalTx, txData.txHash),
                            error -> callback.transactionError(finalTx.leafPosition, error));
        } else {
            disposable = createTransactionInteract
                    .createWithSig(wallet.getValue(), finalTx, chainId)
                    .subscribe(txData -> callback.transactionSuccess(finalTx, txData.txHash),
                            error -> callback.transactionError(finalTx.leafPosition, error));
        }
    }


    public void onDestroy() {
        if (balanceTimerDisposable != null && !balanceTimerDisposable.isDisposed())
            balanceTimerDisposable.dispose();
    }

    public void updateGasPrice(long chainId) {
        gasService.startGasPriceCycle(chainId);
    }

    public Realm getRealmInstance(Wallet wallet) {
        return tokensService.getRealmInstance(wallet);
    }

    public void startBalanceUpdate() {
        if (balanceTimerDisposable == null || balanceTimerDisposable.isDisposed()) {
            balanceTimerDisposable = Observable.interval(0, BALANCE_CHECK_INTERVAL_SECONDS, TimeUnit.SECONDS)
                    .doOnNext(l -> checkBalance(wallet.getValue())).subscribe();
        }
    }

    public void stopBalanceUpdate() {
        if (balanceTimerDisposable != null && !balanceTimerDisposable.isDisposed())
            balanceTimerDisposable.dispose();
        balanceTimerDisposable = null;
    }

    public void handleWalletConnect(Context context, String url, NetworkInfo activeNetwork) {
        String importPassData = WalletConnectActivity.WC_LOCAL_PREFIX + url;
        Intent intent = new Intent(context, WalletConnectActivity.class);
        intent.addFlags(Intent.FLAG_ACTIVITY_REORDER_TO_FRONT);
        intent.putExtra(C.EXTRA_CHAIN_ID, activeNetwork.chainId);
        intent.putExtra("qrCode", importPassData);
        context.startActivity(intent);
    }

    public TokensService getTokenService() {
        return tokensService;
    }

    public Single<BigInteger> calculateGasEstimate(Wallet wallet, byte[] transactionBytes, long chainId, String sendAddress, BigDecimal sendAmount, BigInteger defaultGasLimit) {
        return gasService.calculateGasEstimate(transactionBytes, chainId, sendAddress, sendAmount.toBigInteger(), wallet, defaultGasLimit);
    }

    public String getNetworkNodeRPC(long chainId) {
        return ethereumNetworkRepository.getNetworkByChain(chainId).rpcServerUrl;
    }

    public NetworkInfo getNetworkInfo(long chainId) {
        return ethereumNetworkRepository.getNetworkByChain(chainId);
    }

    public String getSessionId(String url) {
        String uriString = url.replace("wc:", "wc://");
        return Uri.parse(uriString).getUserInfo();
    }

    public void addCustomChain(WalletAddEthereumChainObject chainObject) {
        this.ethereumNetworkRepository.addCustomRPCNetwork(chainObject.chainName, extractRpc(chainObject), chainObject.getChainId(),
                chainObject.nativeCurrency.symbol, "", "", false, -1L);

        tokensService.createBaseToken(chainObject.getChainId())
                .subscribeOn(Schedulers.io())
                .observeOn(Schedulers.io())
                .subscribe(w -> {
                }, e -> {
                })
                .isDisposed();
    }

    //NB Chain descriptions can contain WSS socket defs, which might come first.
    private String extractRpc(WalletAddEthereumChainObject chainObject) {
        for (String thisRpc : chainObject.rpcUrls) {
            if (thisRpc.toLowerCase().startsWith("http")) {
                return thisRpc;
            }
        }

        return "";
    }

    public boolean isMainNetsSelected() {
        return ethereumNetworkRepository.isMainNetSelected();
    }

    public void addNetworkToFilters(NetworkInfo info) {
        List<Long> filters = ethereumNetworkRepository.getFilterNetworkList();
        if (!filters.contains(info.chainId)) {
            filters.add(info.chainId);
            ethereumNetworkRepository.setFilterNetworkList(filters.toArray(new Long[0]));
        }

        tokensService.setupFilter(true);
    }

    public void setMainNetsSelected(boolean isMainNet) {
        ethereumNetworkRepository.setActiveMainnet(isMainNet);
    }

    //助记词导入钱包
    public void importHDWallet(String seedPhrase, Activity activity, ImportWalletCallback callback) {
        keyService.importHDKey(seedPhrase, activity, callback);
    }

    //私钥导入钱包
    public void importPrivateKeyWallet(String address, Activity activity, ImportWalletCallback callback)
    {
        keyService.createPrivateKeyPassword(address, activity, callback);
    }

    public void onPrivateKey(String privateKey, String newPassword, KeyService.AuthenticationLevel level) {
        importWalletType = C.AN_PRIVATE_KEY;
        progress.postValue(true);
        importWalletInteract
                .importPrivateKey(privateKey, newPassword)
                .flatMap(wallet -> importWalletInteract.storeKeystoreWallet(wallet, level, ensResolver))
                .subscribeOn(Schedulers.computation())
                .observeOn(AndroidSchedulers.mainThread())
                .subscribe(this::onWallet, this::onError).isDisposed();
    }

    //储存钱包
    public void onSeed(String walletAddress, KeyService.AuthenticationLevel level) {
        importWalletType = C.AN_SEED_PHRASE;

        progress.postValue(true);
        //begin key storage process
        disposable = importWalletInteract.storeHDWallet(walletAddress, level, ensResolver)
                .subscribeOn(Schedulers.io())
                .observeOn(AndroidSchedulers.mainThread())
                .subscribe(this::onWallet, this::onError); //signal to UI wallet import complete
    }

    private void onWallet(Wallet wallet) {
        progress.postValue(false);
        this.wallet.postValue(wallet);
        track();
    }

    public void track()
    {
        AnalyticsProperties analyticsProperties = new AnalyticsProperties();
        analyticsProperties.setWalletType(importWalletType);

        analyticsService.track(C.AN_IMPORT_WALLET, analyticsProperties);
    }

    public void setDefaultWallet(Wallet wallet)
    {
        disposable = setDefaultWalletInteract
                .set(wallet)
                .subscribe(() -> onDefaultWallet(), this::onError);
    }


    private void onDefaultWallet( )
    {
        Log.d("++++++++++wallet++++++++++++","导入成功");
    }
}
