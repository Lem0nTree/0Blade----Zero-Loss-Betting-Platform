import React, { useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Typography, Box, Button, Grid } from '@mui/material';
import Popover from '@mui/material/Popover';
import { makeStyles } from '@mui/styles';

export default function TableData({ matches = [], index }: any) {
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

  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);

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
            {matches.length === 0 && (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  <Typography>No matches available</Typography>
                </TableCell>
              </TableRow>
            )}
            {matches.map((match: any, idx: number) => {
              const currentTime = Date.now() / 1000;
              const getStatus = () => {
                if (currentTime < match.startTime) return 'Soon';
                if (currentTime < match.startTime + match.bettingPeriod) return 'Open';
                if (currentTime < match.startTime + match.bettingPeriod + match.lockingPeriod) return 'Locked';
                return 'Finished';
              };

              // Calculate multipliers (simplified)
              const calculateMultiplier = (betAmount: number, index: number) => {
                const total = match.totalBettedAmount + match.treasuryFund;
                const betted = match.bettedAmountCalculation?.[index] || 0;
                if (betted === 0) return 1.0;
                return (total / betted).toFixed(2);
              };

              return (
                <TableRow key={match.matchID || idx} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell component="th" scope="row">
                    <Box className="batting_colomn">
                      <Typography>{getStatus()}</Typography>
                      <Typography component="h6">00:00:00</Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <a href={`/match/${match.matchID}`} className="match_colum_bx">
                      <Box className="volkski_img_prnt">
                        <Box 
                          component="img" 
                          src={`img/participants/${match.matchpartecipant[0]}_${match.matchcategory}.png`} 
                          alt="" 
                        />
                      </Box>
                      <Box className="korianzombi_img_prnt">
                        <Box 
                          component="img" 
                          src={`img/participants/${match.matchpartecipant[1]}_${match.matchcategory}.png`} 
                          alt="" 
                        />
                      </Box>
                      <Typography className="match_p">
                        {match.matchpartecipant[0]} <br />
                        {match.matchpartecipant[1]}
                      </Typography>
                    </a>
                  </TableCell>
                  <TableCell align="left">
                    <Typography>{match.withDrawFee || 5}%</Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography component="h5" className="all_x">
                      {match.bettedAmountCalculation?.[0] ? calculateMultiplier(match.bettedAmountCalculation[0], 0) : '1.50'}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography component="h5" className="all_x">
                      {match.bettedAmountCalculation?.[1] ? calculateMultiplier(match.bettedAmountCalculation[1], 1) : '2.00'}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography component="h5" className="all_x">
                      {match.bettedAmountCalculation?.[2] ? calculateMultiplier(match.bettedAmountCalculation[2], 2) : '1.75'}
                    </Typography>
                  </TableCell>
                  <TableCell align="left">
                    <Box component="img" src="img/corrnc_text.svg" alt="" />
                  </TableCell>
                  <TableCell align="left">
                    <Box component="img" src={`img/tokens/${match.farmtoken?.toLowerCase() || 'frax'}_ic.svg`} alt="" className="corrency_01" />
                  </TableCell>
                  <TableCell>
                    <a href={`/match/${match.matchID}`} className="match_colum_bx">
                      <Button className="last_cell_btn green_bg">
                        Deposit Funds
                      </Button>
                    </a>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      {matches.map((match: any, idx: number) => {
        const currentTime = Date.now() / 1000;
        const getStatus = () => {
          if (currentTime < match.startTime) return 'Soon';
          if (currentTime < match.startTime + match.bettingPeriod) return 'Open';
          if (currentTime < match.startTime + match.bettingPeriod + match.lockingPeriod) return 'Locked';
          return 'Finished';
        };

        return (
        <Box className="mobl_frax_box mobl_frax_box_as" key={idx}>
          {match.isBoosted && (
            <Box className="rocket_ic_prnt">
              <Box component="img" src="/img/rocket_ic.svg" alt="" className="rocket_ic" />
            </Box>
          )}
          <Box className="frax_bx_mob">
            <a href={`/match/${match.matchID}`} className="match_colum_bx match_colum_bx_as">
              <Box className="volkski_img_prnt">
                <Box 
                  component="img" 
                  src={`img/participants/${match.matchpartecipant[0]}_${match.matchcategory}.png`} 
                  alt="" 
                />
              </Box>
              <Typography className="match_p">
                {match.matchpartecipant[0]} - {match.matchpartecipant[1]}
              </Typography>
              <Box className="korianzombi_img_prnt">
                <Box 
                  component="img" 
                  src={`img/participants/${match.matchpartecipant[1]}_${match.matchcategory}.png`} 
                  alt="" 
                />
              </Box>
            </a>
          </Box>
          <Box className="mult_h3_p_box">
            <Typography component="h3">
              {currentTime < match.startTime + match.bettingPeriod && <span className="pls_efct_dot pulse" />}
              <Typography>{getStatus()}</Typography>
            </Typography>
            <Box className="batting_colomn">
              <Typography component="h6">00:00:00</Typography>
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
              <Typography>{match.withDrawFee || 5}%</Typography>
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
                  {match.bettedAmountCalculation?.[0] 
                    ? ((match.totalBettedAmount + match.treasuryFund) / (match.bettedAmountCalculation[0] || 1)).toFixed(2)
                    : '1.50'}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box className="mult_h3_p_box" justifyContent="center">
                <Typography component="h5">
                  {match.bettedAmountCalculation?.[1] 
                    ? ((match.totalBettedAmount + match.treasuryFund) / (match.bettedAmountCalculation[1] || 1)).toFixed(2)
                    : '2.00'}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box className="mult_h3_p_box" justifyContent="flex-end">
                <Typography component="h5">
                  {match.bettedAmountCalculation?.[2] 
                    ? ((match.totalBettedAmount + match.treasuryFund) / (match.bettedAmountCalculation[2] || 1)).toFixed(2)
                    : '1.75'}
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
                <Box component="img" src={`img/tokens/${match.farmtoken?.toLowerCase() || 'frax'}_ic.svg`} alt="" className="corrency_01 corrency_01_as" />
              </Box>
            </Grid>
          </Grid>
          <Box className="two_btn_m">
            <a href={`/match/${match.matchID}`} className="match_colum_bx green_bg_aj">
              <Button className="last_cell_btn green_bg green_bg_aj">
                Deposit Funds
              </Button>
            </a>
          </Box>
        </Box>
        );
      })}
    </>
  );
}
