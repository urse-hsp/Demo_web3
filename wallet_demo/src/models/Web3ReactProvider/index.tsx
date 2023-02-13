import React, { useState, useEffect } from 'react'
import Web3 from './Web3'
import Storage from './storage'

// 注意排序，
const models = {
  Storage,
  Web3,
}

function compose(containers: any) {
  return function Component(props: any) {
    return containers.reduceRight(
      (children: any, Container: any) => (
        <Container.Provider>{children}</Container.Provider>
      ),
      props.children
    )
  }
}

const ComposedStore = compose(Object.values(models))

function Web3ReactProvider({ children }: any) {
  return <ComposedStore>{children}</ComposedStore>
}

export default React.memo(Web3ReactProvider)
