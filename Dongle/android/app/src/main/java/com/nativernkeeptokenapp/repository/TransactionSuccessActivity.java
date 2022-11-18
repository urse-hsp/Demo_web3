package com.nativernkeeptokenapp.repository;

import androidx.annotation.Nullable;
import android.content.Intent;
import android.os.Bundle;
import com.nativernkeeptokenapp.BaseActivity;
import com.nativernkeeptokenapp.C;
import com.nativernkeeptokenapp.R;
import com.nativernkeeptokenapp.entity.StandardFunctionInterface;
import com.nativernkeeptokenapp.widget.CopyTextView;
import com.nativernkeeptokenapp.widget.FunctionButtonBar;

import java.util.ArrayList;
import java.util.Collections;

public class TransactionSuccessActivity extends BaseActivity implements StandardFunctionInterface
{
    private String transactionHash;

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_transaction_success);

        transactionHash = getIntent().getStringExtra(C.EXTRA_TXHASH);
        CopyTextView hashText = findViewById(R.id.tx_hash);
        hashText.setText(transactionHash);

        toolbar();

        setTitle(getString(R.string.empty));

        FunctionButtonBar functionBar = findViewById(R.id.layoutButtons);
        functionBar.setupFunctions(this, new ArrayList<>(Collections.singletonList(R.string.action_show_tx_details)));
        functionBar.revealButtons();
    }

    @Override
    public void handleClick(String action, int actionId)
    {
        finish();
    }
}