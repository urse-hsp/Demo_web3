import React, { useState, useEffect, useCallback } from 'react'
import { createContainer } from 'unstated-next'
import detectEthereumProvider from '@metamask/detect-provider'
import chains from '../../config/network.chains.json'
import Web3 from 'web3'
import { ethers } from 'ethers'
import Storage from './storage'

const useWeb3Hook = (): any => {
  // Web3
  const [web3, setWeb3] = useState<any>(null)
  const [provider, setProvider] = useState<any>(null)
  const [currentAccount, setCurrentAccount] = useState<any>(null)
  const { walletType, networkId, setNetworkId } = Storage.useContainer()

  const handleConnect = useCallback(
    async (network_id: number, wallet_type: string, auto_connect?: boolean) => {
      // 限制支持链
      let chainsInfo = chains.find((item: any) => {
        return item.networkId === Number(network_id)
      })
      if (!chainsInfo) {
        alert(`不支持的网络，需要切换到支持的网络:${network_id}`)
        return true
      }

      // 匹配对应钱包Provider
      try {
        let providerInstance: any = null // 钱包实例 provider
        switch (wallet_type) {
          case 'MetaMask':
            providerInstance = await detectEthereumProvider() // eth实例 window.ethereum
            break
          default:
            providerInstance = await detectEthereumProvider()
            break
        }

        let account = []
        // 解锁 MateMask
        if (providerInstance) {
          const accounts = await providerInstance.request({
            method: 'eth_requestAccounts',
          }) //
          console.log(accounts, 'accountslist')
          account = accounts[0]
        } else {
          if (!auto_connect) {
            alert(`Please install ${wallet_type} !`)
            return 'Please install'
          }
          return
        }

        // 切换网络
        const walletChainId = await providerInstance.request({
          method: 'eth_chainId',
        })
        let providerChainId =
          walletChainId.toString().indexOf('0x') === 0
            ? parseInt(walletChainId, 16)
            : walletChainId

        // Change to current network/更改为当前网络
        if (Number(network_id) !== providerChainId) {
          try {
            await providerInstance.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: `0x${network_id.toString(16)}` }],
            })
          } catch (switchError: any) {
            console.error('wallet_switchEthereumChain', switchError)
            // This error code indicates that the chain has not been added to MetaMask./此错误代码表示链尚未添加到MetaMask。
            if (switchError.code === 4902) {
              try {
                let params = {
                  chainId: `0x${network_id.toString(16)}`,
                  chainName: chainsInfo.name,
                  nativeCurrency: chainsInfo.nativeCurrency,
                  rpcUrls: chainsInfo.rpc,
                  blockExplorerUrls: [chainsInfo.explorers[0].url],
                }
                await providerInstance.request({
                  method: 'wallet_addEthereumChain',
                  params: [params],
                })
              } catch (addError: any) {
                console.log(666666)
                alert(addError.message)
                return addError.message
              }
            } else if (switchError.code === 4001) {
              return alert(`❌ 你拒绝了 "切换网络" 的请求`)
            } else if (switchError.code === -32002) {
              return alert(
                `😊 已经发送了 "切换网络" 的请求，\n请动动你发财的小手在钱包内确认一下。`
              )
            } else {
              alert(switchError.message)
              return switchError.message
            }
          }
        }

        let web3instance, Account
        if (false) {
          // web3.js
          web3instance = new Web3(providerInstance) // web3实例
          Account = web3instance.utils.toChecksumAddress(account)
        } else {
          // ethers.js
          // const provider = new ethers.providers.Web3Provider(window.ethereum)
          web3instance = new ethers.providers.Web3Provider(providerInstance) // ethers
          // Account = ethers.utils.getAddress(account)
          Account = await web3instance._getAddress(account)
        }

        // Set
        setWeb3(web3instance)
        setProvider(providerInstance)
        setCurrentAccount(Account)

        // 合约实例
        // let CONTRACT_ACCOUNT = CONFIG.networks[network_id].contracts
        // const basicContract = new web3instance.eth.Contract(
        //   masterChefABI,
        //   CONTRACT_ACCOUNT.masterChef  // 0x4485c1face2664b18EA8dB0A9c2D58AA73c9fDAf
        // )
        // const tokenMappingContract = new web3instance.eth.Contract(
        //   tokenMapping,
        //   CONTRACT_ACCOUNT.mappingToken // 0x76A2AAa066201bfB6d7317752C544ED7A5d8233a
        // )

        return null
      } catch (e: any) {
        // setWalletType('')
        let messgae = e.message
        switch (e.code) {
          case -32002:
            messgae = '请确认您在MetaMask中的操作' //'Please confirm your operation in MetaMask'
            break
          default:
            break
        }
        console.error('最终错误', e)
        alert(messgae)
        return messgae
      }
    },
    []
  )

  const handleDisconnect = useCallback(async () => {
    setWeb3(null)
    setProvider(null)
    setCurrentAccount(null)
  }, [])

  useEffect(() => {
    if (!networkId || !walletType) {
      return
    }
    handleConnect(networkId, walletType, true)
  }, [networkId, walletType])

  // 监听登录
  useEffect(() => {
    if (!provider || !provider.on) return
    provider.on('accountsChanged', (_accounts: any, a: any, b: any) => {
      // 处理新帐户或缺少新帐户（_A）。/ Handle the new _accounts, or lack thereof.
      // “_accounts”将始终是一个数组，但它可以是空的。/ "_accounts" will always be an array, but it can be empty.
      if (!_accounts.length) {
        return
      }
      if (currentAccount === _accounts[0]) {
        return
      }
      setCurrentAccount(_accounts[0])
      window.location.reload()
    })

    // 链chainId更改 / Subscribe to chainId change
    // chainId doc: https://chainid.network/
    provider.on('chainChanged', async (chainId: any) => {
      // Handle the new chain.
      // Correctly handling chain changes can be complicated.
      // We recommend reloading the page unless you have good reason not to.
      const chainIdValue =
        chainId.toString().indexOf('0x') === 0 ? parseInt(chainId, 16) : chainId
      let network: any = chains.find((element: any) => {
        return element.chainId === Number(chainIdValue)
      })
      setNetworkId(network.networkId)
      window.location.reload()
    })

    // provider.on("network", (newNetwork, oldNetwork) => {
    //     // 当 Provider 建立初始连接时，它会 emits 一个 "network" 事件，并且 oldNetwork 为空
    //     // 一旦 oldNetwork 不为空，就表示网络发生了变化
    //     if (oldNetwork) {
    //         window.location.reload();
    //     }
    // });

    // 订阅提供商断开连接 / Subscribe to provider disconnection
    provider.once('disconnect', async () => {
      await handleDisconnect()
    })
  }, [provider, currentAccount, handleDisconnect, setNetworkId])

  return {
    web3,
    provider,
    account: currentAccount,
    active: !!currentAccount,
    async connect(chain_id: number, wallet_type: string) {
      return await handleConnect(chain_id, wallet_type)
    },
    async disconnect() {
      return await handleDisconnect()
    },
  }
}

export default createContainer(useWeb3Hook)
