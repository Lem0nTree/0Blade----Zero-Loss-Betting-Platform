import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Grid, Checkbox, Button } from '@mui/material';
import TableOfHistory from '../assets/img/history/TableOfHistory';
import { useWeb3Context } from '../hooks';
import { useSelector } from 'react-redux';
import { IReduxState } from '../store/slices/state.interface';
import ActiveBets from './ActiveBets';
import HighLightMatch from './HighLightMatch';

export default function HistoryBets() {
  const { connect, provider, hasCachedProvider, chainID, connected, address } = useWeb3Context();
  const [activeBet, setActiveBet] = useState<any>([]);
  const activeBetsList = useSelector<IReduxState, any>((state) => state.account.accountbets);

  const loadActiveBet = async () => {
    let activeBetArray = [];
    if (address) {
      Object.entries(activeBetsList).map((activeBet) => {
        if (Object.entries(activeBet[1]).length) {
          Object.entries(activeBet[1]).map((bet) => {
            activeBetArray.push(bet[1]);
          });
        }
      });
      const finalArr = activeBetArray.sort(function (a, b) {
        return a.betTime - b.betTime;
      });
      setActiveBet(finalArr);
    }
  };
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  useEffect(() => {
    if (address) {
      loadActiveBet();
    }
  }, [address, activeBetsList]);

  // {activeBet.slice(0, 3).map(
  //   (bet) => {
  //     if (!bet.betRevoked) {
  //       return (
  //         <Box className='actv_box01' style={{ marginTop: '5px' }}>
  //           <Box className='logo_text_prnt'>
  //             <Box className='logo_left_prnt'>
  //               <Box className='volkski_img_prnt'>
  //                 <Box
  //                   component='img'
  //                   src={
  //                     '../img/participants/' +
  //                     bet.match.matchpartecipant[0] +
  //                     '_' +
  //                     bet.match.matchcategory +
  //                     '.png'
  //                   }
  //                   alt=''
  //                 />
  //               </Box>
  //               <Box className='korianzombi_img_prnt'>
  //                 <Box
  //                   component='img'
  //                   src={
  //                     '../img/participants/' +
  //                     bet.match.matchpartecipant[1] +
  //                     '_' +
  //                     bet.match.matchcategory +
  //                     '.png'
  //                   }
  //                   alt=''
  //                 />
  //               </Box>
  //               <Typography>
  //                 {bet.match.matchpartecipant[0]}
  //                 <br />
  //                 {bet.match.matchpartecipant[1]}
  //               </Typography>
  //             </Box>
  //             <Box className='logo_right_prnt'>
  //               {/* <Typography></Typography> */}
  //               <Button
  //                 className='revokebutton'
  //                 onClick={() =>
  //                   revokeBetCall(bet.betID, bet.match)
  //                 }
  //               >
  //                 X
  //               </Button>
  //             </Box>
  //           </Box>
  //           <Box className='topwin_row'>
  //             <Typography>
  //               {/* <span>To win -</span> */}
  //               {
  //                 getOptionDetails(
  //                   bet.selectedOutCome,
  //                   bet.match.matchcategory
  //                 ).label
  //               }
  //             </Typography>
  //             <Typography component='h6'>
  //               {
  //                 getOptionDetails(
  //                   bet.selectedOutCome,
  //                   bet.match.matchcategory
  //                 ).option.name
  //               }
  //             </Typography>
  //             <Typography component='h6' style={{ width: '55px' }}>
  //               {bet.amount} {bet.match.farmtoken}
  //             </Typography>
  //             <Typography component='h4'>
  //               x
  //               {getMultiplier(
  //                 bet.amount,
  //                 bet.match.bettedAmountCalculation[
  //                   bet.selectedOutCome
  //                 ],
  //                 bet.match.totalBettedAmount,
  //                 bet.match.treasuryFund,
  //                 bet.match.farmapy,
  //                 bet.match.lockingPeriod
  //               )}
  //             </Typography>
  //           </Box>
  //         </Box>
  //       );
  //     }
  //   }

  // )}

  return (
    <>
      <Box className="history_page_main">
        <Box className="home_history_prnt">
          <a href="#">
            <Box component="img" src="img/home_logo.svg" alt="" />
            <span>Home / </span>
          </a>
          <Typography>&nbsp;&nbsp;Bet History</Typography>
        </Box>
        <Grid container spacing={2}>
          <Grid item xs={12} md={8} className="order_2">
            <TableOfHistory activeBet={activeBet} active={false} />
          </Grid>
          <Grid item xs={12} md={4}>
            <HighLightMatch />
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
