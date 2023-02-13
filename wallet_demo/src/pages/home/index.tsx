import { log } from 'console'
import React, { useState, useEffect } from 'react'
import Web3 from '../../models/Web3ReactProvider/Web3'
import Storage from '../../models/Web3ReactProvider/storage'

interface IndexType {
  isVisible?: boolean
  onClose?: () => any
}

const Index: React.FC<IndexType> = (props) => {
  let { account, connect, disconnect } = Web3.useContainer()
  // const res = Storage.useContainer()
  // console.log(res, 'res')

  const block = () => {
    console.log('退出')
    disconnect()
  }
  const login = () => {
    console.log('登录')
    connect(1230, 'MetaMask')
    return
    // try {
    //   let result = await connect(1230, 'MetaMask')
    //   // if (!result) {
    //   //   setPreChainId(Number(networkId))
    //   //   setIsModalVisible(false)
    //   // }
    // } catch (error) {
    //   // If it is a rollback, continue to let the user choose
    //   if (error === 'rollback') {
    //     // return handleConnect()
    //   }
    // }
  }
  return (
    <>
      {account ? (
        <button onClick={block}>已链接-退出</button>
      ) : (
        <button onClick={login}>未连接-登录</button>
      )}
      <div>{account}</div>
    </>
  )
}
export default Index
