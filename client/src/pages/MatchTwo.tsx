import React, {useEffect} from 'react'
import { Link } from 'react-router-dom'
import { Box, Typography, Grid, Checkbox, Button  } from '@mui/material'
import MatchTabOne from '../component/matchtabstwo/MatchTabOne'
import CoeffTab from '../component/matchtabstwo/CoeffTab'
import Slider from '@mui/material/Slider';

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };
export default function MatchTwo() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <>
      <Box className='match_page_main'>
        <Box className="home_match_prnt">
          <Link to="/">
            <Box component="img" src="img/home_logo.svg" alt="" />
            <span>Home / </span>
          </Link>
          <Typography>&nbsp;&nbsp;Matches</Typography>
        </Box>
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <Box className="spain_primira_box">
              <Box className='spain_primira_head'>
                <Typography>UFC 272</Typography>
                <Typography component="h4">Barcelona vs Real Madrid</Typography>
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={3} sm={4}>
                  <Box className="match_logo_bx">
                    <Box component="img" src="img/baclona_logo.svg" alt="" />
                  </Box>
                </Grid>
                <Grid item xs={6} sm={4}>
                  <Box className="match_logo_bx">
                    <Typography>Total Value Betted:</Typography>
                    <Box className='cro_flex'>
                      {/* <Box component="img" src="img/corrency_02.svg" alt="" className='corrency_02'/> */}
                      <Typography component="h5"><span>43</span>50485 <b>CRO</b></Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={3} sm={4}>
                  <Box className="match_logo_bx">
                    <Box component="img" src="img/real_medrid.svg" alt="" />
                  </Box>
                </Grid>
              </Grid>
              <MatchTabOne />
            </Box>
            <Box className='coefficients_box'>
              <Typography component="h3">Bet Options</Typography>
              <Box className='coef_tab_prnt'>
                <CoeffTab />
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box className='pdding0_15_respncv'>
              <Box className='game_bet_bx'>
                <Typography component="h2">Game Bets</Typography>
                <Typography className='game_bat_sub_p'>All bets relative to this match</Typography>
                <Box className='activ_bets_boxes'>
                  <Box className="actv_box01">
                    <Box className='logo_text_prnt'>
                      <Box className='logo_left_prnt'>
                      <Box className='volkski_img_prnt no_radius'><Box component="img" src="img/baclona_logo.svg" className='no_radius' alt="" /></Box>
                        <Box className='korianzombi_img_prnt'><Box component="img" src="img/real_medrid.svg" alt="" /></Box>
                        <Typography>
                        Barcelona 
                        <br/>Real Madrid
                        </Typography>
                      </Box>
                      <Box className='logo_right_prnt'>
                        <Typography>x12.43</Typography>
                        <Box component="img" src="img/corrency_02.svg" alt="" className='real_madrid_01' />
                      </Box>
                    </Box>
                    <Box className='topwin_row'>
                      <Typography><span>To win -</span> Espanyol (2X)</Typography>
                      <Typography component="h6">+2</Typography>
                      <Typography component="h4">6h:23m</Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
            <Box className='single_bet_box'>
              <Box className='head_txt_clean_img'>
                <Typography component="h3">Single Bet</Typography>
                <Box component="img" src="img/cleaner_ic.svg" alt="" />
              </Box>
              <Box className='single_bet_inn01'>
                <Box className='check_text_flex_box'>
                  <Checkbox {...label} defaultChecked />
                  <Typography>Barcelona - Real Madrid</Typography>
                  <Button><Box component="img" src="img/close_ic.svg" /></Button>
                </Box>
                <Box className="outcom_flex_bx">
                  <Box className="outcom_left">
                    <Typography component="h5">Barcelona</Typography>
                    <Typography component="h5"><span>Double outcome</span></Typography>
                  </Box>
                  <Typography component="h6">2.95</Typography>
                </Box>
              </Box>
            </Box>
            <Box className="single_bet_bttm_box">
              <Box className='slidr_flex_box'>
                <Slider defaultValue={50} aria-label="Default" valueLabelDisplay="auto"/>
                <Box className='num_flex'>
                  <Typography component="h5">7.345 CRO</Typography>
                  <Typography component="h5">32.558 CRO</Typography>
                </Box>
              </Box>
              <Box className="bet_bttm_cnter_bx">
                <Box className='bttm_cnter_row'>
                  <Typography>Possible winning:</Typography>
                  <Typography>48.357 CRO</Typography>
                </Box>
                <Box className='bttm_cnter_row'>
                  <Typography>Cryptocurrency:</Typography>
                  <Box component="img" src="img/corrency_02.svg" alt="" />
                </Box>
                <Button>Place a Bet</Button>
              </Box>
              <Box className='bet_bttm_last_bx'>
                <Box className='allert_bx'>
                  <Box component="img" src="img/allert_ic.svg" alt="" />
                  <Typography>
                    In case your bet is lost, the amount you set will be returned to your balance.
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
  )
}
