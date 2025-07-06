import React, { useCallback, useEffect } from 'react';
import {
  Box,
  Grid,
  Typography,
  TextField,
  Button,
  Skeleton,
} from '@mui/material';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import TabData from '../component/tabs/TabDatas';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getMultiplier, getSportName } from '../helpers';
import { IReduxState } from '../store/slices/state.interface';
import { getOptionDetails } from '../helpers/get-betOption';
import {
  claim,
  IMatchSlice,
  loadMatchDetails,
  revokeBet,
} from '../store/slices/matches-slice';

import { useWeb3Context } from '../hooks';
import { loadAccountBets, loadMatchBets } from '../store/slices/account-slice';

export default function ActiveBets() {
  const { connect, provider, hasCachedProvider, chainID, connected, address } =
    useWeb3Context();

  const [activeBet, setActiveBet] = React.useState<any>([]);
  const match = useSelector<IReduxState, IMatchSlice>((state) => state.match);
  const activeBetsList = useSelector<IReduxState, any>(
    (state) => state.account.accountbets
  );
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
  const currentTime = Date.now() / 1000;

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
    <Box className='pdding0_15_respncv'>
      <Box className='activ_bets_text'>
        <Typography component='h3'>Active Bets</Typography>
        {/* <Box className='filter_box'>
          <Box component='img' src='img/filter_ic.svg' alt='' />
          <Typography>Filter</Typography>
          <input type='text' placeholder='1'></input>
        </Box> */}
      </Box>
      <Box className='activ_bets_boxes'>
        {/* <Box className="actv_box01">
                <Box className='logo_text_prnt'>
                  <Box className='logo_left_prnt'>
                    <Box component="img" src="img/real_madrid_01.png" alt="" className='real_madrid_01' />
                    <Typography>
                      Athletic
                      <br/>Real Madrid
                    </Typography>
                  </Box>
                  <Box className='logo_right_prnt'>
                    <Typography>x12.43</Typography>
                    <Box component="img" src="img/corrency_02.svg" alt="" className='real_madrid_01' />
                  </Box>
                </Box>
                <Box className='topwin_row'>
                  <Typography><span>To win -</span> Real Madrid (2X)</Typography>
                  <Typography component="h6">+2</Typography>
                  <Typography component="h4">0h:38m</Typography>
                </Box>
                <Box className='dividr_desd' />
                <Box className='topwin_row'>
                  <Typography><span>To win -</span> Real Madrid (Exact Score 1-4)</Typography>
                </Box>
                <Box className='topwin_row'>
                  <Typography><span>To win -</span> Real Madrid (Goal)</Typography>
                </Box>
              </Box> */}
        {activeBet.slice(0, 3).map(
          (bet) => {
            if (!bet.betRevoked) {
              return (
                <Box className='actv_box01' style={{ marginTop: '5px' }}>
                  <Box className='logo_text_prnt'>
                    <Box className='logo_left_prnt'>
                      <Box className='volkski_img_prnt'>
                        <Box
                          component='img'
                          src={
                            '../img/participants/' +
                            bet.match.matchpartecipant[0] +
                            '_' +
                            bet.match.matchcategory +
                            '.png'
                          }
                          alt=''
                        />
                      </Box>
                      <Box className='korianzombi_img_prnt'>
                        <Box
                          component='img'
                          src={
                            '../img/participants/' +
                            bet.match.matchpartecipant[1] +
                            '_' +
                            bet.match.matchcategory +
                            '.png'
                          }
                          alt=''
                        />
                      </Box>
                      <Typography>
                        {bet.match.matchpartecipant[0]}
                        <br />
                        {bet.match.matchpartecipant[1]}
                      </Typography>
                    </Box>
                    <Box className='logo_right_prnt'>
                      {/* <Typography></Typography> */}
                      <Button
                        className='revokebutton'
                        onClick={() => revokeBetCall(bet.betID, bet.match)}
                      >
                        X
                      </Button>
                    </Box>
                  </Box>
                  <Box className='topwin_row'>
                    <Typography>
                      {/* <span>To win -</span> */}
                      {
                        getOptionDetails(
                          bet.selectedOutCome,
                          bet.match.matchcategory
                        ).label
                      }
                    </Typography>
                    <Typography component='h6'>
                      {
                        getOptionDetails(
                          bet.selectedOutCome,
                          bet.match.matchcategory
                        ).option.name
                      }
                    </Typography>
                    <Typography component='h6' style={{ width: '55px' }}>
                      {bet.amount.toFixed(0)} {bet.match.farmtoken}
                    </Typography>

                    {bet.resultDeclared && !bet.betRevoked && !bet.isWinner ? (
                      ''
                    ) : (
                      <Typography component='h4'>
                        x
                        {bet.match.bettedAmountCalculation ? (
                          bet.resultDeclared &&
                          currentTime >
                            bet.match.lockingPeriod +
                              bet.match.bettingPeriod +
                              bet.match.startTime ? (
                            //? Number(bet.resultDeclared).toFixed(2)
                            Number(
                              (bet.amount + bet.claimableReward) / bet.amount
                            ).toFixed(2)
                          ) : (
                            Number(
                              getMultiplier(
                                bet.amount,
                                bet.match.bettedAmountCalculation[
                                  bet.selectedOutCome
                                ],
                                bet.match.totalBettedAmount,
                                bet.match.treasuryFund,
                                bet.match.farmapy,
                                bet.match.lockingPeriod
                              )
                            ).toFixed(2)
                          )
                        ) : (
                          // getMultiplier(
                          //   bet.amount,
                          //   bet.match.bettedAmountCalculation[
                          //     bet.selectedOutCome - 1
                          //   ],
                          //   bet.match.totalBettedAmount,
                          //   bet.match.treasuryFund,
                          //   bet.match.farmapy,
                          //   bet.match.lockingPeriod
                          // )
                          <Skeleton variant='text' />
                        )}
                      </Typography>
                    )}
                  </Box>
                  <Button
                    className={
                      bet.resultDeclared &&
                      bet.isWinner &&
                      !bet.betSettle &&
                      !bet.betRevoked &&
                      currentTime >
                        bet.match.lockingPeriod +
                          bet.match.bettingPeriod +
                          bet.match.startTime
                        ? 'table_btns green_btn_clr'
                        : bet.resultDeclared &&
                          !bet.betRevoked &&
                          !bet.isWinner &&
                          currentTime >
                            bet.match.lockingPeriod +
                              bet.match.bettingPeriod +
                              bet.match.startTime
                        ? 'table_btns red_btn_clr'
                        : bet.betRevoked
                        ? 'table_btns yellow_btn_clr'
                        : 'table_btns cmplt_btn_clr'
                    }
                    onClick={() => claimBet(bet.match, bet.betID)}
                    disabled={
                      bet.betRevoked ||
                      bet.betSettled ||
                      !bet.resultDeclared ||
                      currentTime <
                        bet.match.lockingPeriod +
                          bet.match.bettingPeriod +
                          bet.match.startTime
                    }
                  >
                    {bet.resultDeclared
                      ? bet.isWinner &&
                        !bet.betSettle &&
                        !bet.betRevoked &&
                        currentTime >
                          bet.match.lockingPeriod +
                            bet.match.bettingPeriod +
                            bet.match.startTime
                        ? 'Claim'
                        : bet.isWinner && bet.betSettle
                        ? 'Already Claimed'
                        : bet.betRevoked
                        ? 'Revoked Bet'
                        : !bet.isWinner &&
                          currentTime >
                            bet.match.lockingPeriod +
                              bet.match.bettingPeriod +
                              bet.match.startTime &&
                          'Withdraw'
                      : ''}

                    {/* {bet.isWinner && bet.resultDeclared
              ? !bet.betSettled && !bet.betRevoked
                ? 'Claim Prize'
                : 'Already Claimed'
              : bet.betRevoked
              ? 'Bet Revoked'
              : bet.resultDeclared && !bet.isWinner
              ? 'Wait for Result'
              : ' Lost Bet'} */}
                  </Button>
                </Box>
              );
            }
          }
          // <Box className='actv_box01 actv_box02'>
          //   <Box className='logo_text_prnt'>
          //     <Box className='logo_left_prnt'>
          //       <Box className='volkski_img_prnt'>
          //         <Box component='img' src='img/volkanovski.png' alt='' />
          //       </Box>
          //       <Box className='korianzombi_img_prnt'>
          //         <Box
          //           component='img'
          //           src='img/korean_zombie.png'
          //           alt=''
          //         />
          //       </Box>
          //       <Typography>
          //         Volkanovski
          //         <br />
          //         Korean Zombie
          //       </Typography>
          //     </Box>
          //     <Box className='logo_right_prnt'>
          //       <Typography>x4.58</Typography>
          //       <Box
          //         component='img'
          //         src='img/corrency_02.svg'
          //         alt=''
          //         className='real_madrid_01'
          //       />
          //     </Box>
          //   </Box>
          //   <Box className='topwin_row'>
          //     <Typography>
          //       <span>To win -</span>Volkanovski by Submission (3.4X)
          //     </Typography>
          //     <Typography component='h4'>0h:10m</Typography>
          //   </Box>
          // </Box>
        )}

        {/* <Box className='actv_box01 actv_box02'>
                <Box className='logo_text_prnt'>
                  <Box className='logo_left_prnt'>
                    <Box className='volkski_img_prnt'>
                      <Box component='img' src='img/linares_logo.svg' alt='' />
                    </Box>
                    <Box className='korianzombi_img_prnt'>
                      <Box component='img' src='img/sevilla_logo.svg' alt='' />
                    </Box>
                    <Typography>
                      Linares
                      <br />
                      Sevilla
                    </Typography>
                  </Box>
                  <Box className='logo_right_prnt'>
                    <Typography>x6.40</Typography>
                    <Box
                      component='img'
                      src='img/corrency_02.svg'
                      alt=''
                      className='real_madrid_01'
                    />
                  </Box>
                </Box>
                <Box className='topwin_row'>
                  <Typography>
                    <span>To win -</span>Linares
                  </Typography>
                  <Typography component='h4'>Closed</Typography>
                </Box>
                <Button className='last_cell_btn green_bg green_border'>
                  Redeem Prizes
                </Button>
              </Box> */}
        {/* <Box className="actv_box01 actv_box02">
                <Box className='logo_text_prnt'>
                  <Box className='logo_left_prnt'>
                    <Box component="img" src="img/real_madrid_02.png" alt="" className='real_madrid_01' />
                    <Typography>
                    Real Madrid
                      <br/>Linares
                    </Typography>
                  </Box>
                  <Box className='logo_right_prnt'>
                    <Typography>x12.43</Typography>
                    <Box component="img" src="img/corrency_01.svg" alt="" className='real_madrid_01' />
                  </Box>
                </Box>
                <Box className='topwin_row'>
                  <Typography><span>To win -</span> Real Madrid (2X)</Typography>
                  <Button disabled>Closed</Button>
                </Box>
              </Box>
              <Box className="actv_box01 actv_box02">
                <Box className='logo_text_prnt'>
                  <Box className='logo_left_prnt'>
                    <Box component="img" src="img/real_madrid_02.png" alt="" className='real_madrid_01' />
                    <Typography>
                    Real Madrid
                      <br/>Linares
                    </Typography>
                  </Box>
                  <Box className='logo_right_prnt'>
                    <Typography>x12.43</Typography>
                    <Box component="img" src="img/corrency_02.svg" alt="" className='real_madrid_01' />
                  </Box>
                </Box>
                <Box className='topwin_row'>
                  <Typography><span>To win -</span> Real Madrid (2X)</Typography>
                  <Button >Claim Prize</Button>
                </Box>
              </Box> */}
      </Box>
    </Box>
  );
}
