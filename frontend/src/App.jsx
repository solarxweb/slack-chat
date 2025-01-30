import { LoginForm } from './components/LoginForm/LoginForm.jsx';
// import { lazy } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Header from './components/Header/Header.jsx';
import SignUp from './components/SignUp/SignUp.jsx';
import { NotFound } from './components/NotFound/NotFound.jsx';
import Channels from './components/Channels/Channels.jsx';
import store from './store/store.js';
import { Provider as ReduxProvider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import i18nextInstance from './i18n/init.js';
import './App.css';
import { ToastContainer } from 'react-toastify';
// import { Provider, ErrorBoundary } from '@rollbar/react';

// const rollbarConfig = {
//   accessToken: 'd4eca5f6516a4e849da459ee439f9279',
//   captureUncaught: true,
//   captureUnhandledRejections: true,
//   environment: 'production',
// };


function App() {
  return (
        <BrowserRouter>
          <I18nextProvider i18n={i18nextInstance}>
            <ReduxProvider store={store}>
              <Header />
              <div className='main__container'>
                <ToastContainer />
                <Routes>
                  <Route path='/signup' element={<SignUp />} />
                  <Route path='/login' element={<LoginForm />} />
                  <Route path='/' element={<Channels />} />
                  <Route path='*' element={<NotFound />} />
                </Routes>
              </div>
            </ReduxProvider>
          </I18nextProvider>
        </BrowserRouter>
  );
}

export default App;