import React, { useCallback, useEffect, useState } from 'react';
import { Box, Grid, Typography, TextField, Button, Skeleton } from '@mui/material';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { getTokenPrice } from '../helpers/token-price';
import TabData from '../component/tabs/TabDatas';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { IReduxState } from '../store/slices/state.interface';
import { IMatchSlice, loadMatchDetails, revokeBet } from '../store/slices/matches-slice';

import { useWeb3Context } from '../hooks';
import ActiveBets from './ActiveBets';
import HighLightMatch from './HighLightMatch';
import Countdown from 'react-countdown';

export default function Dashboard() {
  const { connect, provider, hasCachedProvider, chainID, connected, address } = useWeb3Context();
  const { sport }: any = useParams();
  const [totalBetted, setTotalBetted] = useState(0);

  const [value, setValue] = React.useState<Date | null>(new Date('2014-08-18T21:11:54'));
  const [bannerMatch, setBannerMatch] = useState([]);
  const matchsArray = useSelector<IReduxState, IMatchSlice>((state) => state.match);

  const matchs = sport ? matchsArray.matches.filter((match, index) => match.matchcategory == sport) : matchsArray.matches;

  const currentTime = Date.now() / 1000;

  // Add debugging for web3 connection
  console.log('=== WEB3 CONNECTION DEBUG ===');
  console.log('connected:', connected);
  console.log('chainID:', chainID);
  console.log('address:', address);
  console.log('provider:', provider);
  console.log('hasCachedProvider:', hasCachedProvider());

  const dispatch = useDispatch();
  const loadApp = useCallback(() => {
    console.log('=== LOADAPP DEBUG ===');
    console.log('matchs length:', matchs.length);
    console.log('matchs:', matchs);
    console.log('=== WEB3 STATUS ===');
    console.log('connected:', connected);
    console.log('chainID:', chainID);
    console.log('provider exists:', !!provider);
    console.log('provider type:', provider?.constructor?.name);

    let bannetMatchArray = [];
    let totalValueBetted = 0;
    matchs.map(async (match: any, index: number) => {
      console.log(`Processing match ${index}:`, match.matchname);
      console.log('match.totalBettedAmount:', match.totalBettedAmount);
      console.log('match.treasuryFund:', match.treasuryFund);

      totalValueBetted += (match.totalBettedAmount || 0) + (match.treasuryFund || 0);
      if (match.bannermatch) {
        bannetMatchArray.push(match);
      }
      if (index + 1 === matchs.length) {
        setBannerMatch([...bannetMatchArray]);
      }

      // Only dispatch if connected and provider exists
      if (connected && provider) {
        console.log(`Dispatching loadMatchDetails for match ${index}`);
        dispatch(
          loadMatchDetails({
            networkID: chainID,
            provider: provider,
            match: match,
            index,
          })
        );
      } else {
        console.log('Skipping loadMatchDetails - not connected or no provider');
      }
    });
    setTotalBetted(totalValueBetted);
  }, [connected, provider, chainID]);

  useEffect(() => {
    loadApp();
  }, []);

  const handleChange = (newValue: Date | null) => {
    setValue(newValue);
  };

  const renderer = ({ days, hours, minutes, seconds, completed }: any) => {
    // Render a countdown
    return (
      <span>
        {hours + days * 24}:{minutes}:{seconds}
      </span>
    );
  };

  const mmfPrice = getTokenPrice('MMF');
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
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
                Total Value Betted: {mmfPrice ? (totalBetted * mmfPrice).toFixed(0) : <Skeleton width={100} variant="text" />}$
                {console.log(mmfPrice)}
              </Typography>
              <Box className="coun_dwn_flex_box">
                {bannerMatch &&
                  bannerMatch.map((match) => {
                    // Add console logs to see the values
                    console.log('Match:', match.matchname);
                    console.log('match.startTime:', match.startTime);
                    console.log('match.bettingPeriod:', match.bettingPeriod);
                    console.log('match.lockingPeriod:', match.lockingPeriod);
                    console.log('match.claimingPeriod:', match.claimingPeriod);
                    console.log('currentTime:', currentTime);
                    console.log('startTime + bettingPeriod:', match.startTime + match.bettingPeriod);
                    console.log('startTime + bettingPeriod + lockingPeriod:', match.startTime + match.bettingPeriod + match.lockingPeriod);
                    console.log(
                      'startTime + bettingPeriod + lockingPeriod + claimingPeriod:',
                      match.startTime + match.bettingPeriod + match.lockingPeriod + match.claimingPeriod
                    );

                    return (
                      <Box className="count_dwn_box count_dwn_box_02">
                        <Link to={'/match/' + match.matchID} className="match_colum_bx w-100">
                          <Box component="img" src={'img/' + match.matchcategory + '_logo.png'} />
                          <Typography>{match.matchname}</Typography>
                          <Typography component="h6">
                            {' '}
                            {match.startTime && currentTime && currentTime < match.startTime ? (
                              <Typography component="h6">
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
                          </Typography>
                        </Link>
                      </Box>
                    );
                  })}
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
                {sport == undefined ? 'Popular Matches' : sport == '0' ? 'Soccer Matches' : sport == 1 ? 'UFC Matches' : ''}
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
                <TabData matches={matchs} />
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
