import { useState } from 'react'
import { createContainer } from 'unstated-next'
import { storage } from '../../utils'
import config from '../../config'

const lpsId = {
  data: [
    {
      lpToken: '0x4FF286F0B97c2c578f35f99adbe3542fd14f042C',
      pid: 0,
      name: 'FLY Staking',
    },
    {
      lpToken: '0x3725c9892ef29044BCef2D7B8790536cF8005d93',
      pid: 1,
      name: 'FIBO-FUSD LP',
    },
    {
      lpToken: '0x3368c65c435937FC4748920BFCAC43A33054D9d7',
      pid: 2,
      name: 'FLY-FIBO LP',
    },

    // TODO: 这里需要按照 ChainId 来写配置
    // OK Test
    {
      lpToken: '0x9e95F05ff5E6513DE4b613D5511A9C14de2356Cb',
      pid: 0,
      name: 'XX Staking',
    },
    {
      lpToken: '0xE63d2bc2945689126C514A8497b0c04E5C9f8446',
      pid: 1,
      name: 'KK-EMO LP',
    },
  ],
}
const keys: any = {
  LPS_ID: lpsId,
}
const keyInit: any = {}
Object.keys(keys).map((key) => {
  const storageInfo = storage(key)
  keyInit[key] = storageInfo || keys[key]
})

const defaultStates = {
  NETWORK_ID: storage('NETWORK_ID') || config.DEFAULT_NETWORK_ID,
  WALLET_TYPE: storage('WALLET_TYPE') || config.DEFAULT_WALLET_TYPE,
}
function useStorage(customInitialStates = {}) {
  const initStates = Object.assign({}, defaultStates, customInitialStates)
  const [networkId, setNetworkId] = useState(initStates.NETWORK_ID)
  const [walletType, setWalletType] = useState(initStates.WALLET_TYPE)
  // const [network, setNetwork] = useState(CONFIG.networks[initStates.NETWORK_ID])

  // create
  const [global, setGlobal] = useState(keyInit)

  return {
    networkId,
    walletType,
    // network,
    // setNetworkId: (payload) => {
    //   storage('NETWORK_ID', payload)
    //   CONFIG.NETWORK_ID = payload
    //   setNetworkId(payload)
    //   setNetwork(CONFIG.networks[payload])
    // },
    // setWalletType: (payload) => {
    //   storage('WALLET_TYPE', payload)
    //   CONFIG.WALLET_TYPE = payload
    //   setWalletType(payload)
    // },
    global,
    // setGlobal: (key, value) => {
    //   const temp = {}
    //   if (typeof keys[key] === 'object') {
    //     temp[key] = JSON.stringify(value)
    //     storage(key, JSON.stringify(value))
    //     setGlobal(Object.assign({}, global, temp))
    //   } else {
    //     temp[key] = value
    //     storage(key, value)
    //     setGlobal(Object.assign({}, global, temp))
    //   }
    // },
  }
}

export default createContainer(useStorage)
