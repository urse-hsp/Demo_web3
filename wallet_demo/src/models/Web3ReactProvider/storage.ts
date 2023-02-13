import { useState } from 'react'
import { createContainer } from 'unstated-next'
import { storage } from '../../utils'
import config from '../../config'

const defaultStates: any = {
  NETWORK_ID: storage('NETWORK_ID') || config.DEFAULT_NETWORK_ID,
  WALLET_TYPE: storage('WALLET_TYPE') || config.DEFAULT_WALLET_TYPE,
}
function useStorage(customInitialStates = {}) {
  const initStates = Object.assign({}, defaultStates, customInitialStates)
  const [networkId, setNetworkId] = useState<number>(initStates.NETWORK_ID)
  const [walletType, setWalletType] = useState(initStates.WALLET_TYPE)
  // const [network, setNetwork] = useState(CONFIG.networks[initStates.NETWORK_ID])

  return {
    networkId,
    walletType,
    // network,
    setNetworkId: (payload: any) => {
      storage('NETWORK_ID', payload)
      setNetworkId(payload)
      // config.NETWORK_ID = payload
      // setNetwork(CONFIG.networks[payload])
    },
    setWalletType: (payload: any) => {
      storage('WALLET_TYPE', payload)
      setWalletType(payload)
      // config.WALLET_TYPE = payload
    },
  }
}

export default createContainer(useStorage)
