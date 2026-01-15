import React, { useState, useEffect } from 'react';
import { Box, Grid, Typography, TextField } from '@mui/material';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import TabData from '../component/tabs/TabDatas';
import HighLightMatch from './HighLightMatch';
import matchesData from '../data/matches.json';

export default function Dashboard() {
  const [value, setValue] = React.useState<Date | null>(new Date());
  const [matches] = useState(matchesData);
  const [bannerMatch, setBannerMatch] = useState<any>(null);
  const [totalBetted, setTotalBetted] = useState(0);

  useEffect(() => {
    // Find banner match
    const banner = matches.find((match) => match.bannermatch);
    if (banner) {
      setBannerMatch(banner);
    }

    // Calculate total betted
    const total = matches.reduce((sum, match) => {
      return sum + (match.totalBettedAmount || 0) + (match.treasuryFund || 0);
    }, 0);
    setTotalBetted(total);
  }, [matches]);

  const handleChange = (newValue: Date | null) => {
    setValue(newValue);
  };
  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <Box className="pdding0_15_respncv">
            <Box className="begginer_sec_main">
              <Box component="img" src="img/banner_img.png" className="girl_img" />
              <Typography component="h2">
                The Zero Loss Betting <br />
                Era Has Begun{' '}
              </Typography>
              <Typography component="h3">
                Total Value Betted: ${(totalBetted * 0.001).toFixed(0)}
              </Typography>
              <Box className="coun_dwn_flex_box">
                {bannerMatch && (
                  <Box className="count_dwn_box count_dwn_box_02">
                    <a href={`/match/${bannerMatch.matchID}`} className="match_colum_bx w-100">
                      <Box component="img" src={`img/${bannerMatch.matchcategory}_logo.png`} />
                      <Typography>{bannerMatch.matchname}</Typography>
                      <Typography component="h6">00:00:00</Typography>
                    </a>
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <HighLightMatch />
        </Grid>
        <Grid item xs={12} md={12}>
          <Box className="featuredmatches_sec">
            <Box className="feature_header">
              <Typography component="h3">
                Popular Matches
              </Typography>
              <Box className="date_box">
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DesktopDatePicker
                    inputFormat="MM/dd/yyyy"
                    value={value}
                    onChange={handleChange}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </LocalizationProvider>
              </Box>
            </Box>
            <Box className="tab_flter_prnt">
              <Box className="tab_prnt">
                <TabData matches={matches} />
              </Box>
            </Box>
          </Box>
        </Grid>
        {/* <Grid item xs={12} md={4}>
          <ActiveBets />
        </Grid> */}
      </Grid>
    </>
  );
}
