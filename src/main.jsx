import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { Provider } from "react-redux";
import store from "./store/store";
import ErrorBoundary from "./components/ErrorBoundary";
ReactDOM.createRoot(document.getElementById("root")).render(
  <ErrorBoundary>
 <Provider store={store}>
    <App />
  </Provider>
  </ErrorBoundary>
 
);
