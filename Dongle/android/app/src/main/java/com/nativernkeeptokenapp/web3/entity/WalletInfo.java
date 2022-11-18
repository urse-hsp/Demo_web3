package com.nativernkeeptokenapp.web3.entity;

import org.web3j.abi.datatypes.Int;

import java.util.List;

public class WalletInfo {

    private SigningKey signingKey;


    public SigningKey getSigningKey() {
        return signingKey;
    }

    public void setSigningKey(SigningKey signingKey) {
        this.signingKey = signingKey;
    }

    public class SigningKey{
        private String address;
        private String mnemonic;
        private KeyPair keyPair;

        public String getMnemonic() {
            return mnemonic;
        }

        public void setMnemonic(String mnemonic) {
            this.mnemonic = mnemonic;
        }

        public String getAddress() {
            return address;
        }

        public void setAddress(String address) {
            this.address = address;
        }

        public KeyPair getKeyPair() {
            return keyPair;
        }

        public void setKeyPair(KeyPair keyPair) {
            this.keyPair = keyPair;
        }

        public class KeyPair {
            private String compressedPublicKey;
            private String privateKey;
            private String publicKey;
            private List<Integer> publicKeyBytes;
            private String mnemonic;
            private String path;

            public String getCompressedPublicKey() {
                return compressedPublicKey;
            }

            public void setCompressedPublicKey(String compressedPublicKey) {
                this.compressedPublicKey = compressedPublicKey;
            }

            public String getPrivateKey() {
                return privateKey;
            }

            public void setPrivateKey(String privateKey) {
                this.privateKey = privateKey;
            }

            public String getPublicKey() {
                return publicKey;
            }

            public void setPublicKey(String publicKey) {
                this.publicKey = publicKey;
            }

            public List<Integer> getPublicKeyBytes() {
                return publicKeyBytes;
            }

            public void setPublicKeyBytes(List<Integer> publicKeyBytes) {
                this.publicKeyBytes = publicKeyBytes;
            }

            public String getMnemonic() {
                return mnemonic;
            }

            public void setMnemonic(String mnemonic) {
                this.mnemonic = mnemonic;
            }

            public String getPath() {
                return path;
            }

            public void setPath(String path) {
                this.path = path;
            }
        }
    }

}
