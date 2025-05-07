import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";

import App from "./App.tsx";
import { store } from "./redux/store.ts";

createRoot(document.getElementById("root") as HTMLDivElement).render(
  //* Doubles users!
  // <React.StrictMode>
  <Provider store={store}>
    <App />
  </Provider>
  // </React.StrictMode>
);
