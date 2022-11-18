package com.nativernkeeptokenapp.di;

import com.nativernkeeptokenapp.interact.GenericWalletInteract;
import com.nativernkeeptokenapp.repository.WalletRepositoryType;

import dagger.Module;
import dagger.Provides;
import dagger.hilt.InstallIn;
import dagger.hilt.android.components.ServiceComponent;


@Module
@InstallIn(ServiceComponent.class)
/** A module to provide dependencies to services */
public class ServiceModule {

    @Provides
    GenericWalletInteract provideGenericWalletInteract(WalletRepositoryType walletRepository)
    {
        return new GenericWalletInteract(walletRepository);
    }

}
