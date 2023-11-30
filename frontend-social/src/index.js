import React from "react";
import { createRoot } from "react-dom/client";
import MyRouter from "./router";
import reportWebVitals from "./reportWebVitals";
import "./index.reset.scss";
import "./index.scss";

// ReactDOM.render(<MyRouter />, document.getElementById("root"));

const root = createRoot(document.getElementById("root"));
root.render(<MyRouter />);
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
