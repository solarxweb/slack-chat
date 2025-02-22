/* eslint-disable quotes */
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Provider as ReduxProvider, useSelector } from "react-redux";
import { I18nextProvider } from "react-i18next";
import { ToastContainer } from "react-toastify";
import Header from "./components/Header/Header.jsx";
import SignUp from "./components/SignUp/SignUp.jsx";
import NotFound from "./components/NotFound/NotFound.jsx";
import Channels from "./components/Channels/Channels.jsx";
// import SwitchNameChannel from "./components/Channels/Modal/ChangeNameChannel.jsx";
import store from "./store/store.js";
import i18nextInstance from "./i18n/init.js";
import "./App.css";
import LoginForm from "./components/LoginForm/LoginForm.jsx";
import process from "process";
import { Provider, ErrorBoundary } from "@rollbar/react";
import ModalContainer from './components/Modal.jsx';

const rollbarConfig = {
  accessToken: process.env.ROLLBAR_ACCESS_TOKEN,
  captureUncaught: true,
  captureUnhandledRejections: true,
  environment: "production",
};

const App = () => {

  return (
  <Provider config={rollbarConfig}>
    <ErrorBoundary>
      <BrowserRouter>
        <I18nextProvider i18n={i18nextInstance}>
          <ReduxProvider store={store}>
            <ModalContainer />
            <Header />
            <div className="main__container">
              <ToastContainer />
              <Routes>
                <Route path="/signup" element={<SignUp />} />
                <Route path="/login" element={<LoginForm />} />
                <Route path="/" element={<Channels />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </ReduxProvider>
        </I18nextProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </Provider>
  );
};

export default App;
