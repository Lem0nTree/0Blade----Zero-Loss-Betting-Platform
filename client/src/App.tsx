import React, { useEffect, useState, useCallback } from 'react';
import './assets/css/App.scss';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './elements/Header';
import Dashboard from './pages/Dashboard';
import Match from './pages/Match';
import HistoryBets from './pages/HistoryBets';
import MatchTwo from './pages/MatchTwo';
import { useAddress, useWeb3Context } from './hooks';
import { loadAccountDetails } from './store/slices/account-slice';
import { useDispatch, useSelector } from 'react-redux';
import Messages from './component/Messages';
import { IReduxState } from './store/slices/state.interface';
import { IMatchSlice, loadMatchDetails } from './store/slices/matches-slice';
import matches from './data/matches.json';
import { loadTokenPrices } from './helpers/token-price';
import FaqPage from './pages/FaqPage';
import ActiveBetsPage from './pages/ActiveBetsPage';

function App() {
  const dispatch = useDispatch();
  const { connect, provider, hasCachedProvider, chainID, connected } = useWeb3Context();
  const address = useAddress();
  const matchsArray = useSelector<IReduxState, IMatchSlice>((state) => state.match);

  const [walletChecked, setWalletChecked] = useState(false);

  const loadAccount = useCallback(
    (loadProvider) => {
      if (address) {
        dispatch(
          loadAccountDetails({
            networkID: chainID,
            address,
            provider: loadProvider,
          })
        );
      }
    },
    [connected, address]
  );

  useEffect(() => {
    if (address) {
      loadAccount(provider);
    }
  }, [address]);

  useEffect(() => {
    if (hasCachedProvider()) {
      connect().then(() => {
        setWalletChecked(true);
      });
    } else {
      setWalletChecked(true);
    }
  }, [address]);

  const loadApp = useCallback(() => {
    matches.map(async (match: any, index: number) => {
      dispatch(
        loadMatchDetails({
          networkID: chainID,
          provider: provider,
          match: match,
          index,
        })
      );
    });
  }, []);

  useEffect(() => {
    loadApp();
    loadTokenPrices();
  }, []);

  // useEffect(() => {
  //   const clear = async () => {
  //     if (
  //       matches.length !== matchsArray.matches.length &&
  //       matchsArray.matches.length !== 0
  //     ) {
  //       await dispatch(clearResults());
  //     }
  //   };
  //   clear();
  // }, []);

  return (
    <BrowserRouter>
      <Messages />
      <Header />
      <Routes>
        <Route path="/" element={<Dashboard />} />

        <Route path="/match/:eventId" element={<Match />} />
        {/* <Route path='/match' element={<Match />} /> */}
        <Route path="/match2" element={<MatchTwo />} />
        <Route path="/history-bets" element={<HistoryBets />} />
        <Route path="/active-bets" element={<ActiveBetsPage />} />
        <Route path="/:sport" element={<Dashboard />} />
        <Route path="/faq" element={<FaqPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
