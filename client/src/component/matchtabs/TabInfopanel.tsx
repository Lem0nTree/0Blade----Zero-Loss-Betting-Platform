import React from 'react';
import { Box, Grid, Typography } from '@mui/material';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { IReduxState } from '../../store/slices/state.interface';
import {
  IMatchSlice,
  loadMatchDetails,
  placeBet,
  revokeBet,
} from '../../store/slices/matches-slice';
import { accountEllipsis } from '../../helpers';

export default function TabInfopanel() {
  const { eventId }: any = useParams();
  const matchDetails = useSelector<IReduxState, any>((state) => {
    return state.match.matches.filter(
      (match: any) => match.matchID == eventId
    )[0];
  });
  return (
    <>
      <Box className='tabinfo_prnt'>
        <Typography component='h3'>Information</Typography>
        <Box className='tabinfo_inn'>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Box className='input_text_border'>
                <input type='text' placeholder='Farm Platform' />
                <Typography>{matchDetails.farmplatform}</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box className='input_text_border'>
                <input type='text' placeholder='Expected POT' />
                <Typography>
                  {(
                    ((matchDetails.totalBettedAmount +
                      matchDetails.treasuryFund) *
                    (matchDetails.farmapy / 365) *
                    (matchDetails.lockingPeriod / 86400) / 100)
                  ).toFixed(2)}{' '}
                  {matchDetails.farmtoken}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box className='input_text_border'>
                <input type='text' placeholder='Farm Token' />
                <Typography>{matchDetails.farmtoken}</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box className='input_text_border'>
                <input type='text' placeholder='Actual POT' />
                <Typography>{matchDetails.actualPot} {matchDetails.farmtoken}</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box className='input_text_border'>
                <input type='text' placeholder='Farm API' />
                <Typography>{matchDetails.farmapy}%</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box className='input_text_border'>
                <input type='text' placeholder='Players Number' />
                <Typography>{matchDetails.totalBets}</Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
        <Box className='tabinfo_bottm'>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12}>
              <Box className='input_text_border'>
                <input type='text' placeholder='Contract Address' />
                <Typography>
                  <a
                    style={{ color: 'white' }}
                    href={
                      'https://cronoscan.com/token/' +
                      matchDetails.bettingcontract
                    }
                    target='_blank'
                  >
                    {accountEllipsis(matchDetails.bettingcontract)}
                  </a>
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
}
