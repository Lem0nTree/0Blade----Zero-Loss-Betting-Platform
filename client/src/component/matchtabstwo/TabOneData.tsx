import React from 'react'
import { Box, Typography, Grid } from '@mui/material'
import Slider from '@mui/material/Slider';

export default function 
() {
  return (
    <>
        <Box className='tabone_main'>
            <Box className="star_time_data_bx">
                <Box className='team_logo_name'>
                <Box className='volkski_img_prnt no_radius'><Box component="img" src="img/baclona_logo.svg" className='no_radius' alt="" /></Box>
                <Box className='korianzombi_img_prnt'><Box component="img" src="img/real_medrid.svg" alt="" /></Box>
                    <Typography component="h6">Barcelona <br/>Real Madrid</Typography>
                </Box>
                <Box className='time_data_right'>
                    <Typography>Start of the match</Typography>
                    <Typography component="h5">March 20th, 2022</Typography>
                </Box>
            </Box>
            <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                    <Box width='full'  className='range_slider_prnt'>
                        <Slider defaultValue={50} aria-label="Default" valueLabelDisplay="auto"/>
                    </Box>
                    <Box className='bet_lock_clai_box'>
                        <Typography component="h4">Betting Period</Typography>
                    </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Box width='full'  className='range_slider_prnt range_slider_prnt_02'>
                        <Slider defaultValue={0} aria-label="Default" valueLabelDisplay="auto"/>
                    </Box>
                    <Box className='bet_lock_clai_box'>
                        <Typography component="h4"><span>Locked Period: </span>80h 00m</Typography>
                    </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Box width='full'  className='range_slider_prnt range_slider_prnt_02 range_slider_prnt_03'>
                        <Slider defaultValue={0} aria-label="Default" valueLabelDisplay="auto"/>
                    </Box>
                    <Box className='bet_lock_clai_box'>
                        <Typography component="h4"><span>Claiming Period</span></Typography>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    </>
  )
}
