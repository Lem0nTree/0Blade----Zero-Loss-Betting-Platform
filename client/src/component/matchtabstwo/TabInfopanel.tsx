import React from 'react'
import { Box, Grid, Typography } from '@mui/material'

export default function TabInfopanel() {
  return (
    <>
        <Box className='tabinfo_prnt'>
            <Typography component="h3">Information</Typography>
                <Box className='tabinfo_inn'>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <Box className='input_text_border'>
                                <input type="text" placeholder="Farm Platform" />
                                <Typography>MMO</Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Box className='input_text_border'>
                                <input type="text" placeholder="Expected POT" />
                                <Typography>523156 CRO</Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Box className='input_text_border'>
                                <input type="text" placeholder="Farm Token" />
                                <Typography>CRO</Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Box className='input_text_border'>
                                <input type="text" placeholder="Actual POT" />
                                <Typography>253156 CRO</Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Box className='input_text_border'>
                                <input type="text" placeholder="Farm API" />
                                <Typography>213%</Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Box className='input_text_border'>
                                <input type="text" placeholder="Players Number" />
                                <Typography>1325</Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
                <Box className='tabinfo_bottm'>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={12}>
                            <Box className='input_text_border'>
                                <input type="text" placeholder="Contract Address" />
                                <Typography><a  href="https://cronoscan.com/token/0xD465b6B4937D768075414D413e981Af0b49349Cc" target="_blank">0xcD....Df34cC</a></Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
        </Box>
    </>
  )
}
