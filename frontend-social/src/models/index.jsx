import React from "react";
import Utils from "./utils";
import Storage from "./storage";
import Web3 from "./web3";

const models = {
  Utils,
  Storage,
  Web3,
};

function compose(containers) {
  return function Component(props) {
    return containers.reduceRight(
      (children, Container) => (
        <Container.Provider>{children}</Container.Provider>
      ),
      props.children
    );
  };
}

const ComposedStore = compose(Object.values(models));

function Store({ children }) {
  return <ComposedStore>{children}</ComposedStore>;
}

function connect(ms) {
  return function linkMap(mapStateToProps) {
    return function wrapComponent(Component) {
      return function ConnectComponet(props) {
        const state = mapStateToProps(ms.map((model) => model.useContainer()));
        return <Component {...props} {...state} />;
      };
    };
  };
}

export default React.memo(Store);
export { connect };
