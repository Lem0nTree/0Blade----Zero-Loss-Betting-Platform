import React, { useEffect, useState, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Box, Typography, Grid, Checkbox, Button, Skeleton, CircularProgress } from '@mui/material';
import MatchTabOne from '../component/matchtabs/MatchTabOne';
import CoeffTab from '../component/matchtabs/CoeffTab';
import Slider from '@mui/material/Slider';
import { useDispatch, useSelector } from 'react-redux';
import { IReduxState } from '../store/slices/state.interface';
import { claim, IMatchSlice, loadMatchDetails, placeBet, revokeBet } from '../store/slices/matches-slice';
import { getMultiplier, getSportName } from '../helpers';
import { useWeb3Context } from '../hooks';
import { error, warning } from '../store/slices/messages-slice';
import { messages } from '../constants/messages';
import { loadAccountBets, loadMatchBets } from '../store/slices/account-slice';
import { getOptionDetails } from '../helpers/get-betOption';
import classNames from 'classnames';
import { ethers } from 'ethers';
import { getAddresses } from '../constants';
import { BetTestTokenContract } from '../abi';
import Countdown from 'react-countdown';
import { getTokenPrice } from '../helpers/token-price';

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };
export default function Match() {
  const currentTime = Date.now() / 1000;
  const { eventId }: any = useParams();
  const dispatch = useDispatch();
  const { provider, address, chainID, checkWrongNetwork, connect } = useWeb3Context();
  const match = useSelector<IReduxState, IMatchSlice>((state) => state.match);
  const [selectedBet, setSelectedBet] = useState<any>([]);
  const [activeBets, setActiveBets] = useState<any>([]);
  const [allowance, setAllowance] = useState<any>(false);
  const [loading, setLoading] = useState<any>(false);

  const addresses = getAddresses(chainID);
  const signer = provider.getSigner();

  const matchDetails = useSelector<IReduxState, any>((state) => {
    return state.match.matches.filter((match: any) => match.matchID == eventId)[0];
  });
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  // let tokenADDRESS = 'address.' + matchDetails.farmtoken;
  const tokenContract = new ethers.Contract(addresses[matchDetails.farmtoken], BetTestTokenContract, signer);

  const loadApp = useCallback(() => {
    match.matches.map((match: any, index: number) => {
      dispatch(
        loadMatchDetails({
          networkID: chainID,
          provider: provider,
          match: match,
          index,
        })
      );
      dispatch(
        loadAccountBets({
          address,
          provider: provider,
          match: matchDetails,
          index,
        })
      );
    });
  }, []);

  useEffect(() => {
    const updateData = async () => {
      if (matchDetails.index) {
        await dispatch(
          loadMatchDetails({
            networkID: chainID,
            provider: provider,
            match: matchDetails,
            index: matchDetails.index,
          })
        );
      } else {
        loadApp();
      }
    };
    updateData();
  }, []);

  useEffect(() => {
    const updateData = async () => {
      if (address) {
        const addresses = getAddresses(chainID);

        const tokenContract = new ethers.Contract(addresses[matchDetails.farmtoken], BetTestTokenContract, provider);
        const allowanceData = Number(await tokenContract.allowance(address, matchDetails.bettingcontract));
        if (allowanceData) {
          setAllowance(true);
        }
        await dispatch(
          loadMatchBets({
            address,
            provider: provider,
            match: matchDetails,
          })
        );
      }
    };
    updateData();
  }, [address]);

  const bets = useSelector<IReduxState, any>((state) => {
    const activeBetsList = state.account.accountbets;

    let activeBetArray = [];
    if (address) {
      Object.entries(activeBetsList).map((activeBet) => {
        if (Object.entries(activeBet[1]).length) {
          Object.entries(activeBet[1]).map((bet) => {
            if (bet[1].match.matchID == eventId) {
              activeBetArray.push(bet[1]);
            }
          });
        }
      });
      const finalArr = activeBetArray.sort(function (a, b) {
        return a.betTime - b.betTime;
      });

      return finalArr;
    } else {
      return [];
    }
  });

  const accountBalance = useSelector<IReduxState, any>((state) => {
    return state.account.balances;
  });
  const [position, setPosition] = React.useState(0);
  const [positionValue, setPositionValue] = React.useState(0);
  const getSelectedOption = async (value: any) => {
    setSelectedBet([...value]);
  };

  const calculateBetAmount = (percent) => {
    setPositionValue(percent);
    setPosition(Number(((accountBalance[matchDetails.farmtoken] * percent) / 100).toFixed(4)));
  };

  const changeValue = (txtValue) => {
    const value = parseFloat(Number(txtValue).toFixed(4));
    setPosition(value);
    setPositionValue((value * 100) / accountBalance[matchDetails.farmtoken]);
  };

  const approvetx = async () => {
    try {
      setLoading(true);
      const approvetx = await tokenContract.approve(
        matchDetails.bettingcontract,
        '115792089237316195423570985008687907853269984665640564039457584007913129639935'
      );
      await approvetx.wait();
      setLoading(false);
      setAllowance(true);
    } catch (e) {
      setLoading(false);
      // dispatch(error({ text: e }));
    }
  };

  const placeBetCall = async () => {
    if (await checkWrongNetwork()) return;
    if (position < matchDetails.minimumBet) {
      dispatch(
        warning({
          text: messages.minimum_bet(matchDetails.minimumBet, matchDetails.farmtoken),
        })
      );
      return;
    }

    if (!address) {
      dispatch(warning({ text: messages.please_connect_wallet }));
      return;
    }

    if (!selectedBet[0]) {
      dispatch(warning({ text: messages.select_bet }));
      return;
    }
    setLoading(true);
    await dispatch(
      placeBet({
        amount: (position * 1e18).toString(),
        outCome: selectedBet[0],
        match: matchDetails,
        networkID: chainID,
        provider,
        address,
      })
    );

    await dispatch(
      loadMatchBets({
        address,
        provider: provider,
        match: matchDetails,
      })
    );
    setLoading(false);
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

  const renderer = ({ days, hours, minutes, seconds, completed }: any) => {
    // Render a countdown
    return (
      <span>
        {hours + days * 24}:{minutes}:{seconds}
      </span>
    );
  };

  const rewardstakeratio = matchDetails.isLP ? matchDetails.lpPrice / getTokenPrice(matchDetails.rewardtoken) : 1;

  const revokeBetCall = async (betId) => {
    // if (await checkWrongNetwork()) return;
    // if (!address) {
    //   alert('PLEASE CONNECT WALLET FIRST');
    //   // dispatch(warning({ text: messages.please_connect_wallet }));
    //   return;
    // }
    await dispatch(
      revokeBet({
        match: matchDetails,
        betId,
        provider,
      })
    );
    await dispatch(
      loadMatchBets({
        address,
        provider: provider,
        match: matchDetails,
      })
    );
  };
  return (
    <>
      <Box className="match_page_main">
        <Box className="home_match_prnt">
          <Link to="/">
            <Box component="img" src="../img/home_logo.svg" alt="" />
            <span>Home / </span>
          </Link>
          <Typography>&nbsp;&nbsp;Matches</Typography>
        </Box>
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <Box className="spain_primira_box">
              <Box className="spain_primira_head">
                <Typography>{getSportName(matchDetails.matchcategory)}</Typography>
                <Typography component="h4">{matchDetails.matchname}</Typography>
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={3} sm={4}>
                  <Box className="match_logo_bx">
                    <Box
                      component="img"
                      src={'../img/participants/' + matchDetails.matchpartecipant[0] + '_' + matchDetails.matchcategory + '.png'}
                      alt=""
                    />
                  </Box>
                </Grid>
                <Grid item xs={6} sm={4}>
                  <Box className="match_logo_bx">
                    <Typography>
                      {currentTime < matchDetails.startTime
                        ? 'Bets Open in'
                        : matchDetails.finalScore == ''
                        ? 'Total Value Bet'
                        : 'Final Score'}
                    </Typography>
                    <Box className="cro_flex">
                      {/* <Box component="img" src="img/corrency_02.svg" alt="" className='corrency_02'/> */}
                      <Typography component="h5">
                        <span>
                          {currentTime < matchDetails.startTime ? (
                            <Countdown date={matchDetails.startTime * 1000} renderer={renderer} />
                          ) : matchDetails ? (
                            matchDetails.finalScore == '' ? (
                              (matchDetails.totalBettedAmount + matchDetails.treasuryFund).toFixed(0)
                            ) : (
                              matchDetails.finalScore
                            )
                          ) : (
                            <Skeleton variant="text" />
                          )}
                        </span>{' '}
                        <b>{matchDetails.finalScore == '' && currentTime > matchDetails.startTime ? matchDetails.farmtoken : ''}</b>
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={3} sm={4}>
                  <Box className="match_logo_bx">
                    <Box
                      component="img"
                      src={'../img/participants/' + matchDetails.matchpartecipant[1] + '_' + matchDetails.matchcategory + '.png'}
                      alt=""
                    />
                  </Box>
                </Grid>
              </Grid>
              <MatchTabOne matchDetails={matchDetails} />
            </Box>
            <Box className="MobileBox">
              {/* relative bets start*/}

              <Box className="pdding0_15_respncv">
                <Box className="game_bet_bx">
                  <Typography component="h2">Game Bets</Typography>
                  <Typography className="game_bat_sub_p">Your bets relative to this match</Typography>
                  {bets && bets.length > 0 ? (
                    <Box className="activ_bets_boxes">
                      {bets &&
                        bets.map((bet) => {
                          if (!bet.betRevoked && !bet.betSettled) {
                            return (
                              <Box className="actv_box01" style={{ marginTop: '5px' }}>
                                <Box className="logo_text_prnt">
                                  <Box className="logo_left_prnt">
                                    <Box className="volkski_img_prnt">
                                      <Box
                                        component="img"
                                        src={
                                          '../img/participants/' +
                                          matchDetails.matchpartecipant[0] +
                                          '_' +
                                          matchDetails.matchcategory +
                                          '.png'
                                        }
                                        alt=""
                                      />
                                    </Box>
                                    <Box className="korianzombi_img_prnt">
                                      <Box
                                        component="img"
                                        src={
                                          '../img/participants/' +
                                          matchDetails.matchpartecipant[1] +
                                          '_' +
                                          matchDetails.matchcategory +
                                          '.png'
                                        }
                                        alt=""
                                      />
                                    </Box>
                                    <Typography>
                                      {matchDetails.matchpartecipant[0]}
                                      <br />
                                      {matchDetails.matchpartecipant[1]}
                                    </Typography>
                                  </Box>
                                  <Box className="logo_right_prnt">
                                    {/* <Typography></Typography> */}
                                    <Button className="revokebutton" onClick={() => revokeBetCall(bet.betID)}>
                                      X
                                    </Button>
                                  </Box>
                                </Box>
                                <Box className="topwin_row">
                                  <Typography>
                                    {/* <span>To win -</span> */}
                                    {getOptionDetails(bet.selectedOutCome, matchDetails.matchcategory).label}
                                  </Typography>
                                  <Typography component="h6">
                                    {getOptionDetails(bet.selectedOutCome, matchDetails.matchcategory).option.name}
                                  </Typography>
                                  <Typography component="h6" style={{ width: '95px' }}>
                                    {bet.amount.toFixed(4)} {matchDetails.farmtoken}
                                  </Typography>
                                  {bet.resultDeclared && !bet.betRevoked && !bet.isWinner ? (
                                    ''
                                  ) : (
                                    <Typography component="h4">
                                      x{' '}
                                      {bet.resultDeclared &&
                                      currentTime > bet.match.lockingPeriod + bet.match.bettingPeriod + bet.match.startTime
                                        ? //? Number(bet.resultDeclared).toFixed(2)
                                          Number((bet.amount + bet.claimableReward) / bet.amount).toFixed(2)
                                        : Number(
                                            getMultiplier(
                                              bet.amount,
                                              bet.match.bettedAmountCalculation[bet.selectedOutCome],
                                              bet.match.totalBettedAmount,
                                              bet.match.treasuryFund,
                                              bet.match.farmapy,
                                              bet.match.lockingPeriod
                                            )
                                          ).toFixed(2)}
                                      {/* {getMultiplier(
                                        bet.amount,
                                        matchDetails.bettedAmountCalculation[
                                          bet.selectedOutCome - 1
                                        ],
                                        matchDetails.totalBettedAmount,
                                        matchDetails.treasuryFund,
                                        matchDetails.farmapy,
                                        matchDetails.lockingPeriod
                                      )} */}
                                    </Typography>
                                  )}
                                </Box>
                                <Button
                                  className={
                                    bet.resultDeclared &&
                                    currentTime > bet.match.lockingPeriod + bet.match.bettingPeriod + bet.match.startTime
                                      ? bet.betRevoked
                                        ? 'table_btns yellow_btn_clr'
                                        : bet.isWinner
                                        ? bet.betSettled
                                          ? 'table_btns yellow_btn_clr'
                                          : 'table_btns green_btn_clr'
                                        : bet.betSettled
                                        ? 'table_btns yellow_btn_clr'
                                        : 'table_btns red_btn_clr'
                                      : 'table_btns yellow_btn_clr'
                                  }
                                  onClick={() => claimBet(bet.match, bet.betID)}
                                  disabled={
                                    bet.betRevoked ||
                                    bet.betSettled ||
                                    !bet.resultDeclared ||
                                    currentTime < bet.match.lockingPeriod + bet.match.bettingPeriod + bet.match.startTime
                                  }
                                >
                                  {bet.resultDeclared &&
                                  currentTime > bet.match.lockingPeriod + bet.match.bettingPeriod + bet.match.startTime
                                    ? bet.betRevoked
                                      ? 'Revoked Bet'
                                      : bet.isWinner
                                      ? bet.betSettled
                                        ? 'Completed'
                                        : 'Claim'
                                      : bet.betSettled
                                      ? 'Completed'
                                      : 'Withdraw'
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
                        })}
                    </Box>
                  ) : (
                    <Box className="nobet_bx">
                      <Box component="img" src="img/allert_ic.svg" alt="" />
                      <Typography>No bets were placed for this match</Typography>
                    </Box>
                  )}
                </Box>
              </Box>

              {/* relative bets start*/}

              {selectedBet && selectedBet.length > 0 && (
                <Box className="single_bet_box">
                  <Box className="head_txt_clean_img">
                    <Typography component="h3">Single Bet</Typography>
                    <Box component="img" src="img/cleaner_ic.svg" alt="" />
                  </Box>
                  <Box className="single_bet_inn01">
                    <Box className="check_text_flex_box">
                      <Checkbox {...label} defaultChecked />
                      <Typography>{matchDetails.matchname}</Typography>
                      <Button>
                        <Box component="img" src="../img/close_ic.svg" />
                      </Button>
                    </Box>
                    <Box className="outcom_flex_bx">
                      <Box className="outcom_left">
                        <Typography component="h5">{selectedBet[1]}</Typography>
                        <Typography component="h5">
                          <span>{selectedBet[3]}</span>
                        </Typography>
                      </Box>
                      {/* matchDetails.bettedAmountCalculation[selectedBet[0]]
                          ? matchDetails.bettedAmountCalculation[selectedBet[0]]
                          : 1) */}
                      <Typography component="h6">
                        x
                        {selectedBet &&
                          getMultiplier(
                            position,
                            matchDetails.bettedAmountCalculation[selectedBet[0] - 1],
                            matchDetails.totalBettedAmount,
                            matchDetails.treasuryFund,
                            matchDetails.farmapy,
                            matchDetails.lockingPeriod
                          )}
                        {/* {(
                        ((position /
                          (position +
                            matchDetails.bettedAmountCalculation[
                              selectedBet[0] - 1
                            ])) *
                          (matchDetails.totalBettedAmount +
                            matchDetails.treasuryFund +
                            position) *
                          (matchDetails.farmapy / 365) *
                          (matchDetails.lockingPeriod / 86400) +
                          position) /
                        position
                      ).toFixed(2)} */}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              )}
              {matchDetails.startTime + matchDetails.bettingPeriod > currentTime && (
                <Box className="single_bet_bttm_box">
                  <Box className="slidr_flex_box">
                    {/* <Slider
                    defaultValue={50}
                    aria-label='Default'
                    valueLabelDisplay='auto'
                    onChange={(_, value) => setPosition(value as number)}
                    value={position}
                    min={matchDetails.minimumBet}
                    max={accountBalance[matchDetails.farmtoken]}
                  /> */}
                    <Slider
                      defaultValue={1}
                      aria-label="Default"
                      valueLabelDisplay="auto"
                      valueLabelFormat={positionValue + ' %'}
                      onChange={(_, value) => calculateBetAmount(value as number)}
                      value={positionValue}
                      min={0}
                      max={100}
                    />
                    <Box className="num_flex">
                      <Typography component="h5">
                        {/* {matchDetails.minimumBet} {matchDetails.farmtoken} */}
                        0%
                      </Typography>
                      <Typography component="h5">
                        100%
                        {/* {accountBalance[matchDetails.farmtoken] &&
                        accountBalance[matchDetails.farmtoken].slice(
                          0,
                          accountBalance[matchDetails.farmtoken].indexOf('.') +
                            2
                        )}{' '}
                      {matchDetails.farmtoken} */}
                      </Typography>
                    </Box>
                  </Box>

                  <Box className="bet_bttm_cnter_bx">
                    <Box className="bttm_cnter_row">
                      <Typography>Bet Amount:</Typography>
                      <Typography className="input_box_window">
                        {' '}
                        <input className="inpt_box" type="number" value={position} onChange={(e) => changeValue(e.target.value)} />
                        {matchDetails.farmtoken}
                        {/* {position.toFixed(5)} {matchDetails.farmtoken} */}
                      </Typography>
                    </Box>
                    <Box className="bttm_cnter_row">
                      <Typography>Bet Value:</Typography>
                      <Typography>
                        {matchDetails.isLP
                          ? (position * matchDetails.lpPrice).toFixed(2)
                          : (position * getTokenPrice(matchDetails.rewardtoken)).toFixed(2)}
                        &nbsp;$
                        {/* {position.toFixed(5)} {matchDetails.farmtoken} */}
                      </Typography>
                    </Box>
                    <Box className="bttm_cnter_row">
                      <Typography>Possible winning:</Typography>
                      <Typography>
                        {' '}
                        {matchDetails.bettedAmountCalculation && position && selectedBet[0]
                          ? (
                              (((position / (position + matchDetails.bettedAmountCalculation[selectedBet[0] - 1])) *
                                (((matchDetails.totalBettedAmount + matchDetails.treasuryFund + position) *
                                  (matchDetails.farmapy / 365) *
                                  (matchDetails.lockingPeriod / 86400)) /
                                  100)) /
                                2.5 +
                                position) *
                              rewardstakeratio
                            ).toFixed(2)
                          : 0}{' '}
                        {matchDetails.isLP ? matchDetails.rewardtoken : matchDetails.farmtoken}
                      </Typography>
                    </Box>
                    <Box className="bttm_cnter_row">
                      <Typography>Cryptocurrency:</Typography>
                      <Box component="img" src={'../img/tokens/' + matchDetails.farmtoken + '.svg'} alt="" />
                    </Box>
                    <Button onClick={() => (address ? (allowance ? placeBetCall() : approvetx()) : connect())}>
                      {!loading ? (
                        address ? (
                          allowance ? (
                            'Place a Bet'
                          ) : (
                            'Approve'
                          )
                        ) : (
                          'Connect Wallet'
                        )
                      ) : (
                        <CircularProgress size={20} color="inherit" />
                      )}
                    </Button>
                  </Box>

                  <Box className="bet_bttm_last_bx">
                    <Box className="allert_bx">
                      <Box component="img" src="img/allert_ic.svg" alt="" />
                      <Typography>In case your bet is lost, the amount you set will be returned to your balance.</Typography>
                    </Box>
                    <Box className="allert_bx2">
                      <Box component="img" src="img/allert_ic.svg" alt="" />
                      <Typography>
                        Multipliers depend a lot on several external factors, such as apr stability, total number of players and total
                        number of winners. These values are to be intended as a maximum payout.
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              )}
            </Box>
            <Box className="coefficients_box">
              <Typography component="h3">Bet Options</Typography>
              <Box className="coef_tab_prnt">
                <CoeffTab matchDetails={matchDetails} sendToMatch={getSelectedOption} />
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} md={4} className="MobileBox2">
            {/* relative bets start*/}

            <Box className="pdding0_15_respncv">
              <Box className="game_bet_bx">
                <Typography component="h2">Game Bets</Typography>
                <Typography className="game_bat_sub_p">Your bets relative to this match</Typography>
                {bets && bets.length > 0 ? (
                  <Box className="activ_bets_boxes">
                    {bets &&
                      bets.map((bet) => {
                        if (!bet.betRevoked && !bet.betSettled) {
                          return (
                            <Box className="actv_box01" style={{ marginTop: '5px' }}>
                              <Box className="logo_text_prnt">
                                <Box className="logo_left_prnt">
                                  <Box className="volkski_img_prnt">
                                    <Box
                                      component="img"
                                      src={
                                        '../img/participants/' +
                                        matchDetails.matchpartecipant[0] +
                                        '_' +
                                        matchDetails.matchcategory +
                                        '.png'
                                      }
                                      alt=""
                                    />
                                  </Box>
                                  <Box className="korianzombi_img_prnt">
                                    <Box
                                      component="img"
                                      src={
                                        '../img/participants/' +
                                        matchDetails.matchpartecipant[1] +
                                        '_' +
                                        matchDetails.matchcategory +
                                        '.png'
                                      }
                                      alt=""
                                    />
                                  </Box>
                                  <Typography>
                                    {matchDetails.matchpartecipant[0]}
                                    <br />
                                    {matchDetails.matchpartecipant[1]}
                                  </Typography>
                                </Box>
                                <Box className="logo_right_prnt">
                                  {/* <Typography></Typography> */}
                                  <Button className="revokebutton" onClick={() => revokeBetCall(bet.betID)}>
                                    X
                                  </Button>
                                </Box>
                              </Box>
                              <Box className="topwin_row">
                                <Typography>
                                  {/* <span>To win -</span> */}
                                  {getOptionDetails(bet.selectedOutCome, matchDetails.matchcategory).label}
                                </Typography>
                                <Typography component="h6">
                                  {getOptionDetails(bet.selectedOutCome, matchDetails.matchcategory).option.name}
                                </Typography>
                                <Typography component="h6" style={{ width: '95px' }}>
                                  {bet.amount.toFixed(4)} {matchDetails.farmtoken}
                                </Typography>
                                {/* {bet.resultDeclared &&
                                !bet.betRevoked &&
                                !bet.isWinner ? (
                                  ''
                                ) : ( */}
                                <Typography component="h4">
                                  x{' '}
                                  {bet.resultDeclared &&
                                  currentTime > bet.match.lockingPeriod + bet.match.bettingPeriod + bet.match.startTime
                                    ? //? Number(bet.resultDeclared).toFixed(2)
                                      Number((bet.amount + bet.claimableReward) / bet.amount).toFixed(2)
                                    : Number(
                                        getMultiplier(
                                          bet.amount,
                                          bet.match.bettedAmountCalculation[bet.selectedOutCome],
                                          bet.match.totalBettedAmount,
                                          bet.match.treasuryFund,
                                          bet.match.farmapy,
                                          bet.match.lockingPeriod
                                        )
                                      ).toFixed(2)}
                                  {/* {getMultiplier(
                                      bet.amount,
                                      matchDetails.bettedAmountCalculation[
                                        bet.selectedOutCome - 1
                                      ],
                                      matchDetails.totalBettedAmount,
                                      matchDetails.treasuryFund,
                                      matchDetails.farmapy,
                                      matchDetails.lockingPeriod
                                    )} */}
                                </Typography>
                                {/* )} */}
                              </Box>
                              <Button
                                className={
                                  bet.resultDeclared &&
                                  currentTime > bet.match.lockingPeriod + bet.match.bettingPeriod + bet.match.startTime
                                    ? bet.betRevoked
                                      ? 'table_btns yellow_btn_clr'
                                      : bet.isWinner
                                      ? bet.betSettled
                                        ? 'table_btns yellow_btn_clr'
                                        : 'table_btns green_btn_clr'
                                      : bet.betSettled
                                      ? 'table_btns yellow_btn_clr'
                                      : 'table_btns red_btn_clr'
                                    : 'table_btns yellow_btn_clr'
                                }
                                onClick={() => claimBet(bet.match, bet.betID)}
                                disabled={
                                  bet.betRevoked ||
                                  bet.betSettled ||
                                  !bet.resultDeclared ||
                                  currentTime < bet.match.lockingPeriod + bet.match.bettingPeriod + bet.match.startTime
                                }
                              >
                                {bet.resultDeclared && currentTime > bet.match.lockingPeriod + bet.match.bettingPeriod + bet.match.startTime
                                  ? bet.betRevoked
                                    ? 'Revoked Bet'
                                    : bet.isWinner
                                    ? bet.betSettled
                                      ? 'Completed'
                                      : 'Claim'
                                    : bet.betSettled
                                    ? 'Completed'
                                    : 'Withdraw'
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
                      })}
                  </Box>
                ) : (
                  <Box className="nobet_bx">
                    <Box component="img" src="img/allert_ic.svg" alt="" />
                    <Typography>No bets were placed for this match</Typography>
                  </Box>
                )}
              </Box>
            </Box>

            {/* relative bets start*/}
            {selectedBet && selectedBet.length > 0 && (
              <Box className="single_bet_box">
                <Box className="head_txt_clean_img">
                  <Typography component="h3">Single Bet</Typography>
                  <Box component="img" src="img/cleaner_ic.svg" alt="" />
                </Box>
                <Box className="single_bet_inn01">
                  <Box className="check_text_flex_box">
                    <Checkbox {...label} defaultChecked />
                    <Typography>{matchDetails.matchname}</Typography>
                    <Button>
                      <Box component="img" src="../img/close_ic.svg" />
                    </Button>
                  </Box>
                  <Box className="outcom_flex_bx">
                    <Box className="outcom_left">
                      <Typography component="h5">{selectedBet[1]}</Typography>
                      <Typography component="h5">
                        <span>{selectedBet[3]}</span>
                      </Typography>
                    </Box>
                    {/* matchDetails.bettedAmountCalculation[selectedBet[0]]
                          ? matchDetails.bettedAmountCalculation[selectedBet[0]]
                          : 1) */}
                    <Typography component="h6">
                      x
                      {getMultiplier(
                        position,
                        matchDetails.bettedAmountCalculation[selectedBet[0] - 1],
                        matchDetails.totalBettedAmount,
                        matchDetails.treasuryFund,
                        matchDetails.farmapy,
                        matchDetails.lockingPeriod
                      )}
                      {/* {(
                        ((position /
                          (position +
                            matchDetails.bettedAmountCalculation[
                              selectedBet[0] - 1
                            ])) *
                          (matchDetails.totalBettedAmount +
                            matchDetails.treasuryFund +
                            position) *
                          (matchDetails.farmapy / 365) *
                          (matchDetails.lockingPeriod / 86400) +
                          position) /
                        position
                      ).toFixed(2)} */}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            )}
            {matchDetails.startTime + matchDetails.bettingPeriod > currentTime && (
              <Box className="single_bet_bttm_box">
                <Box className="slidr_flex_box">
                  {/* <Slider
                    defaultValue={50}
                    aria-label='Default'
                    valueLabelDisplay='auto'
                    onChange={(_, value) => setPosition(value as number)}
                    value={position}
                    min={matchDetails.minimumBet}
                    max={accountBalance[matchDetails.farmtoken]}
                  /> */}
                  <Slider
                    defaultValue={1}
                    aria-label="Default"
                    valueLabelDisplay="auto"
                    valueLabelFormat={positionValue + ' %'}
                    onChange={(_, value) => calculateBetAmount(value as number)}
                    value={positionValue}
                    min={0}
                    max={100}
                  />
                  <Box className="num_flex">
                    <Typography component="h5">
                      {/* {matchDetails.minimumBet} {matchDetails.farmtoken} */}
                      0%
                    </Typography>
                    <Typography component="h5">
                      100%
                      {/* {accountBalance[matchDetails.farmtoken] &&
                        accountBalance[matchDetails.farmtoken].slice(
                          0,
                          accountBalance[matchDetails.farmtoken].indexOf('.') +
                            2
                        )}{' '}
                      {matchDetails.farmtoken} */}
                    </Typography>
                  </Box>
                </Box>

                <Box className="bet_bttm_cnter_bx">
                  <Box className="bttm_cnter_row">
                    <Typography>Bet Amount:</Typography>
                    <Typography className="input_box_window">
                      {' '}
                      <input className="inpt_box" type="number" value={position} onChange={(e) => changeValue(e.target.value)} />
                      {matchDetails.farmtoken}
                      {/* {position.toFixed(5)} {matchDetails.farmtoken} */}
                    </Typography>
                  </Box>
                  <Box className="bttm_cnter_row">
                    <Typography>Bet Value:</Typography>
                    <Typography>
                      {matchDetails.isLP
                        ? (position * matchDetails.lpPrice).toFixed(2)
                        : (position * getTokenPrice(matchDetails.rewardtoken)).toFixed(2)}
                      &nbsp;$
                      {/* {position.toFixed(5)} {matchDetails.farmtoken} */}
                    </Typography>
                  </Box>
                  <Box className="bttm_cnter_row">
                    <Typography>Possible winning:</Typography>
                    <Typography>
                      {' '}
                      {matchDetails.bettedAmountCalculation && position && selectedBet[0]
                        ? (
                            (((position / (position + matchDetails.bettedAmountCalculation[selectedBet[0] - 1])) *
                              (((matchDetails.totalBettedAmount + matchDetails.treasuryFund + position) *
                                (matchDetails.farmapy / 365) *
                                (matchDetails.lockingPeriod / 86400)) /
                                100)) /
                              2.5 +
                              position) *
                            rewardstakeratio
                          ).toFixed(2)
                        : 0}{' '}
                      {matchDetails.isLP ? matchDetails.rewardtoken : matchDetails.farmtoken}
                    </Typography>
                  </Box>
                  <Box className="bttm_cnter_row">
                    <Typography>Cryptocurrency:</Typography>
                    <a href="https://mm.finance/add/0x97749c9B61F878a880DfE312d2594AE07AEd7656/CRO">
                      <Box component="img" src={'../img/tokens/' + matchDetails.farmtoken + '.svg'} alt="" />
                    </a>
                  </Box>
                  <Button onClick={() => (address ? (allowance ? placeBetCall() : approvetx()) : connect())}>
                    {!loading ? (
                      address ? (
                        allowance ? (
                          'Place a Bet'
                        ) : (
                          'Approve'
                        )
                      ) : (
                        'Connect Wallet'
                      )
                    ) : (
                      <CircularProgress size={20} color="inherit" />
                    )}
                  </Button>
                </Box>

                <Box className="bet_bttm_last_bx">
                  <Box className="allert_bx">
                    <Box component="img" src="img/allert_ic.svg" alt="" />
                    <Typography>In case your bet is lost, the amount you set will be returned to your balance.</Typography>
                  </Box>
                  <Box className="allert_bx2">
                    <Box component="img" src="img/allert_ic.svg" alt="" />
                    <Typography>
                      Multipliers depend a lot on several external factors, such as apr stability, total number of players and total number
                      of winners. These values are to be intended as a maximum payout.
                    </Typography>
                  </Box>
                </Box>
              </Box>
            )}
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
