import React, { useCallback, useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { IReduxState } from '../store/slices/state.interface';
import { IMatchSlice } from '../store/slices/matches-slice';
import { getSportName } from '../helpers';
import { format } from 'date-fns';

const HighLightMatch = () => {
  const [matchDetails, setHightLightMatch] = useState<any>();

  const match = useSelector<IReduxState, IMatchSlice>((state) => state.match);
  const loadApp = useCallback(() => {
    match.matches.map(async (match: any, index: number) => {
      if (match.highlightmatch && !matchDetails) {
        setHightLightMatch(match);
      }
    });
  }, []);

  useEffect(() => {
    loadApp();
  }, []);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <Box className='pdding0_15_respncv'>
      {matchDetails && (
        <Box className='uafa_leage_box'>
          <Box className='uafa_h_p_linl'>
            <Box className='uafa_h_p'>
              <Typography component='h4'>{matchDetails.matchname}</Typography>
              <Typography>
                {getSportName(matchDetails.matchcategory)}
              </Typography>
            </Box>
            <a
              href={matchDetails.liveLink}
              className='youtube_link'
              target='_blank'
            >
              <Box component='img' src='img/youtube_ic.svg' alt='' />
              {/* <span>{matchDetails.matchname}</span> */}
            </a>
          </Box>
          <Box className='teams_score'>
            <Box className='team_logo_name'>
              <Box
                component='img'
                height={50}
                src={
                  '../img/participants/' +
                  matchDetails.matchpartecipant[0] +
                  '_' +
                  matchDetails.matchcategory +
                  '.png'
                }
                alt=''
                className='baclona_logo'
              />
              <Typography component='h6'>
                {' '}
                {matchDetails.matchpartecipant[0]}
              </Typography>
            </Box>
            <Box className='team_score_txt'>
              <Typography component='h3'>
                {format(new Date(matchDetails.date * 1000), 'EEEE')}
              </Typography>
              <Typography>
                {format(new Date(matchDetails.date * 1000), 'HH:mm')}
              </Typography>
              {/* <Typography>April 10th</Typography> */}
            </Box>
            <Box className='team_logo_name'>
              <Box
                component='img'
                height={50}
                src={
                  '../img/participants/' +
                  matchDetails.matchpartecipant[1] +
                  '_' +
                  matchDetails.matchcategory +
                  '.png'
                }
                alt=''
                className='chelsea_logo'
              />
              <Typography component='h6'>
                {' '}
                {matchDetails.matchpartecipant[1]}
              </Typography>
            </Box>
          </Box>
          <Link
            to={'/match/' + matchDetails.matchID}
            className='match_detail_link'
          >
            Match Details
          </Link>
        </Box>
      )}
    </Box>
  );
};

export default HighLightMatch;
