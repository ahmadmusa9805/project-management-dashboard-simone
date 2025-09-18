import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store, persistor } from "./Redux/app/store.ts";
import { PersistGate } from "redux-persist/integration/react";
import { rehydrateUserFromToken } from "./Redux/features/auth/authSlice.ts";
import { Spin } from "antd";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate
        loading={
          <div className="flex justify-center items-center h-40">
            <Spin size="large" />
          </div>
        }
        persistor={persistor}
        onBeforeLift={() => {
          // ✅ runs after state is fully rehydrated
          store.dispatch(rehydrateUserFromToken());
        }}
      >
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </StrictMode>
);
