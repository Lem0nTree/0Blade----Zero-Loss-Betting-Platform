import React from 'react';
import { Box, Grid, Typography } from '@mui/material';

// Helper function to truncate address
const accountEllipsis = (address: string) => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export default function TabInfopanel({ matchDetails }: any) {
  // Sample match details if not provided
  const defaultMatchDetails = {
    farmplatform: 'Sample Farm',
    farmtoken: 'FRAX',
    farmapy: 10,
    totalBettedAmount: 10000,
    treasuryFund: 5000,
    totalBets: 150,
    actualPot: 15000,
    bettingcontract: '0x1234567890123456789012345678901234567890',
    lockingPeriod: 86400 * 2,
  };

  const match = matchDetails || defaultMatchDetails;
  
  const expectedPot = (
    ((match.totalBettedAmount + match.treasuryFund) *
      (match.farmapy / 365) *
      (match.lockingPeriod / 86400) / 100)
  ).toFixed(2);
  return (
    <>
      <Box className='tabinfo_prnt'>
        <Typography component='h3'>Information</Typography>
        <Box className='tabinfo_inn'>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Box className='input_text_border'>
                <input type='text' placeholder='Farm Platform' />
                <Typography>{match.farmplatform}</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box className='input_text_border'>
                <input type='text' placeholder='Expected POT' />
                <Typography>
                  {expectedPot} {match.farmtoken}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box className='input_text_border'>
                <input type='text' placeholder='Farm Token' />
                <Typography>{match.farmtoken}</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box className='input_text_border'>
                <input type='text' placeholder='Actual POT' />
                <Typography>{match.actualPot} {match.farmtoken}</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box className='input_text_border'>
                <input type='text' placeholder='Farm API' />
                <Typography>{match.farmapy}%</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box className='input_text_border'>
                <input type='text' placeholder='Players Number' />
                <Typography>{match.totalBets}</Typography>
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
                      match.bettingcontract
                    }
                    target='_blank'
                    rel="noopener noreferrer"
                  >
                    {accountEllipsis(match.bettingcontract)}
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
