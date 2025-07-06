import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import store from './store/store';
import { Provider } from 'react-redux';
import { Web3ContextProvider } from './hooks';
import reportWebVitals from './reportWebVitals';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';
import { SnackbarProvider } from 'notistack';
import SnackMessage from './component/Messages/snackbar';

let persistor = persistStore(store);

ReactDOM.render(
  <SnackbarProvider
    // maxSnack={4}
    anchorOrigin={{
      vertical: 'top',
      horizontal: 'left',
    }}
    content={(key, message: string) => <SnackMessage id={key} message={JSON.parse(message)} />}
    autoHideDuration={10000}
  >
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Web3ContextProvider>
          <App />
        </Web3ContextProvider>
      </PersistGate>
    </Provider>
  </SnackbarProvider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
