import React from 'react';
import { Box, Grid, Button, Skeleton } from '@mui/material';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { getMultiplier, getSportIcon } from '../../../helpers';
import { getOptionDetails } from '../../../helpers/get-betOption';
import { useDispatch } from 'react-redux';
import { claim } from '../../../store/slices/matches-slice';
import { useWeb3Context } from '../../../hooks';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

function Row({ bet }) {
  const [open, setOpen] = React.useState(false);
  const dispatch = useDispatch();
  const { connect, provider, hasCachedProvider, chainID, connected, address } = useWeb3Context();

  const claimBet = async (match, betId) => {
    await dispatch(
      claim({
        match,
        betId,
        provider,
      })
    );
  };

  const currentTime = Date.now() / 1000;

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell component="th" scope="row">
          <Box className="border_right">
            <Box component="img" src={'img/menu/' + getSportIcon(bet.match.matchcategory)} />
          </Box>
        </TableCell>
        <TableCell align="left">
          <Link to={'/match/' + bet.match.matchID} className="match_colum_bx">
            <Box className="match_flex_td">
              <Box className="volkski_img_prnt">
                <Box
                  component="img"
                  src={'../img/participants/' + bet.match.matchpartecipant[0] + '_' + bet.match.matchcategory + '.png'}
                  alt=""
                />
              </Box>
              <Box className="korianzombi_img_prnt">
                <Box
                  component="img"
                  src={'../img/participants/' + bet.match.matchpartecipant[1] + '_' + bet.match.matchcategory + '.png'}
                  alt=""
                />
              </Box>
              <Typography>
                {bet.match.matchpartecipant[0]}
                <br />
                {bet.match.matchpartecipant[1]}
              </Typography>
            </Box>
          </Link>
        </TableCell>
        <TableCell align="left">
          <Typography component="h6" className="towin_espa">
            <span>{getOptionDetails(bet.selectedOutCome, bet.match.matchcategory).label} -</span>{' '}
            {getOptionDetails(bet.selectedOutCome, bet.match.matchcategory).option.name}
          </Typography>
        </TableCell>
        <TableCell align="left">
          <Typography component="h5" className="num_colm">
            x
            {bet.resultDeclared && currentTime > bet.match.lockingPeriod + bet.match.bettingPeriod + bet.match.startTime
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
          </Typography>
        </TableCell>
        <TableCell align="left">
          <Box className="amount_td">
            <Box component="img" src={'img/tokens/' + bet.match.farmtoken + '.svg'} />
            <Typography>{bet.amount ? bet.amount.toFixed(4) : <Skeleton variant="text" />}</Typography>
          </Box>
        </TableCell>
        <TableCell align="center">
          <Typography className="prize_p">
            {bet.resultDeclared && currentTime > bet.match.lockingPeriod + bet.match.bettingPeriod + bet.match.startTime
              ? //? Number(bet.resultDeclared).toFixed(2)
                Number(bet.amount + bet.claimableReward).toFixed(2)
              : (
                  Number(
                    getMultiplier(
                      bet.amount,
                      bet.match.bettedAmountCalculation[bet.selectedOutCome],
                      bet.match.totalBettedAmount,
                      bet.match.treasuryFund,
                      bet.match.farmapy,
                      bet.match.lockingPeriod
                    )
                  ) * bet.amount
                ).toFixed(2)}
          </Typography>
        </TableCell>
        <TableCell align="left">
          {/* red_btn_clr */}
          {/* cmplt_btn_clr */}
          <Button
            className={
              bet.resultDeclared && currentTime > bet.match.lockingPeriod + bet.match.bettingPeriod + bet.match.startTime
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
            // className={
            //   bet.resultDeclared &&
            //   bet.isWinner &&
            //   !bet.betSettle &&
            //   !bet.betRevoked
            //     ? 'table_btns green_btn_clr'
            //     : bet.resultDeclared &&
            //       !bet.betRevoked &&
            //       !bet.isWinner &&
            //       !bet.betSettle
            //     ? 'table_btns red_btn_clr'
            //     : bet.betRevoked
            //     ? 'table_btns yellow_btn_clr'
            //     : 'table_btns cmplt_btn_clr'
            // }
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
              : 'Wait for Result'}

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
        </TableCell>
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)} className="table_expnd_btn">
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8} className="table_collpse_data">
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box className="border_top_box">
              <Box className="border_top_box_inn">
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <Typography component="h6">
                      <span>Start of the match: </span> {format(new Date(bet.match.startTime * 1000), 'dd-MM-yyyy')}
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography component="h6">
                      <span>Total Value Betted:</span> {Number(bet.totalBettedAmount).toFixed(2)} {bet.match.farmtoken}
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography component="h6" className="last_h6">
                      <span>Total Bets: </span> {bet.totalBets}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

function Rowtwo({ bet }) {
  const [open, setOpen] = React.useState(false);
  const dispatch = useDispatch();
  const { connect, provider, hasCachedProvider, chainID, connected, address } = useWeb3Context();

  const claimBet = async (match, betId) => {
    await dispatch(
      claim({
        match,
        betId,
        provider,
      })
    );
  };

  const currentTime = Date.now() / 1000;

  return (
    <React.Fragment>
      <Box className="mobl_frax_box mobl_frax_box_as">
        <Box className="rocket_ic_prnt rocket_ic_prnt_v2">
          <Box
            component="img"
            // src="/img/rocket_ic.svg"
            src={'img/menu/' + getSportIcon(bet.match.matchcategory)}
            alt=""
            className="rocket_ic"
          />
        </Box>
        <Box className="frax_bx_mob">
          <Link to={'/match/' + bet.match.matchID} className="match_colum_bx match_colum_bx_as">
            {/* <Box component="img" src="img/match_01.svg" alt="" /> */}
            <Box className="volkski_img_prnt">
              <Box
                component="img"
                src={'../img/participants/' + bet.match.matchpartecipant[0] + '_' + bet.match.matchcategory + '.png'}
                alt=""
              />
            </Box>
            <Typography className="match_p">
              {bet.match.matchpartecipant[0]} - {bet.match.matchpartecipant[1]}
            </Typography>
            <Box className="korianzombi_img_prnt">
              <Box
                component="img"
                src={'../img/participants/' + bet.match.matchpartecipant[1] + '_' + bet.match.matchcategory + '.png'}
                alt=""
              />
            </Box>
          </Link>
        </Box>
        <Box className="mult_h3_p_box">
          <Typography component="h3" className='frmrgntpv1'>
            {currentTime < bet.match.startTime + bet.match.bettingPeriod && <span className="pls_efct_dot pulse" />}
            Betting Status
          </Typography>
          <Box className="batting_colomn">
            <Typography className='mr0'>
              {' '}
              <Button
                className={
                  bet.resultDeclared && currentTime > bet.match.lockingPeriod + bet.match.bettingPeriod + bet.match.startTime
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
                // className={
                //   bet.resultDeclared &&
                //   bet.isWinner &&
                //   !bet.betSettle &&
                //   !bet.betRevoked
                //     ? 'table_btns green_btn_clr'
                //     : bet.resultDeclared &&
                //       !bet.betRevoked &&
                //       !bet.isWinner &&
                //       !bet.betSettle
                //     ? 'table_btns red_btn_clr'
                //     : bet.betRevoked
                //     ? 'table_btns yellow_btn_clr'
                //     : 'table_btns cmplt_btn_clr'
                // }
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
                  : 'Wait for Result'}

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
            </Typography>
          </Box>
        </Box>
        <Grid container spacing={1}>
          <Grid item xs={4}>
            <Box className="mult_h3_p_box mult_h3_p_box_top">
              <Typography component="h3">Bet</Typography>
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box className="mult_h3_p_box mult_h3_p_box_top" justifyContent="center">
              <Typography component="h3">Multiplier</Typography>
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box className="mult_h3_p_box mult_h3_p_box_top" justifyContent="flex-end">
              <Typography component="h3">Amount</Typography>
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box className="mult_h3_p_box frmrgntpv2">
              <Typography>
                <span className='ml0'>{getOptionDetails(bet.selectedOutCome, bet.match.matchcategory).label} -</span>{' '}
                {getOptionDetails(bet.selectedOutCome, bet.match.matchcategory).option.name}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box className="mult_h3_p_box" justifyContent="center">
              <Typography component="h5">
                x
                {bet.resultDeclared && currentTime > bet.match.lockingPeriod + bet.match.bettingPeriod + bet.match.startTime
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
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box className="mult_h3_p_box" justifyContent="flex-end">
              <Typography component="h5">
                <Box className="amount_td">
                  <Box component="img" src={'img/tokens/' + bet.match.farmtoken + '.svg'} />
                  <Typography>{bet.amount ? bet.amount.toFixed(4) : <Skeleton variant="text" />}</Typography>
                </Box>
              </Typography>
            </Box>
          </Grid>
        </Grid>
        <Grid container spacing={1}>
          <Grid item xs={6}>
            <Box className="mult_h3_p_box mult_h3_p_box_top">
              <Typography component="h3">Prize</Typography>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box className="mult_h3_p_box frmrgntpv3" justifyContent="flex-end">
              <Typography component="h5" className='prize_p'>
                {bet.resultDeclared && currentTime > bet.match.lockingPeriod + bet.match.bettingPeriod + bet.match.startTime
                  ? //? Number(bet.resultDeclared).toFixed(2)
                    Number(bet.amount + bet.claimableReward).toFixed(2)
                  : (
                      Number(
                        getMultiplier(
                          bet.amount,
                          bet.match.bettedAmountCalculation[bet.selectedOutCome],
                          bet.match.totalBettedAmount,
                          bet.match.treasuryFund,
                          bet.match.farmapy,
                          bet.match.lockingPeriod
                        )
                      ) * bet.amount
                    ).toFixed(2)}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={4}></Grid>
          <Grid item xs={4}></Grid>
        </Grid>
        <Box className="table_expnd_btn_prnt">
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)} className="table_expnd_btn">
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </Box>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <Box className="border_top_box border_top_box_ash ">
            <Box className="border_top_box_inn border_top_box_inn_ash">
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Typography component="h6">
                    <span>Start of the match: </span> {format(new Date(bet.match.startTime * 1000), 'dd-MM-yyyy')}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography component="h6">
                    <span>Total Value Betted:</span> {Number(bet.totalBettedAmount).toFixed(2)} {bet.match.farmtoken}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography component="h6" className="last_h6">
                    <span>Total Bets: </span> {bet.totalBets}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Collapse>
      </Box>
    </React.Fragment>
  );
}

export default function TableOfHistory({ activeBet, active }: any) {
  return (
    <>
      <Box className="history_bets_prnt">
        <Box className="head_filter_prnt">
          <Typography component="h3">{active ? 'Active Bets' : 'Bet History'}</Typography>
          <Box className="filter_box">
            <Box component="img" src="img/filter_ic.svg" alt="" />
            <Typography>Filter</Typography>
            <input type="number" placeholder="1" />
          </Box>
        </Box>
        <TableContainer component={Paper} className="history_table_prnt d_none_767">
          <Table aria-label="collapsible table">
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                <TableCell align="left">Match</TableCell>
                <TableCell align="left">Bet</TableCell>
                <TableCell align="left"></TableCell>
                <TableCell align="left">Amount</TableCell>
                <TableCell align="center">Prize</TableCell>
                <TableCell />
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {activeBet.map((row) => (
                <Row bet={row} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box>
          {activeBet.map((row) => (
            <Rowtwo bet={row} />
          ))}
        </Box>
      </Box>
    </>
  );
}
