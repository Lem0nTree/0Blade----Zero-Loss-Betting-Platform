import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { format } from 'date-fns';
import matchesData from '../data/matches.json';

const HighLightMatch = () => {
  const [matchDetails, setMatchDetails] = useState<any>(null);

  useEffect(() => {
    // Find highlight match
    const highlight = matchesData.find((match) => match.highlightmatch);
    if (highlight) {
      setMatchDetails(highlight);
    }
  }, []);
  if (!matchDetails) {
    return null;
  }


  const getSportName = (category: string) => {
    const sports: { [key: string]: string } = {
      '0': 'Soccer',
      '1': 'UFC',
      '2': 'Volley',
      '3': 'Tennis',
      '4': 'Chess',
      '5': 'Water Polo',
      '6': 'Esports',
      '7': 'Cycling',
      '8': 'Golf',
      '9': 'Poker',
    };
    return sports[category] || 'Sport';
  };

  return (
    <Box className='pdding0_15_respncv'>
      <Box className='uafa_leage_box'>
        <Box className='uafa_h_p_linl'>
          <Box className='uafa_h_p'>
            <Typography component='h4'>{matchDetails.matchname}</Typography>
            <Typography>
              {getSportName(matchDetails.matchcategory)}
            </Typography>
          </Box>
          <a
            href="#"
            className='youtube_link'
            target='_blank'
            rel="noopener noreferrer"
          >
            <Box component='img' src='img/youtube_ic.svg' alt='' />
          </a>
        </Box>
        <Box className='teams_score'>
          <Box className='team_logo_name'>
            <Box
              component='img'
              height={50}
              src={
                matchDetails.matchpartecipant[0].toLowerCase().includes('barcelona')
                  ? 'img/baclona_logo.svg'
                  : matchDetails.matchpartecipant[0].toLowerCase().includes('real madrid')
                  ? 'img/real_medrid.svg'
                  : `img/participants/${matchDetails.matchpartecipant[0]}_${matchDetails.matchcategory}.png`
              }
              alt=''
              className='baclona_logo'
              onError={(e: any) => {
                e.target.src = `img/participants/${matchDetails.matchpartecipant[0]}_${matchDetails.matchcategory}.png`;
              }}
            />
            <Typography component='h6'>
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
          </Box>
          <Box className='team_logo_name'>
            <Box
              component='img'
              height={50}
              src={
                matchDetails.matchpartecipant[1].toLowerCase().includes('barcelona')
                  ? 'img/baclona_logo.svg'
                  : matchDetails.matchpartecipant[1].toLowerCase().includes('real madrid')
                  ? 'img/real_medrid.svg'
                  : `img/participants/${matchDetails.matchpartecipant[1]}_${matchDetails.matchcategory}.png`
              }
              alt=''
              className='chelsea_logo'
              onError={(e: any) => {
                e.target.src = `img/participants/${matchDetails.matchpartecipant[1]}_${matchDetails.matchcategory}.png`;
              }}
            />
            <Typography component='h6'>
              {matchDetails.matchpartecipant[1]}
            </Typography>
          </Box>
        </Box>
        <a
          href={`/match/${matchDetails.matchID}`}
          className='match_detail_link'
        >
          Match Details
        </a>
      </Box>
    </Box>
  );
};

export default HighLightMatch;
