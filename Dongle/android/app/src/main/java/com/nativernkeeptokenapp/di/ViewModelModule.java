package com.nativernkeeptokenapp.di;

import com.nativernkeeptokenapp.interact.CreateTransactionInteract;
import com.nativernkeeptokenapp.interact.FindDefaultNetworkInteract;
import com.nativernkeeptokenapp.interact.GenericWalletInteract;
import com.nativernkeeptokenapp.interact.ImportWalletInteract;
import com.nativernkeeptokenapp.interact.SetDefaultWalletInteract;
import com.nativernkeeptokenapp.repository.CurrencyRepositoryType;
import com.nativernkeeptokenapp.repository.EthereumNetworkRepositoryType;
import com.nativernkeeptokenapp.repository.PreferenceRepositoryType;
import com.nativernkeeptokenapp.repository.TokenRepositoryType;
import com.nativernkeeptokenapp.repository.TransactionRepositoryType;
import com.nativernkeeptokenapp.repository.WalletRepositoryType;

import dagger.Module;
import dagger.Provides;
import dagger.hilt.InstallIn;
import dagger.hilt.android.components.ViewModelComponent;

@Module
@InstallIn(ViewModelComponent.class)
/** Module for providing dependencies to viewModels.
 * All bindings of modules from BuildersModule is shifted here as they were injected in activity for ViewModelFactory but not needed in Hilt
 * */
public class ViewModelModule {


    @Provides
    SetDefaultWalletInteract provideSetDefaultAccountInteract(WalletRepositoryType accountRepository) {
        return new SetDefaultWalletInteract(accountRepository);
    }


    @Provides
    CreateTransactionInteract provideCreateTransactionInteract(TransactionRepositoryType transactionRepository) {
        return new CreateTransactionInteract(transactionRepository);
    }

    @Provides
    GenericWalletInteract provideGenericWalletInteract(WalletRepositoryType walletRepository) {
        return new GenericWalletInteract(walletRepository);
    }


    @Provides
    FindDefaultNetworkInteract provideFindDefaultNetworkInteract(
            EthereumNetworkRepositoryType networkRepository) {
        return new FindDefaultNetworkInteract(networkRepository);
    }


    @Provides
    ImportWalletInteract provideImportWalletInteract(
            WalletRepositoryType walletRepository) {
        return new ImportWalletInteract(walletRepository);
    }
}
