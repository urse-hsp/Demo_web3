package com.nativernkeeptokenapp;

import static com.nativernkeeptokenapp.entity.Operation.SIGN_DATA;
import static com.nativernkeeptokenapp.widget.AWalletAlertDialog.WARNING;
import static org.web3j.protocol.core.methods.request.Transaction.createEthCallTransaction;
import static java.security.AccessController.getContext;

import android.Manifest;
import android.app.AlertDialog;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.net.http.SslError;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.text.Editable;
import android.text.TextUtils;
import android.text.TextWatcher;
import android.util.Log;
import android.view.MenuInflater;
import android.view.MenuItem;
import android.view.View;
import android.view.inputmethod.EditorInfo;
import android.webkit.ConsoleMessage;
import android.webkit.GeolocationPermissions;
import android.webkit.PermissionRequest;
import android.webkit.SslErrorHandler;
import android.webkit.ValueCallback;
import android.webkit.WebBackForwardList;
import android.webkit.WebChromeClient;
import android.webkit.WebHistoryItem;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.AutoCompleteTextView;
import android.widget.FrameLayout;
import android.widget.ImageView;
import android.widget.ProgressBar;
import android.widget.Toast;

import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;
import androidx.core.content.ContextCompat;
import androidx.lifecycle.ViewModelProvider;

import com.alphawallet.token.entity.EthereumMessage;
import com.alphawallet.token.entity.EthereumTypedMessage;
import com.alphawallet.token.entity.SignMessageType;
import com.alphawallet.token.entity.Signable;
import com.alphawallet.token.tools.Numeric;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.nativernkeeptokenapp.entity.ContractType;
import com.nativernkeeptokenapp.entity.DAppFunction;
import com.nativernkeeptokenapp.entity.ImportWalletCallback;
import com.nativernkeeptokenapp.entity.NetworkInfo;
import com.nativernkeeptokenapp.entity.SendTransactionInterface;
import com.nativernkeeptokenapp.entity.SignAuthenticationCallback;
import com.nativernkeeptokenapp.entity.URLLoadInterface;
import com.nativernkeeptokenapp.entity.Wallet;
import com.nativernkeeptokenapp.entity.WalletType;
import com.nativernkeeptokenapp.entity.cryptokeys.KeyEncodingType;
import com.nativernkeeptokenapp.entity.tokens.Token;
import com.nativernkeeptokenapp.entity.tokens.TokenInfo;
import com.nativernkeeptokenapp.repository.EthereumNetworkRepository;
import com.nativernkeeptokenapp.rn.MyWalletInfo;
import com.nativernkeeptokenapp.rn.RNWalletInfo;
import com.nativernkeeptokenapp.service.AWHttpService;
import com.nativernkeeptokenapp.service.KeyService;
import com.nativernkeeptokenapp.ui.AddEthereumChainPrompt;
import com.nativernkeeptokenapp.ui.widget.entity.ActionSheetCallback;
import com.nativernkeeptokenapp.util.KeyboardUtils;
import com.nativernkeeptokenapp.util.LocaleUtils;
import com.nativernkeeptokenapp.util.SpUtils;
import com.nativernkeeptokenapp.util.Utils;
import com.nativernkeeptokenapp.viewmodel.DappBrowserViewModel;
import com.nativernkeeptokenapp.web3.OnEthCallListener;
import com.nativernkeeptokenapp.web3.OnSignMessageListener;
import com.nativernkeeptokenapp.web3.OnSignPersonalMessageListener;
import com.nativernkeeptokenapp.web3.OnSignTransactionListener;
import com.nativernkeeptokenapp.web3.OnSignTypedMessageListener;
import com.nativernkeeptokenapp.web3.OnWalletActionListener;
import com.nativernkeeptokenapp.web3.OnWalletAddEthereumChainObjectListener;
import com.nativernkeeptokenapp.web3.Web3View;
import com.nativernkeeptokenapp.web3.entity.Address;
import com.nativernkeeptokenapp.web3.entity.BlockChainInfo;
import com.nativernkeeptokenapp.web3.entity.WalletAddEthereumChainObject;
import com.nativernkeeptokenapp.web3.entity.WalletInfo;
import com.nativernkeeptokenapp.web3.entity.Web3Call;
import com.nativernkeeptokenapp.web3.entity.Web3Transaction;
import com.nativernkeeptokenapp.widget.AWalletAlertDialog;
import com.nativernkeeptokenapp.widget.ActionSheetDialog;
import com.nativernkeeptokenapp.widget.TestNetDialog;
import com.nativernkeeptokenapp.widget.entity.DappBrowserSwipeInterface;
import com.nativernkeeptokenapp.widget.entity.DappBrowserSwipeLayout;

import org.jetbrains.annotations.NotNull;
import org.json.JSONException;
import org.json.JSONObject;
import org.web3j.crypto.ECKeyPair;
import org.web3j.crypto.Keys;
import org.web3j.crypto.WalletUtils;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.core.methods.response.EthCall;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.util.UUID;
import java.util.concurrent.TimeUnit;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import dagger.hilt.android.AndroidEntryPoint;
import io.reactivex.Observable;
import io.reactivex.Single;
import io.reactivex.android.schedulers.AndroidSchedulers;
import io.reactivex.schedulers.Schedulers;
import okhttp3.OkHttpClient;
import timber.log.Timber;

@AndroidEntryPoint
public class CommonWebActivity extends AppCompatActivity implements DappBrowserSwipeInterface, URLLoadInterface,
        OnSignMessageListener, OnSignPersonalMessageListener, OnSignTransactionListener, OnSignTypedMessageListener,
        OnEthCallListener, OnWalletAddEthereumChainObjectListener, OnWalletActionListener,
        SignAuthenticationCallback, ActionSheetCallback, ImportWalletCallback, TestNetDialog.TestNetDialogCallback {

    private DappBrowserSwipeLayout swipeRefreshLayout;
    private Web3View web3;
    private AutoCompleteTextView urlTv;
    private ProgressBar progressBar;
    private View layoutNavigation;

    private Toolbar toolbar;
    private ImageView back;
    private ImageView next;
    private ImageView clear;

    private DAppFunction dAppFunction;

    private String loadOnInit; //Web3 needs to be fully set up and initialised before any dapp loading can be done

    //钱包信息
    private RNWalletInfo walletInfo;
    private BlockChainInfo blockChainInfo;


    private static final String WALLETCONNECT_CHAINID_ERROR = "Error: ChainId missing or not supported";
    private final Handler handler = new Handler(Looper.getMainLooper());

    private AWalletAlertDialog resultDialog;
    private AlertDialog chainSwapDialog;


    private ActionSheetDialog confirmationDialog;

    public static final int REQUEST_FINE_LOCATION = 110;
    public static final int REQUEST_CAMERA_ACCESS = 111;

    private DappBrowserViewModel viewModel;
    private NetworkInfo activeNetwork;

    private Wallet wallet;

    private String walletConnectSession;
    private boolean homePressed;

    private double forceChainChange = 0;

    private AddEthereumChainPrompt addCustomChainDialog;


    private static final Pattern findKey = Pattern.compile("($|\\s?|0x?)([0-9a-fA-F]{64})($|\\s?)");

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        setContentView(R.layout.activity_webview);

        String walletInfoString = getIntent().getStringExtra("walletInfo");
        String blockChain = getIntent().getStringExtra("blockChain");

        if (!TextUtils.isEmpty(walletInfoString) && !TextUtils.isEmpty(blockChain)) {
            try {
                JSONObject chainString = new JSONObject(blockChain);
                String blockJb = chainString.getString("value");
                blockChainInfo = new Gson().fromJson(blockJb, new TypeToken<BlockChainInfo>() {
                }.getType());

                walletInfo = new Gson().fromJson(walletInfoString, new TypeToken<RNWalletInfo>() {
                }.getType());
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }

        loadOnInit = getIntent().getStringExtra("url");

        EthereumNetworkRepository.setDefaultDapp(loadOnInit);

        web3 = findViewById(R.id.web3view);

        progressBar = findViewById(R.id.progressBar);
        urlTv = findViewById(R.id.url_tv);
        swipeRefreshLayout = findViewById(R.id.swipe_refresh);
        swipeRefreshLayout.setRefreshInterface(this);

        toolbar = findViewById(R.id.address_bar);
        layoutNavigation = findViewById(R.id.layout_navigator);

        View home = findViewById(R.id.home);

        home.setOnClickListener(v -> finish());

        MenuInflater inflater = new MenuInflater(LocaleUtils.getActiveLocaleContext(CommonWebActivity.this));
        inflater.inflate(R.menu.menu_bookmarks, toolbar.getMenu());


        back = findViewById(R.id.back);
        back.setOnClickListener(v -> backPressed());

        next = findViewById(R.id.next);
        next.setOnClickListener(v -> goToNextPage());

        clear = findViewById(R.id.clear_url);
        clear.setOnClickListener(v -> {
            clearAddressBar();
        });

        web3.setWebLoadCallback(this);
//
//      if(Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
//            web3.setWebContentsDebuggingEnabled(true);
//        }

        initViewModel();
        setupAddressBar();
        setupMenu();
    }

    private void setupMenu() {

        final MenuItem reload = toolbar.getMenu().findItem(R.id.action_reload);
        if (reload != null) reload.setOnMenuItemClickListener(menuItem -> {
            reloadPage();
            return true;
        });
    }

    private void initViewModel() {
        viewModel = new ViewModelProvider(this)
                .get(DappBrowserViewModel.class);

        viewModel.activeNetwork().observe(this, this::onNetworkChanged);
        viewModel.defaultWallet().observe(this, this::onDefaultWallet);

        //设置链id
        viewModel.setNetwork(blockChainInfo.getChainId());
        //导入钱包
        if (!TextUtils.isEmpty(walletInfo.getMnemonic())) {
            viewModel.importHDWallet(walletInfo.getMnemonic(), this, this);
        } else {
            String value = walletInfo.getPrivateKey();
            final Matcher matcher = findKey.matcher(value);
            if (matcher.find()) {
                value = matcher.group(2);
            }
            BigInteger key = new BigInteger(value, 16);
            ECKeyPair keypair = ECKeyPair.create(key);
            String address = org.web3j.utils.Numeric.prependHexPrefix(Keys.getAddress(keypair));
            viewModel.importPrivateKeyWallet(address, this, this);
        }

        activeNetwork = viewModel.getActiveNetwork();
    }

    private void setupAddressBar() {

        urlTv.setOnEditorActionListener((v, actionId, event) -> {
            boolean handled = false;
            if (actionId == EditorInfo.IME_ACTION_GO) {
                String urlText = urlTv.getText().toString();
                handled = loadUrl(urlText);
                KeyboardUtils.hideKeyboard(urlTv);
                setBackForwardButtons();
            }
            return handled;
        });

        urlTv.setShowSoftInputOnFocus(true);

        urlTv.setOnLongClickListener(v -> {
            urlTv.dismissDropDown();
            return false;
        });

        urlTv.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence charSequence, int i, int i1, int i2) {

            }

            @Override
            public void onTextChanged(CharSequence charSequence, int i, int i1, int i2) {

            }

            @Override
            public void afterTextChanged(Editable editable) {

            }
        });
    }


    private void onDefaultWallet(Wallet wallet) {
        //设置默认钱包
        viewModel.setDefaultWallet(wallet);

        this.wallet = wallet;
        if (activeNetwork != null) {
            boolean needsReload = loadOnInit == null;
            setupWeb3();
            if (needsReload) reloadPage();
        }
    }

    private void onNetworkChanged(NetworkInfo networkInfo) {
        this.activeNetwork = networkInfo;
        if (networkInfo != null) {
            updateFilters(networkInfo);
        } else {
            Toast.makeText(CommonWebActivity.this, "主网络错误", Toast.LENGTH_LONG);
        }
    }


    private void updateFilters(NetworkInfo networkInfo) {
        if (networkInfo.hasRealValue() && !viewModel.isMainNetsSelected()) {
            //switch to main net, no need to ask user
            viewModel.setMainNetsSelected(true);
        }

        viewModel.addNetworkToFilters(networkInfo);
    }


    public void backPressed() {
        if (web3 == null || back == null || back.getAlpha() == 0.3f) return;
        if (web3.canGoBack()) {
            checkBackClickArrowVisibility(); //to make arrows function correctly - don't want to wait for web page to load to check back/forwards - this looks clunky
            loadSessionUrl(-1);
            web3.goBack();
        } else if (!web3.getUrl().equalsIgnoreCase(getDefaultDappUrl())) {
            //load homepage
            homePressed = true;
            web3.resetView();
            web3.loadUrl(getDefaultDappUrl());
            setUrlText(getDefaultDappUrl());
            checkBackClickArrowVisibility();
        } else {
            checkBackClickArrowVisibility();
        }
    }

    /**
     * Browse to relative entry with sanity check on value
     *
     * @param relative relative addition or subtraction of browsing index
     */
    private void loadSessionUrl(int relative) {
        WebBackForwardList sessionHistory = web3.copyBackForwardList();
        int newIndex = sessionHistory.getCurrentIndex() + relative;
        if (newIndex < sessionHistory.getSize()) {
            WebHistoryItem newItem = sessionHistory.getItemAtIndex(newIndex);
            if (newItem != null) {
                setUrlText(newItem.getUrl());
            }
        }
    }

    /**
     * Check if this is the last web item and the last fragment item.
     */
    private void checkBackClickArrowVisibility() {
        //will this be last item?
        WebBackForwardList sessionHistory = web3.copyBackForwardList();
        int nextIndex = sessionHistory.getCurrentIndex() - 1;

        String nextUrl;

        if (nextIndex >= 0) {
            WebHistoryItem newItem = sessionHistory.getItemAtIndex(nextIndex);
            nextUrl = newItem.getUrl();
        } else {
            nextUrl = urlTv.getText().toString();// web3.getUrl();// getDefaultDappUrl();
        }

        if (nextUrl.equalsIgnoreCase(getDefaultDappUrl())) {
            back.setAlpha(0.3f);
        } else {
            back.setAlpha(1.0f);
        }
    }

    private String getDefaultDappUrl() {
        String customHome = viewModel.getHomePage(CommonWebActivity.this);
        return customHome != null ? customHome : EthereumNetworkRepository.defaultDapp(activeNetwork != null ? activeNetwork.chainId : 0);
    }

    private void goToNextPage() {
        if (next.getAlpha() == 0.3f) return;
        if (web3.canGoForward()) {
            checkForwardClickArrowVisibility();
            loadSessionUrl(1);
            web3.goForward();
        }
    }

    /**
     * After a forward click while web browser active, check if forward and back arrows should be updated.
     * Note that the web item only becomes history after the next page is loaded, so if the next item is new, then
     */
    private void checkForwardClickArrowVisibility() {
        WebBackForwardList sessionHistory = web3.copyBackForwardList();
        int nextIndex = sessionHistory.getCurrentIndex() + 1;
        if (nextIndex >= sessionHistory.getSize() - 1) next.setAlpha(0.3f);
        else next.setAlpha(1.0f);
    }

    private void clearAddressBar() {
        if (!urlTv.getText().toString().isEmpty()) {
            urlTv.getText().clear();
            KeyboardUtils.showKeyboard(urlTv); //ensure keyboard shows here so we can listen for it being cancelled
        }
    }

    @Override
    public void RefreshEvent() {
        //determine scroll position
        Log.i("Touch", "SCROLL: " + web3.getScrollY());
        if (web3.getScrollY() == 0) {
            loadUrl(web3.getUrl());
        }
    }

    private boolean loadUrl(String urlText) {
        web3.resetView();
        web3.loadUrl(Utils.formatUrl(urlText));
        setUrlText(Utils.formatUrl(urlText));
        web3.requestFocus();
        return true;
    }

    private void setUrlText(String newUrl) {
        urlTv.setText(newUrl);
    }

    @Override
    public int getCurrentScrollPosition() {
        return web3.getScrollY();
    }

    @Override
    public void onWebpageLoaded(String url, String title) {
        if (getContext() == null) return; //could be a late return from dead fragment
        onWebpageLoadComplete();

        if (urlTv != null) urlTv.setText(url);
    }

    @Override
    public void onWebpageLoadComplete() {
        handler.post(() -> {
            setBackForwardButtons();
        }); //execute on UI thread

        if (forceChainChange != 0) {
            handler.postDelayed(() -> forceChainChange = 0, 5000);
        }
    }


    private void setBackForwardButtons() {
        WebBackForwardList sessionHistory;
        boolean canBrowseBack = false;
        boolean canBrowseForward = false;

        if (web3 != null) {
            sessionHistory = web3.copyBackForwardList();
            canBrowseBack = !isOnHomePage();
            canBrowseForward = (sessionHistory != null && sessionHistory.getCurrentIndex() < sessionHistory.getSize() - 1);
        }

        if (back != null) {
            if (canBrowseBack) {
                back.setAlpha(1.0f);
            } else {
                back.setAlpha(0.3f);
            }
        }

        if (next != null) {
            if (canBrowseForward) {
                next.setAlpha(1.0f);
            } else {
                next.setAlpha(0.3f);
            }
        }
    }

    private boolean isOnHomePage() {
        if (web3 != null) {
            String url = web3.getUrl();
            return EthereumNetworkRepository.isDefaultDapp(url);
        } else {
            return false;
        }
    }

    private void setupWeb3() {

        web3.setChainId(activeNetwork.chainId);
        web3.setRpcUrl(viewModel.getNetworkNodeRPC(activeNetwork.chainId));
        web3.setWalletAddress(new Address(wallet.address));

        web3.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onProgressChanged(WebView webview, int newProgress) {
                if (newProgress == 100) {
                    progressBar.setVisibility(View.GONE);
                    swipeRefreshLayout.setRefreshing(false);
                } else {
                    progressBar.setVisibility(View.VISIBLE);
                    progressBar.setProgress(newProgress);
                    swipeRefreshLayout.setRefreshing(true);
                }
            }

            @Override
            public boolean onConsoleMessage(ConsoleMessage msg) {
                boolean ret = super.onConsoleMessage(msg);

                if (msg.messageLevel() == ConsoleMessage.MessageLevel.ERROR) {
                    if (msg.message().contains(WALLETCONNECT_CHAINID_ERROR)) {
                        displayCloseWC();
                    }
                }

                return ret;
            }

            @Override
            public void onReceivedTitle(WebView view, String title) {
                super.onReceivedTitle(view, title);
               String webtitle=  title;
            }

            @Override
            public void onPermissionRequest(final PermissionRequest request) {
                requestCameraPermission(request);
            }

            @Override
            public void onGeolocationPermissionsShowPrompt(String origin,
                                                           GeolocationPermissions.Callback callback) {
                super.onGeolocationPermissionsShowPrompt(origin, callback);
                requestGeoPermission(origin, callback);
            }

            @Override
            public boolean onShowFileChooser(WebView webView, ValueCallback<Uri[]> filePathCallback,
                                             FileChooserParams fCParams) {
                if (filePathCallback == null) return true;
                return true;
            }
        });

        web3.setWebViewClient(new WebViewClient() {
            @Override
            public void onReceivedSslError(WebView view, SslErrorHandler handler, SslError error) {
                super.onReceivedSslError(view, handler, error);

                AWalletAlertDialog aDialog = new AWalletAlertDialog(CommonWebActivity.this);
                aDialog.setTitle(R.string.title_dialog_error);
                aDialog.setIcon(AWalletAlertDialog.ERROR);
                aDialog.setMessage(R.string.ssl_cert_invalid);
                aDialog.setButtonText(R.string.dialog_approve);
                aDialog.setButtonListener(v -> {
                    handler.proceed();
                    aDialog.dismiss();
                });
                aDialog.setSecondaryButtonText(R.string.action_cancel);
                aDialog.setButtonListener(v -> {
                    handler.cancel();
                    aDialog.dismiss();
                });
                aDialog.show();
            }

            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                String[] prefixCheck = url.split(":");
                if (prefixCheck.length > 1) {
                    Intent intent;
                    switch (prefixCheck[0]) {
                        case C.DAPP_PREFIX_TELEPHONE:
                            intent = new Intent(Intent.ACTION_DIAL);
                            intent.setData(Uri.parse(url));
                            startActivity(Intent.createChooser(intent, "Call " + prefixCheck[1]));
                            return true;
                        case C.DAPP_PREFIX_MAILTO:
                            intent = new Intent(Intent.ACTION_SENDTO);
                            intent.setData(Uri.parse(url));
                            startActivity(Intent.createChooser(intent, "Email: " + prefixCheck[1]));
                            return true;
                        case C.DAPP_PREFIX_ALPHAWALLET:
                            if (prefixCheck[1].equals(C.DAPP_SUFFIX_RECEIVE)) {
//                                viewModel.showMyAddress(getContext());
                                return true;
                            }
                            break;
                        case C.DAPP_PREFIX_WALLETCONNECT://链接钱包授权
                            //start walletconnect

                            walletConnectSession = url;
                            viewModel.handleWalletConnect(CommonWebActivity.this, url, activeNetwork);

                            return true;
                        default:
                            break;
                    }
                }

                setUrlText(url);
                return false;
            }
        });

        web3.setOnSignMessageListener(this);
        web3.setOnSignPersonalMessageListener(this);
        web3.setOnSignTransactionListener(this);
        web3.setOnSignTypedMessageListener(this);
        web3.setOnEthCallListener(this);
        web3.setOnWalletAddEthereumChainObjectListener(this);
        web3.setOnWalletActionListener(this);

        if (loadOnInit != null) {
            web3.clearCache(true); //on restart with stored app, we usually need this
            web3.resetView();
            web3.loadUrl(Utils.formatUrl(loadOnInit));
            setUrlText(Utils.formatUrl(loadOnInit));
            loadOnInit = null;
        }
    }

    private void displayCloseWC() {
        handler.post(() -> {
            if (resultDialog != null && resultDialog.isShowing()) resultDialog.dismiss();
            resultDialog = new AWalletAlertDialog(CommonWebActivity.this);
            resultDialog.setIcon(WARNING);
            resultDialog.setTitle(R.string.title_wallet_connect);
            resultDialog.setMessage(getString(R.string.unsupported_walletconnect));
            resultDialog.setButtonText(R.string.button_ok);
            resultDialog.setButtonListener(v -> {
                resultDialog.dismiss();
            });
            resultDialog.show();
        });
    }

    public void reloadPage() {
        web3.resetView();
        web3.reload();
    }

    // Handles the requesting of the camera permission.
    private void requestCameraPermission(@NotNull PermissionRequest request) {
        final String[] requestedResources = request.getResources();
        for (String r : requestedResources) {
            if (r.equals(PermissionRequest.RESOURCE_VIDEO_CAPTURE)) {
                final String[] permissions = new String[]{Manifest.permission.CAMERA};
                requestPermissions(permissions, REQUEST_CAMERA_ACCESS);
            }
        }
    }

    // Handles the requesting of the fine location permission.
    // Note: If you intend allowing geo-location in your app you need to ask the permission.
    private void requestGeoPermission(String origin, GeolocationPermissions.Callback callback) {
        if (ContextCompat.checkSelfPermission(getApplicationContext(), Manifest.permission.ACCESS_FINE_LOCATION)
                != PackageManager.PERMISSION_GRANTED) {
            String[] permissions = new String[]{Manifest.permission.ACCESS_FINE_LOCATION};
            requestPermissions(permissions, REQUEST_FINE_LOCATION);
        } else {
            callback.invoke(origin, true, false);
        }
    }

    /*登录消息*/
    @Override
    public void onSignMessage(EthereumMessage message) {
        handleSignMessage(message);
    }

    /*签署个人信息*/
    @Override
    public void onSignPersonalMessage(EthereumMessage message) {
        handleSignMessage(message);
    }

    /*签署交易*/
    @Override
    public void onSignTransaction(Web3Transaction transaction, String url) {

        try {
            viewModel.updateGasPrice(activeNetwork.chainId);
            //TODO: Ensure we have received gas price before continuing
            //minimum for transaction to be valid: recipient and value or payload
            if ((confirmationDialog == null || !confirmationDialog.isShowing()) &&
                    (transaction.recipient.equals(Address.EMPTY) && transaction.payload != null) // Constructor
                    || (!transaction.recipient.equals(Address.EMPTY) && (transaction.payload != null || transaction.value != null))) // Raw or Function TX
            {
                Token token = viewModel.getTokenService().getTokenOrBase(activeNetwork.chainId, transaction.recipient.toString());

                confirmationDialog = new ActionSheetDialog(CommonWebActivity.this, transaction, token,
                        "", transaction.recipient.toString(), viewModel.getTokenService(), this);
                confirmationDialog.setURL(url);
                confirmationDialog.setCanceledOnTouchOutside(false);
                confirmationDialog.show();
                confirmationDialog.fullExpand();

                viewModel.calculateGasEstimate(wallet, Numeric.hexStringToByteArray(transaction.payload),
                        activeNetwork.chainId, transaction.recipient.toString(), new BigDecimal(transaction.value), transaction.gasLimit)
                        .subscribeOn(Schedulers.io())
                        .observeOn(AndroidSchedulers.mainThread())
                        .subscribe(estimate -> confirmationDialog.setGasEstimate(estimate),
                                Throwable::printStackTrace)
                        .isDisposed();

                return;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        onInvalidTransaction(transaction);
        web3.onSignCancel(transaction.leafPosition);
    }


    private void onInvalidTransaction(Web3Transaction transaction) {
        if (CommonWebActivity.this == null) return;
        resultDialog = new AWalletAlertDialog(CommonWebActivity.this);
        resultDialog.setIcon(AWalletAlertDialog.ERROR);
        resultDialog.setTitle(getString(R.string.invalid_transaction));

        if (transaction.recipient.equals(Address.EMPTY) && (transaction.payload == null || transaction.value != null)) {
            resultDialog.setMessage(getString(R.string.contains_no_recipient));
        } else if (transaction.payload == null && transaction.value == null) {
            resultDialog.setMessage(getString(R.string.contains_no_value));
        } else {
            resultDialog.setMessage(getString(R.string.contains_no_data));
        }
        resultDialog.setButtonText(R.string.button_ok);
        resultDialog.setButtonListener(v -> {
            resultDialog.dismiss();
        });
        resultDialog.setCancelable(true);
        resultDialog.show();
    }

    /*签名信息*/
    @Override
    public void onSignTypedMessage(EthereumTypedMessage message) {
        if (message.getPrehash() == null || message.getMessageType() == SignMessageType.SIGN_ERROR) {
            web3.onSignCancel(message.getCallbackId());
        } else {
            handleSignMessage(message);
        }
    }

    /*eth监听*/
    @Override
    public void onEthCall(Web3Call call) {
        Single.fromCallable(() -> {
            //let's make the call
            Web3j web3j = getWeb3jService(activeNetwork.chainId);
            //construct call
            org.web3j.protocol.core.methods.request.Transaction transaction
                    = createEthCallTransaction(wallet.address, call.to.toString(), call.payload);
            return web3j.ethCall(transaction, call.blockParam).send();
        }).map(EthCall::getValue)
                .subscribeOn(Schedulers.io())
                .observeOn(AndroidSchedulers.mainThread())
                .subscribe(result -> web3.onCallFunctionSuccessful(call.leafPosition, result),
                        error -> web3.onCallFunctionError(call.leafPosition, error.getMessage()))
                .isDisposed();
    }

    public static Web3j getWeb3jService(long chainId) {
        OkHttpClient okClient = new OkHttpClient.Builder()
                .connectTimeout(10, TimeUnit.SECONDS)
                .readTimeout(10, TimeUnit.SECONDS)
                .writeTimeout(10, TimeUnit.SECONDS)
                .retryOnConnectionFailure(false)
                .build();
        AWHttpService publicNodeService = new AWHttpService(EthereumNetworkRepository.getNodeURLByNetworkId(chainId), EthereumNetworkRepository.getSecondaryNodeURL(chainId), okClient, false);
        EthereumNetworkRepository.addRequiredCredentials(chainId, publicNodeService);
        return Web3j.build(publicNodeService);
    }

    @Override
    public void onWalletAddEthereumChainObject(long callbackId, WalletAddEthereumChainObject chainObj) {
        // read chain value
        long chainId = chainObj.getChainId();
        final NetworkInfo info = viewModel.getNetworkInfo(chainId);

        if (forceChainChange != 0 || getContext() == null) {
            return; //No action if chain change is forced
        }

        // handle unknown network
        if (info == null) {
            // show add custom chain dialog
            addCustomChainDialog = new AddEthereumChainPrompt(CommonWebActivity.this, chainObj, chainObject -> {
                viewModel.addCustomChain(chainObject);
                loadNewNetwork(chainObj.getChainId());
                addCustomChainDialog.dismiss();
            });
            addCustomChainDialog.show();
        } else {
            changeChainRequest(callbackId, info);
        }
    }

    private void changeChainRequest(long callbackId, NetworkInfo info) {
        //Don't show dialog if network doesn't need to be changed or if already showing
        if ((activeNetwork != null && activeNetwork.chainId == info.chainId) || (chainSwapDialog != null && chainSwapDialog.isShowing())) {
            web3.onWalletActionSuccessful(callbackId, null);
            return;
        }

        //if we're switching between mainnet and testnet we need to pop open the 'switch to testnet' dialog (class TestNetDialog)
        // - after the user switches to testnet, go straight to switching the network (loadNewNetwork)
        // - if user is switching form testnet to mainnet, simply add the title below

        // at this stage, we know if it's testnet or not
        if (!info.hasRealValue() && (activeNetwork != null && activeNetwork.hasRealValue())) {
            TestNetDialog testnetDialog = new TestNetDialog(CommonWebActivity.this, info.chainId, this);
            testnetDialog.show();
        } else {
            //go straight to chain change dialog
            showChainChangeDialog(callbackId, info);
        }
    }

    /**
     * This will pop the ActionSheetDialog to request a chain change, with appropriate warning
     * if switching between mainnets and testnets
     *
     * @param callbackId
     * @param newNetwork
     */
    private void showChainChangeDialog(long callbackId, NetworkInfo newNetwork) {
        Token baseToken = viewModel.getTokenService().getTokenOrBase(newNetwork.chainId, wallet.address);
        String message = getString(R.string.request_change_chain, newNetwork.name, String.valueOf(newNetwork.chainId));
        if (newNetwork.hasRealValue() && !activeNetwork.hasRealValue()) {
            message += "\n" + getString(R.string.warning_switch_to_main);
        } else if (!newNetwork.hasRealValue() && activeNetwork.hasRealValue()) {
            message += "\n" + getString(R.string.warning_switching_to_test);
        }

        confirmationDialog = new ActionSheetDialog(CommonWebActivity.this, this, R.string.switch_chain_request, message, R.string.switch_and_reload,
                callbackId, baseToken);

        confirmationDialog.setCanceledOnTouchOutside(true);
        confirmationDialog.show();
        confirmationDialog.fullExpand();
    }


    public void loadNewNetwork(long newNetworkId) {
        if (activeNetwork == null || activeNetwork.chainId != newNetworkId) {
            viewModel.setNetwork(newNetworkId);
            onNetworkChanged(viewModel.getNetworkInfo(newNetworkId));
        }
        //refresh URL page
        reloadPage();
    }

    @Override
    public void onRequestAccounts(long callbackId) {
        //TODO: Pop open dialog which asks user to confirm they wish to expose their address to this dapp eg:
        //title = "Request Account Address"
        //message = "${dappUrl} requests your address. \nAuthorise?"
        //if user authorises, then do an evaluateJavascript to populate the web3.eth.getCoinbase with the current address,
        //and additionally add a window.ethereum.setAddress function in init.js to set up addresses
        //together with this update, also need to track which websites have been given permission, and if they already have it (can probably get away with using SharedPrefs)
        //then automatically perform with step without a dialog (ie same as it does currently)
        web3.onWalletActionSuccessful(callbackId, "[" + wallet.address + "]");
    }

    //EIP-3326
    /*切换链*/
    @Override
    public void onWalletSwitchEthereumChain(long callbackId, WalletAddEthereumChainObject chainObj) {
        //request user to change chains
        long chainId = chainObj.getChainId();

        AlertDialog.Builder builder = new AlertDialog.Builder(CommonWebActivity.this)
                .setTitle(R.string.unknown_network_title)
                .setMessage(getString(R.string.unknown_network, String.valueOf(chainId)))
                .setPositiveButton(R.string.dialog_ok, (d, w) -> {
                    if (chainSwapDialog != null && chainSwapDialog.isShowing())
                        chainSwapDialog.dismiss();
                })
                .setCancelable(true);

        chainSwapDialog = builder.create();
        chainSwapDialog.show();
    }


    // this is called when the signing is approved by the user (e.g. fingerprint / PIN)
    @Override
    public void gotAuthorisation(boolean gotAuth) {
        if (confirmationDialog != null && confirmationDialog.isShowing()) {
            confirmationDialog.dismiss();
        }
    }

    @Override
    public void gotAuthorisationForSigning(boolean gotAuth, Signable messageToSign) {
        if (gotAuth) {
            viewModel.completeAuthentication(SIGN_DATA);
            viewModel.signMessage(messageToSign, dAppFunction);
        } else {
            web3.onSignCancel(messageToSign.getCallbackId());
        }
    }

    @Override
    public void cancelAuthentication() {

    }

    private void handleSignMessage(Signable message) {
        dAppFunction = new DAppFunction() {
            @Override
            public void DAppError(Throwable error, Signable message) {
                web3.onSignCancel(message.getCallbackId());
                confirmationDialog.dismiss();
            }

            @Override
            public void DAppReturn(byte[] data, Signable message) {
                String signHex = Numeric.toHexString(data);
                Timber.d("Initial Msg: %s", message.getMessage());
                web3.onSignMessageSuccessful(message, signHex);

                confirmationDialog.success();
            }
        };

        if (confirmationDialog == null || !confirmationDialog.isShowing()) {
            confirmationDialog = new ActionSheetDialog(CommonWebActivity.this, CommonWebActivity.this, this, message);
            confirmationDialog.setCanceledOnTouchOutside(false);
            confirmationDialog.show();
            confirmationDialog.fullExpand();
        }
    }

    @Override
    public void getAuthorisation(SignAuthenticationCallback callback) {
        viewModel.getAuthorisation(wallet, this, callback);
    }

    @Override
    public void sendTransaction(Web3Transaction finalTx) {
        final SendTransactionInterface callback = new SendTransactionInterface() {
            @Override
            public void transactionSuccess(Web3Transaction web3Tx, String hashData) {
                confirmationDialog.transactionWritten(hashData);
                web3.onSignTransactionSuccessful(web3Tx, hashData);
            }

            @Override
            public void transactionError(long callbackId, Throwable error) {
                confirmationDialog.dismiss();
                txError(error);
                web3.onSignCancel(callbackId);
            }
        };

        viewModel.sendTransaction(finalTx, activeNetwork.chainId, callback);
    }

    public static final int ERROR = R.drawable.ic_error;

    //Transaction failed to be sent
    private void txError(Throwable throwable) {
        if (resultDialog != null && resultDialog.isShowing()) resultDialog.dismiss();
        resultDialog = new AWalletAlertDialog(CommonWebActivity.this);
        resultDialog.setIcon(ERROR);
        resultDialog.setTitle(R.string.error_transaction_failed);
        resultDialog.setMessage(throwable.getMessage());
        resultDialog.setButtonText(R.string.button_ok);
        resultDialog.setButtonListener(v -> {
            resultDialog.dismiss();
        });
        resultDialog.show();

        if (confirmationDialog != null && confirmationDialog.isShowing())
            confirmationDialog.dismiss();
    }

    @Override
    public void dismissed(String txHash, long callbackId, boolean actionCompleted) {
        if (!actionCompleted) {
            //actionsheet dismissed before completing signing.
            web3.onSignCancel(callbackId);
        }
    }

    @Override
    public void notifyConfirm(String mode) {
//        if (getActivity() != null) ((HomeActivity)getActivity()).useActionSheet(mode);
    }

    //导入验证钱包
    @Override
    public void walletValidated(String data, KeyEncodingType type, KeyService.AuthenticationLevel level) {
        switch (type) {
            case SEED_PHRASE_KEY:
                viewModel.onSeed(data, level);
                break;
            case RAW_HEX_KEY:
                String value = walletInfo.getPrivateKey();
                final Matcher matcher = findKey.matcher(value);
                if (matcher.find()) {
                    value = matcher.group(2);
                }
                SpUtils.put(CommonWebActivity.this,"key",data);
                viewModel.onPrivateKey(value, data, level);
                break;
        }
    }

    @Override
    public void onTestNetDialogClosed() {

    }

    @Override
    public void onTestNetDialogConfirmed(long chainId) {
        viewModel.setMainNetsSelected(false);
        //proceed with new network change, no need to pop a second dialog, we are swapping from a main net to a testnet
        NetworkInfo newNetwork = viewModel.getNetworkInfo(chainId);
        if (newNetwork != null) {
            loadNewNetwork(chainId);
        }
    }
}
