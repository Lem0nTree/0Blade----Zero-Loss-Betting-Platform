import React from 'react';
import { Box, Typography, Grid } from '@mui/material';
import Slider from '@mui/material/Slider';

export default function TabOneData({ matchDetails }: any) {
  const currentTime = Date.now() / 1000;
  
  // Calculate dates for display
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
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
                  matchDetails.matchpartecipant[0].toLowerCase().includes('barcelona')
                    ? 'img/baclona_logo.svg'
                    : matchDetails.matchpartecipant[0].toLowerCase().includes('real madrid')
                    ? 'img/real_medrid.svg'
                    : `img/participants/${matchDetails.matchpartecipant[0]}_${matchDetails.matchcategory}.png`
                }
                alt=''
                onError={(e: any) => {
                  e.target.src = `img/participants/${matchDetails.matchpartecipant[0]}_${matchDetails.matchcategory}.png`;
                }}
              />
            </Box>
            <Box className='korianzombi_img_prnt'>
              <Box
                component='img'
                src={
                  matchDetails.matchpartecipant[1].toLowerCase().includes('barcelona')
                    ? 'img/baclona_logo.svg'
                    : matchDetails.matchpartecipant[1].toLowerCase().includes('real madrid')
                    ? 'img/real_medrid.svg'
                    : `img/participants/${matchDetails.matchpartecipant[1]}_${matchDetails.matchcategory}.png`
                }
                alt=''
                onError={(e: any) => {
                  e.target.src = `img/participants/${matchDetails.matchpartecipant[1]}_${matchDetails.matchcategory}.png`;
                }}
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
              {formatDate(matchDetails.date)}
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
                  <span className='activeperiod'>Betting Period: Active</span>
                ) : (
                  <span>Betting Period: {(matchDetails.bettingPeriod / 86400).toFixed(0)} Days</span>
                )}
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
                    <span className='activeperiod'>Locked Period: Active</span>
                ) : (
                  <span>Locked Period: {(matchDetails.lockingPeriod / 86400).toFixed(0)} Days</span>
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
                  <span className='activeperiod'>Claiming Period: Active</span>
                ) : (
                  <span>Claiming Period: {(matchDetails.claimingPeriod / 86400).toFixed(0)} Days</span>
                )}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
