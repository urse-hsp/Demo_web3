import { log } from 'console'
import React, { useState, useEffect } from 'react'
import Web3 from '../../models/Web3ReactProvider/Web3'
interface IndexType {
  isVisible?: boolean
  onClose?: () => any
}

const Index: React.FC<IndexType> = (props) => {
  let { currentAccount } = Web3.useContainer()
  return (
    <>
      {currentAccount ? '已链接' : '未连接'}
      <div>{currentAccount}</div>
    </>
  )
}
export default Index
