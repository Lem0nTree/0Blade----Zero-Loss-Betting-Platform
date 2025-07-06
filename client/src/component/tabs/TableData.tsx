import React, { useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Typography, Box, Button, Grid } from '@mui/material';
import { Link } from 'react-router-dom';
import Countdown from 'react-countdown';
import Skeleton from '@mui/material/Skeleton';
import { getMultiplier } from '../../helpers';
import Popover from '@mui/material/Popover';
import { makeStyles } from '@mui/styles';

export default function TableData({ matches, index }: any) {
  const useStyles = makeStyles((theme: any) => ({
    root: {
      flexGrow: 1,
      width: '100%',
      backgroundColor: '#000',
    },
    popover: {
      pointerEvents: 'none',
    },
    paper: {
      padding: '5px',
      width: '250px',
    },
  }));
  const classes = useStyles();

  const [stakeValue, setStakeValue] = useState(0);
  const [claimValue, setClaimValue] = useState(0);

  const [value, setValue] = useState(0);

  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);

  const currentTime = Date.now() / 1000;
  if (index === 0) {
    matches = matches.filter((match) => {
      return !(
        currentTime > match.startTime + match.bettingPeriod + match.lockingPeriod &&
        currentTime > match.startTime + match.bettingPeriod + match.lockingPeriod &&
        currentTime > match.startTime + match.bettingPeriod
      );
    });
  } else if (index === 1) {
    matches = matches.filter((match) => {
      return currentTime < match.startTime + match.bettingPeriod;
    });
  } else if (index === 2) {
    matches = matches.filter((match) => {
      return (
        currentTime < match.startTime + match.bettingPeriod + match.lockingPeriod && currentTime > match.startTime + match.bettingPeriod
      );
    });
  } else if (index === 3) {
    matches = matches.filter((match) => {
      return (
        currentTime > match.startTime + match.bettingPeriod + match.lockingPeriod &&
        currentTime > match.startTime + match.bettingPeriod + match.lockingPeriod &&
        currentTime > match.startTime + match.bettingPeriod
      );
    });
  }
  const renderer = ({ days, hours, minutes, seconds, completed }: any) => {
    // Render a countdown
    return (
      <span>
        {hours + days * 24}:{minutes}:{seconds}
      </span>
    );
  };

  return (
    <>
      <TableContainer component={Paper} className="table_prnt">
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell className="bett_padding">Betting Status</TableCell>
              <TableCell align="left">Match</TableCell>
              <TableCell align="left">
                <Box className="d_flex">
                  LossRisk
                  <Typography
                    aria-owns={open ? 'mouse-over-popover' : undefined}
                    aria-haspopup="true"
                    onMouseEnter={handlePopoverOpen}
                    onMouseLeave={handlePopoverClose}
                    className="second_img second_img_prnt"
                  >
                    <img src="/img/cmbnd_second_icon02.svg" alt="" />
                  </Typography>
                  <Popover
                    id="mouse-over-popover"
                    className={classes.popover}
                    classes={{
                      paper: classes.paper,
                    }}
                    open={open}
                    anchorEl={anchorEl}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'center',
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'center',
                    }}
                    onClose={handlePopoverClose}
                    disableRestoreFocus
                  >
                    <Typography>Lorem ipsum dolor sit amet consectetur adipisicing elit. Pariatur, similique.</Typography>
                  </Popover>
                </Box>
              </TableCell>
              <TableCell align="center">1</TableCell>
              <TableCell align="center">X</TableCell>
              <TableCell align="center">2</TableCell>
              <TableCell align="center"></TableCell>
              <TableCell align="left">Bet Currency</TableCell>
              <TableCell align="center"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {matches.map((match: any) => (
              <TableRow key={match.name} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell component="th" scope="row">
                  {/* {row.name} */}
                  <Box className="batting_colomn">
                    <Typography>
                      {' '}
                      {currentTime < match.startTime
                        ? 'Soon'
                        : currentTime < match.startTime + match.bettingPeriod
                        ? 'Open'
                        : currentTime < match.startTime + match.bettingPeriod + match.lockingPeriod
                        ? 'Staking'
                        : currentTime > match.startTime + match.bettingPeriod + match.lockingPeriod + match.claimingPeriod
                        ? 'Completed'
                        : 'Finished'}
                    </Typography>

                    {match.startTime && currentTime && currentTime < match.startTime ? (
                      <Typography component="h6" className="comingsoonmatch">
                        <Countdown date={match.startTime * 1000} renderer={renderer} />
                      </Typography>
                    ) : currentTime < match.startTime + match.bettingPeriod ? (
                      <Typography component="h6">
                        <Countdown date={(match.startTime + match.bettingPeriod) * 1000} renderer={renderer} />
                      </Typography>
                    ) : currentTime < match.startTime + match.bettingPeriod + match.lockingPeriod ? (
                      <Typography component="h6" className="purple">
                        Locked
                      </Typography>
                    ) : currentTime > match.startTime + match.bettingPeriod + match.lockingPeriod + match.claimingPeriod ? (
                      <Typography component="h6" className="complt">
                        Completed
                      </Typography>
                    ) : (
                      <Typography component="h6" className="complt">
                        Completed
                      </Typography>
                    )}
                    {/* <Typography component='h6' className='purple'>
                      Staking
                    </Typography> */}
                    {/* <Typography component='h6' className='complt'>
                      Completed
                    </Typography> */}
                    {/* <Typography component='h6' className='cncl'>
                      Cancelled
                    </Typography> */}
                  </Box>
                </TableCell>
                <TableCell align="center">
                  <Link to={'/match/' + match.matchID} className="match_colum_bx">
                    {/* <Box component="img" src="img/match_01.svg" alt="" /> */}
                    <Box className="volkski_img_prnt">
                      <Box
                        component="img"
                        src={'../img/participants/' + match.matchpartecipant[0] + '_' + match.matchcategory + '.png'}
                        alt=""
                      />
                    </Box>
                    <Box className="korianzombi_img_prnt">
                      <Box
                        component="img"
                        src={'../img/participants/' + match.matchpartecipant[1] + '_' + match.matchcategory + '.png'}
                        alt=""
                      />
                    </Box>
                    <Typography className="match_p">
                      {match.matchpartecipant[0]} <br />
                      {match.matchpartecipant[1]}
                    </Typography>
                  </Link>
                </TableCell>
                <TableCell align="left">
                  <Typography>{match.withDrawFee}%</Typography>
                </TableCell>
                <TableCell align="center">
                  {' '}
                  <Typography component="h5" className="all_x">
                    {match.bettedAmountCalculation ? (
                      getMultiplier(
                        10,
                        match.bettedAmountCalculation[0],
                        match.totalBettedAmount,
                        match.treasuryFund,
                        match.farmapy,
                        match.lockingPeriod
                      )
                    ) : (
                      <Skeleton width={100} height={30} variant="rectangular" />
                    )}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  {' '}
                  <Typography component="h5" className="all_x">
                    {match.bettedAmountCalculation ? (
                      getMultiplier(
                        10,
                        match.bettedAmountCalculation[1],
                        match.totalBettedAmount,
                        match.treasuryFund,
                        match.farmapy,
                        match.lockingPeriod
                      )
                    ) : (
                      <Skeleton width={100} height={30} variant="rectangular" />
                    )}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  {' '}
                  <Typography component="h5" className="all_x">
                    {match.bettedAmountCalculation ? (
                      getMultiplier(
                        10,
                        match.bettedAmountCalculation[2],
                        match.totalBettedAmount,
                        match.treasuryFund,
                        match.farmapy,
                        match.lockingPeriod
                      )
                    ) : (
                      <Skeleton width={100} height={30} variant="rectangular" />
                    )}
                  </Typography>
                </TableCell>

                <TableCell align="left">
                  <Box component="img" src="img/corrnc_text.svg" alt="" />,
                </TableCell>
                <TableCell align="left">
                  <Box component="img" src={'img/tokens/' + match.farmtoken + '.svg'} alt="" className="corrency_01" />
                </TableCell>

                <TableCell>
                  <Link to={'/match/' + match.matchID} className="match_colum_bx">
                    <Button className="last_cell_btn green_bg">
                      {currentTime > match.startTime + match.bettingPeriod + match.lockingPeriod ? 'Claim Bets' : 'Deposit Funds'}
                    </Button>
                    {/* <Button className='last_cell_btn lite_border'>Withdraw Funds</Button> */}
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {matches.map((match: any) => (
        <Box className="mobl_frax_box mobl_frax_box_as" key={match.name}>
          {match.isBoosted && (
            <Box className="rocket_ic_prnt">
              <Box component="img" src="/img/rocket_ic.svg" alt="" className="rocket_ic" />
            </Box>
          )}
          <Box className="frax_bx_mob">
            <Link to={'/match/' + match.matchID} className="match_colum_bx match_colum_bx_as">
              {/* <Box component="img" src="img/match_01.svg" alt="" /> */}
              <Box className="volkski_img_prnt">
                <Box component="img" src={'../img/participants/' + match.matchpartecipant[0] + '_' + match.matchcategory + '.png'} alt="" />
              </Box>
              <Typography className="match_p">
                {match.matchpartecipant[0]} - {match.matchpartecipant[1]}
              </Typography>
              <Box className="korianzombi_img_prnt">
                <Box component="img" src={'../img/participants/' + match.matchpartecipant[1] + '_' + match.matchcategory + '.png'} alt="" />
              </Box>
            </Link>
          </Box>
          <Box className="mult_h3_p_box">
            <Typography component="h3">
              {currentTime < match.startTime + match.bettingPeriod && <span className="pls_efct_dot pulse" />}
              {/* Betting Status */}
              <Typography>
                {' '}
                {currentTime < match.startTime
                  ? 'Soon'
                  : currentTime < match.startTime + match.bettingPeriod
                  ? 'Open'
                  : currentTime < match.startTime + match.bettingPeriod + match.lockingPeriod
                  ? 'Staking'
                  : currentTime > match.startTime + match.bettingPeriod + match.lockingPeriod + match.claimingPeriod
                  ? 'Completed'
                  : 'Finished'}
              </Typography>
            </Typography>
            <Box className="batting_colomn">
              

              {match.startTime && currentTime && currentTime < match.startTime ? (
                <Typography component="h6" className="comingsoonmatch">
                  <Countdown date={match.startTime * 1000} renderer={renderer} />
                </Typography>
              ) : currentTime < match.startTime + match.bettingPeriod ? (
                <Typography component="h6">
                  <Countdown date={(match.startTime + match.bettingPeriod) * 1000} renderer={renderer} />
                </Typography>
              ) : currentTime < match.startTime + match.bettingPeriod + match.lockingPeriod ? (
                <Typography component="h6" className="purple">
                  Locked
                </Typography>
              ) : currentTime > match.startTime + match.bettingPeriod + match.lockingPeriod + match.claimingPeriod ? (
                <Typography component="h6" className="complt">
                  Completed
                </Typography>
              ) : (
                <Typography component="h6" className="complt">
                  Completed
                </Typography>
              )}
              {/* <Typography component='h6' className='purple'>
                      Staking
                    </Typography> */}
              {/* <Typography component='h6' className='complt'>
                      Completed
                    </Typography> */}
              {/* <Typography component='h6' className='cncl'>
                      Cancelled
                    </Typography> */}
            </Box>
          </Box>
          <Box className="mult_h3_p_box">
            <Typography component="h3">
              <Box className="d_flex">
                LossRisk
                <Typography
                  aria-owns={open ? 'mouse-over-popover' : undefined}
                  aria-haspopup="true"
                  onMouseEnter={handlePopoverOpen}
                  onMouseLeave={handlePopoverClose}
                  className="second_img second_img_prnt"
                >
                  <img src="/img/cmbnd_second_icon02.svg" alt="" />
                </Typography>
                <Popover
                  id="mouse-over-popover"
                  className={classes.popover}
                  classes={{
                    paper: classes.paper,
                  }}
                  open={open}
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                  }}
                  onClose={handlePopoverClose}
                  disableRestoreFocus
                >
                  <Typography>Lorem ipsum dolor sit amet consectetur adipisicing elit. Pariatur, similique.</Typography>
                </Popover>
              </Box>
            </Typography>
            <Box className="mult_h3_p_box">
              <Typography>{match.withDrawFee}%</Typography>
            </Box>
          </Box>
          <Grid container spacing={1}>
            <Grid item xs={4}>
              <Box className="mult_h3_p_box mult_h3_p_box_top">
                <Typography component="h3">1</Typography>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box className="mult_h3_p_box mult_h3_p_box_top" justifyContent="center">
                <Typography component="h3">X</Typography>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box className="mult_h3_p_box mult_h3_p_box_top" justifyContent="flex-end">
                <Typography component="h3">2</Typography>
              </Box>
            </Grid>

            <Grid item xs={4}>
              <Box className="mult_h3_p_box">
                <Typography component="h5">
                  {match.bettedAmountCalculation ? (
                    getMultiplier(
                      10,
                      match.bettedAmountCalculation[0],
                      match.totalBettedAmount,
                      match.treasuryFund,
                      match.farmapy,
                      match.lockingPeriod
                    )
                  ) : (
                    <Skeleton width={100} height={30} variant="rectangular" />
                  )}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box className="mult_h3_p_box" justifyContent="center">
                <Typography component="h5">
                  {match.bettedAmountCalculation ? (
                    getMultiplier(
                      10,
                      match.bettedAmountCalculation[1],
                      match.totalBettedAmount,
                      match.treasuryFund,
                      match.farmapy,
                      match.lockingPeriod
                    )
                  ) : (
                    <Skeleton width={100} height={30} variant="rectangular" />
                  )}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box className="mult_h3_p_box" justifyContent="flex-end">
                <Typography component="h5">
                  {match.bettedAmountCalculation ? (
                    getMultiplier(
                      10,
                      match.bettedAmountCalculation[1],
                      match.totalBettedAmount,
                      match.treasuryFund,
                      match.farmapy,
                      match.lockingPeriod
                    )
                  ) : (
                    <Skeleton width={100} height={30} variant="rectangular" />
                  )}
                </Typography>
              </Box>
            </Grid>
          </Grid>
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <Box className="mult_h3_p_box mult_h3_p_box_top">
                <Typography component="h3">Bet Currency</Typography>
              </Box>
            </Grid>

            <Grid item xs={6}>
              <Box className="mult_h3_p_box " justifyContent="flex-end">
                <TableCell align="left" className="img_pdig_aj">
                  <Box component="img" src={'img/tokens/' + match.farmtoken + '.svg'} alt="" className="corrency_01 corrency_01_as" />
                </TableCell>
              </Box>
            </Grid>
          </Grid>
          <Box className="two_btn_m">
            <Link to={'/match/' + match.matchID} className="match_colum_bx green_bg_aj">
              <Button className="last_cell_btn green_bg green_bg_aj">
                {currentTime > match.startTime + match.bettingPeriod + match.lockingPeriod ? 'Claim Bets' : 'Deposit Funds'}
              </Button>
            </Link>
          </Box>
        </Box>
      ))}
    </>
  );
}
