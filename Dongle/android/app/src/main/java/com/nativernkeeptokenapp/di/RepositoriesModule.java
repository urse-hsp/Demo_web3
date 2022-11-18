package com.nativernkeeptokenapp.di;

import static com.nativernkeeptokenapp.service.KeystoreAccountService.KEYSTORE_FOLDER;

import android.content.Context;

import com.nativernkeeptokenapp.repository.EthereumNetworkRepository;
import com.nativernkeeptokenapp.repository.EthereumNetworkRepositoryType;
import com.nativernkeeptokenapp.repository.OnRampRepository;
import com.nativernkeeptokenapp.repository.OnRampRepositoryType;
import com.nativernkeeptokenapp.repository.PreferenceRepositoryType;
import com.nativernkeeptokenapp.repository.SharedPreferenceRepository;
import com.nativernkeeptokenapp.repository.TokenLocalSource;
import com.nativernkeeptokenapp.repository.TokenRepository;
import com.nativernkeeptokenapp.repository.TokenRepositoryType;
import com.nativernkeeptokenapp.repository.TokensRealmSource;
import com.nativernkeeptokenapp.repository.TransactionLocalSource;
import com.nativernkeeptokenapp.repository.TransactionRepository;
import com.nativernkeeptokenapp.repository.TransactionRepositoryType;
import com.nativernkeeptokenapp.repository.TransactionsRealmCache;
import com.nativernkeeptokenapp.repository.WalletDataRealmSource;
import com.nativernkeeptokenapp.repository.WalletRepository;
import com.nativernkeeptokenapp.repository.WalletRepositoryType;
import com.nativernkeeptokenapp.service.AccountKeystoreService;
import com.nativernkeeptokenapp.service.AlphaWalletService;
import com.nativernkeeptokenapp.service.AnalyticsService;
import com.nativernkeeptokenapp.service.AnalyticsServiceType;
import com.nativernkeeptokenapp.service.AssetDefinitionService;
import com.nativernkeeptokenapp.service.GasService;
import com.nativernkeeptokenapp.service.KeyService;
import com.nativernkeeptokenapp.service.KeystoreAccountService;
import com.nativernkeeptokenapp.service.NotificationService;
import com.nativernkeeptokenapp.service.OpenSeaService;
import com.nativernkeeptokenapp.service.RealmManager;
import com.nativernkeeptokenapp.service.TickerService;
import com.nativernkeeptokenapp.service.TokensService;
import com.google.gson.Gson;
import com.nativernkeeptokenapp.service.TransactionsNetworkClient;
import com.nativernkeeptokenapp.service.TransactionsNetworkClientType;
import com.nativernkeeptokenapp.service.TransactionsService;

import java.io.File;

import javax.inject.Singleton;

import dagger.Module;
import dagger.Provides;
import dagger.hilt.InstallIn;
import dagger.hilt.android.qualifiers.ApplicationContext;
import dagger.hilt.components.SingletonComponent;
import okhttp3.OkHttpClient;

@Module
@InstallIn(SingletonComponent.class)
public class RepositoriesModule {
	@Singleton
	@Provides
	PreferenceRepositoryType providePreferenceRepository(@ApplicationContext Context context) {
		return new SharedPreferenceRepository(context);
	}

	@Singleton
	@Provides
    AccountKeystoreService provideAccountKeyStoreService(@ApplicationContext Context context, KeyService keyService) {
        File file = new File(context.getFilesDir(), KEYSTORE_FOLDER);
		return new KeystoreAccountService(file, context.getFilesDir(), keyService);
	}

	@Singleton
    @Provides
	TickerService provideTickerService(OkHttpClient httpClient, PreferenceRepositoryType sharedPrefs, TokenLocalSource localSource) {
		return new TickerService(httpClient, sharedPrefs, localSource);
    }

	@Singleton
	@Provides
	EthereumNetworkRepositoryType provideEthereumNetworkRepository(
            PreferenceRepositoryType preferenceRepository,
			@ApplicationContext Context context) {
		return new EthereumNetworkRepository(preferenceRepository, context);
	}

	@Singleton
	@Provides
	OnRampRepositoryType provideOnRampRepository(@ApplicationContext Context context, AnalyticsServiceType analyticsServiceType) {
		return new OnRampRepository(context, analyticsServiceType);
	}

	@Singleton
    @Provides
    TransactionLocalSource provideTransactionInDiskCache(RealmManager realmManager) {
        return new TransactionsRealmCache(realmManager);
    }


	@Singleton
    @Provides
    TokenRepositoryType provideTokenRepository(
            EthereumNetworkRepositoryType ethereumNetworkRepository,
            TokenLocalSource tokenLocalSource,
			OkHttpClient httpClient,
			@ApplicationContext Context context,
			TickerService tickerService) {
	    return new TokenRepository(
	            ethereumNetworkRepository,
				tokenLocalSource,
				httpClient,
				context,
				tickerService);
    }

    @Singleton
    @Provides
    TokenLocalSource provideRealmTokenSource(RealmManager realmManager, EthereumNetworkRepositoryType ethereumNetworkRepository) {
	    return new TokensRealmSource(realmManager, ethereumNetworkRepository);
    }


	@Singleton
	@Provides
	TokensService provideTokensService(EthereumNetworkRepositoryType ethereumNetworkRepository,
									   TokenRepositoryType tokenRepository,
									   TickerService tickerService,
									   OpenSeaService openseaService,
									   AnalyticsServiceType analyticsService) {
		return new TokensService(ethereumNetworkRepository, tokenRepository, tickerService, openseaService, analyticsService);
	}



	@Singleton
	@Provides
    GasService provideGasService2(EthereumNetworkRepositoryType ethereumNetworkRepository, OkHttpClient client, RealmManager realmManager) {
		return new GasService(ethereumNetworkRepository, client, realmManager);
	}

	@Singleton
	@Provides
	OpenSeaService provideOpenseaService() {
		return new OpenSeaService();
	}

	@Singleton
	@Provides
    AlphaWalletService provideFeemasterService(OkHttpClient okHttpClient,
                                               TransactionRepositoryType transactionRepository,
                                               Gson gson) {
		return new AlphaWalletService(okHttpClient, transactionRepository, gson);
	}

	@Singleton
	@Provides
    NotificationService provideNotificationService(@ApplicationContext Context ctx) {
		return new NotificationService(ctx);
	}

	@Singleton
	@Provides
    AssetDefinitionService provideAssetDefinitionService(OkHttpClient okHttpClient, @ApplicationContext Context ctx, NotificationService notificationService, RealmManager realmManager,
														 TokensService tokensService, TokenLocalSource tls, TransactionRepositoryType trt,
														 AlphaWalletService alphaService) {
		return new AssetDefinitionService(okHttpClient, ctx, notificationService, realmManager, tokensService, tls, trt, alphaService);
	}

	@Singleton
	@Provides
	KeyService provideKeyService(@ApplicationContext Context ctx, AnalyticsServiceType analyticsService) {
		return new KeyService(ctx, analyticsService);
	}

	@Singleton
	@Provides
	TransactionRepositoryType provideTransactionRepository(
			EthereumNetworkRepositoryType networkRepository,
			AccountKeystoreService accountKeystoreService,
			TransactionLocalSource inDiskCache,
			TransactionsService transactionsService) {
		return new TransactionRepository(
				networkRepository,
				accountKeystoreService,
				inDiskCache,
				transactionsService);
	}
	@Singleton
	@Provides
	AnalyticsServiceType provideAnalyticsService(@ApplicationContext Context ctx) {
		return new AnalyticsService(ctx);
	}

	@Singleton
	@Provides
	TransactionsService provideTransactionsService(TokensService tokensService,
												   EthereumNetworkRepositoryType ethereumNetworkRepositoryType,
												   TransactionsNetworkClientType transactionsNetworkClientType,
												   TransactionLocalSource transactionLocalSource) {
		return new TransactionsService(tokensService, ethereumNetworkRepositoryType, transactionsNetworkClientType, transactionLocalSource);
	}

	@Singleton
	@Provides
	TransactionsNetworkClientType provideBlockExplorerClient(
			OkHttpClient httpClient,
			Gson gson,
			RealmManager realmManager) {
		return new TransactionsNetworkClient(httpClient, gson, realmManager);
	}

	@Singleton
	@Provides
	WalletRepositoryType provideWalletRepository(
			PreferenceRepositoryType preferenceRepositoryType,
			AccountKeystoreService accountKeystoreService,
			EthereumNetworkRepositoryType networkRepository,
			WalletDataRealmSource walletDataRealmSource,
			KeyService keyService) {
		return new WalletRepository(
				preferenceRepositoryType, accountKeystoreService, networkRepository, walletDataRealmSource, keyService);
	}

	@Singleton
	@Provides
	WalletDataRealmSource provideRealmWalletDataSource(RealmManager realmManager) {
		return new WalletDataRealmSource(realmManager);
	}

}
