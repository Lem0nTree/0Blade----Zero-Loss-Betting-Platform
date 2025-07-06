import React, { useCallback, useEffect } from 'react';
import { Box, Grid, Typography, TextField, Button, Skeleton } from '@mui/material';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import TabData from '../component/tabs/TabDatas';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getMultiplier, getSportName } from '../helpers';
import { IReduxState } from '../store/slices/state.interface';
import { getOptionDetails } from '../helpers/get-betOption';
import { claim, IMatchSlice, loadMatchDetails, revokeBet } from '../store/slices/matches-slice';

import { useWeb3Context } from '../hooks';
import { loadAccountBets, loadMatchBets } from '../store/slices/account-slice';
import HighLightMatch from './HighLightMatch';
import TableOfHistory from '../assets/img/history/TableOfHistory';

export default function ActiveBetsPage() {
  const { connect, provider, hasCachedProvider, chainID, connected, address } = useWeb3Context();

  const [activeBet, setActiveBet] = React.useState<any>([]);
  const match = useSelector<IReduxState, IMatchSlice>((state) => state.match);
  const activeBetsList = useSelector<IReduxState, any>((state) => state.account.accountbets);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const dispatch = useDispatch();
  // const loadApp = useCallback(() => {
  //   match.matches.map(async (match: any, index: number) => {
  //     dispatch(
  //       loadMatchDetails({
  //         networkID: chainID,
  //         provider: provider,
  //         match: match,
  //         index,
  //       })
  //     );
  //   });
  // }, []);

  // useEffect(() => {
  //   loadApp();
  // }, []);

  const loadActiveBet = async () => {
    let activeBetArray = [];
    if (address) {
      Object.entries(activeBetsList).map((activeBet) => {
        if (Object.entries(activeBet[1]).length) {
          Object.entries(activeBet[1]).map((bet: any) => {
            if (!bet[1].betSettled) {
              activeBetArray.push(bet[1]);
            }
          });
        }
      });
      const finalArr = activeBetArray.sort(function (a, b) {
        return a.betTime - b.betTime;
      });

      setActiveBet(finalArr);
    }
  };

  const claimBet = async (match, betId) => {
    await dispatch(
      claim({
        match,
        betId,
        provider,
      })
    );
  };

  const loadAccountBet = async () => {
    if (address) {
      match.matches.map(async (match: any, index: number) => {
        dispatch(
          loadAccountBets({
            address,
            provider: provider,
            match,
            index,
          })
        );
      });
    }
  };

  useEffect(() => {
    if (address) {
      loadAccountBet();
    }
  }, [address]);

  useEffect(() => {
    if (address) {
      loadActiveBet();
    }
  }, [address, activeBetsList]);

  const revokeBetCall = async (betId, match) => {
    // if (await checkWrongNetwork()) return;
    // if (!address) {
    //   alert('PLEASE CONNECT WALLET FIRST');
    //   // dispatch(warning({ text: messages.please_connect_wallet }));
    //   return;
    // }
    await dispatch(
      revokeBet({
        match,
        betId,
        provider,
      })
    );
    await dispatch(
      loadMatchBets({
        address,
        provider: provider,
        match,
      })
    );
  };

  return (
    <>
      <Box className="history_page_main">
        <Box className="home_history_prnt">
          <a href="#">
            <Box component="img" src="img/home_logo.svg" alt="" />
            <span>Home / </span>
          </a>
          <Typography>&nbsp;&nbsp;Active Bets</Typography>
        </Box>
        <Grid container spacing={2}>
          <Grid item xs={12} md={8} className="order_2">
            <TableOfHistory activeBet={activeBet} active={true} />
          </Grid>
          <Grid item xs={12} md={4}>
            <HighLightMatch />
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
