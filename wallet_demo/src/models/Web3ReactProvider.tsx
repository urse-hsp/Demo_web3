import React, { useState, useEffect } from 'react'

const models = {
  // Utils,
  Storage,
  // Web3,
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

function Store({ children }: any) {
  return <ComposedStore>{children}</ComposedStore>
}

const Index = () => {
  return <></>
}
export default React.memo(Index)
