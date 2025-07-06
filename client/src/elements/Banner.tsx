import { Box, Typography } from '@mui/material'
import React from 'react'

export default function Banner() {
  return (
    <>
        <Box className="sdbr_bnnr">
            <Typography>MATCH DAY</Typography>
            <Box className="inbx_img">
                <Box className='img_crcl'>
                    <Box component='img' src="/img/cntr_img01.png" />
                </Box>
                <Box className='img_crcl'>
                    <Box component='img' src="/img/cntr_img02.png" />
                </Box>
            </Box>
        </Box>
        <Box className="sdbr_bnnr_btm">
            <Typography component="h5">World Championships Qualification</Typography>
            <Box className="inbx_img">
                <Box className="bnr_flxbx">
                    <Box className='img_crcl'>
                        <Box component='img' src="/img/cntr_img01.png" />
                    </Box>
                    <Typography component="h6">Athletic</Typography>
                </Box>
                <Box className="bnr_flxbx">
                    <Box className='img_crcl'>
                        <Box component='img' src="/img/cntr_img02.png" />
                    </Box>
                    <Typography component="h6">Real Madrid</Typography>
                </Box>
            </Box>
            <Box className="timezon_bx">
                <Box className="timezon_bx_inn">
                    <Box component='img' src="/img/clndr_ic.svg" />
                    <Typography component="h4">24 February</Typography>
                </Box>
                <Box className="timezon_bx_inn">
                    <Box component='img' src="/img/clock_ic.svg" />
                    <Typography component="h4">10:30</Typography>
                </Box>
            </Box>
        </Box>
    </>
  )
}
