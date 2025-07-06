import React from 'react';
import { Box, Typography, Grid } from '@mui/material';
import Slider from '@mui/material/Slider';
import { format } from 'date-fns';
import Countdown from 'react-countdown';

export default function ({ matchDetails }: any) {
  const currentTime = Date.now() / 1000;

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
      <Box className='tabone_main'>
        <Box className='star_time_data_bx'>
          <Box className='team_logo_name'>
            {/* <Box component="img" src="img/espa_tem_logo.svg" /> */}
            <Box className='volkski_img_prnt'>
              <Box
                component='img'
                src={
                  '../img/participants/' +
                  matchDetails.matchpartecipant[0] +
                  '_' +
                  matchDetails.matchcategory +
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
                  matchDetails.matchpartecipant[1] +
                  '_' +
                  matchDetails.matchcategory +
                  '.png'
                }
                alt=''
              />
            </Box>
            <Typography component='h6'>
              {matchDetails.matchpartecipant[0]}
              <br />
              {matchDetails.matchpartecipant[1]}
            </Typography>
          </Box>
          <Box className='time_data_right'>
            <Typography>Start of the match</Typography>
            <Typography component='h5'>
              {format(new Date(matchDetails.date * 1000), 'dd-MM-yyyy')}
            </Typography>
          </Box>
        </Box>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Box width='full' className='range_slider_prnt'>
              <Slider
                value={currentTime}
                min={matchDetails.startTime}
                max={matchDetails.startTime + matchDetails.bettingPeriod}
                defaultValue={50}
                aria-label='Default'
                valueLabelDisplay='auto'
              />
            </Box>
            <Box className='bet_lock_clai_box'>
              <Typography component='h4'>
                {matchDetails.startTime < currentTime &&
                matchDetails.startTime + matchDetails.bettingPeriod >
                  currentTime ? (
                  <span className='activeperiod'>Betting Period: &nbsp;
                    <Countdown
                    date={
                      (matchDetails.startTime + matchDetails.bettingPeriod) *
                      1000
                    }
                    className={"micci"}
                    renderer={renderer}
                  /></span>
                ) : (
                  <span>Betting Period: {(matchDetails.bettingPeriod / 86400).toFixed(0)} Days</span>
                )}
                {/* <span>
                  <Countdown
                    date={
                      (matchDetails.startTime + matchDetails.bettingPeriod) *
                      1000
                    }
                    renderer={renderer}
                  />
                </span> */}
              </Typography>

              {/* <Typography component='h4'>Betting Period</Typography>
              <span><Countdown
                  date={
                    (matchDetails.startTime +
                      matchDetails.bettingPeriod ) *
                    1000
                  }
                  renderer={renderer}
                /></span> */}
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box
              width='full'
              className='range_slider_prnt range_slider_prnt_02'
            >
              <Slider
                value={currentTime}
                min={matchDetails.startTime + matchDetails.bettingPeriod}
                max={
                  matchDetails.startTime +
                  matchDetails.bettingPeriod +
                  matchDetails.lockingPeriod
                }
                aria-label='Default'
                valueLabelDisplay='auto'
              />
            </Box>
            <Box className='bet_lock_clai_box'>
              <Typography component='h4'>
                {matchDetails.startTime + matchDetails.bettingPeriod <
                  currentTime &&
                matchDetails.startTime +
                  matchDetails.bettingPeriod +
                  matchDetails.lockingPeriod >
                  currentTime ? (
                    <span className='activeperiod'>Locked Period: &nbsp;
                    <Countdown
                    date={
                      (matchDetails.startTime +
                        matchDetails.bettingPeriod +
                        matchDetails.lockingPeriod) *
                      1000
                    }
                    renderer={renderer}
                  /></span>
                ) : (
                  <span>Locked Period: {matchDetails.lockingPeriod / 86400} Days</span>
                )}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box
              width='full'
              className='range_slider_prnt range_slider_prnt_02 range_slider_prnt_03'
            >
              <Slider
                value={currentTime}
                min={
                  matchDetails.startTime +
                  matchDetails.bettingPeriod +
                  matchDetails.lockingPeriod
                }
                max={
                  matchDetails.startTime +
                  matchDetails.bettingPeriod +
                  matchDetails.lockingPeriod +
                  matchDetails.claimingPeriod
                }
                aria-label='Default'
                valueLabelDisplay='auto'
              />
            </Box>
            <Box className='bet_lock_clai_box'>
              <Typography component='h4'>
                {matchDetails.startTime +
                  matchDetails.bettingPeriod +
                  matchDetails.lockingPeriod <
                  currentTime &&
                matchDetails.startTime +
                  matchDetails.bettingPeriod +
                  matchDetails.lockingPeriod +
                  matchDetails.claimingPeriod >
                  currentTime ? (
                  <span className='activeperiod'>Claiming Period: &nbsp;
                  <Countdown
                    date={
                      (matchDetails.startTime +
                        matchDetails.bettingPeriod +
                        matchDetails.lockingPeriod +
                        matchDetails.claimingPeriod) *
                      1000
                    }
                    renderer={renderer}
                  /></span>
                ) : (
                  <span>Claiming Period: {matchDetails.claimingPeriod / 86400} Days</span>
                )}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
