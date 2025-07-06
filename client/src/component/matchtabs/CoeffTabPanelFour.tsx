import React from 'react'
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Box, Grid } from '@mui/material'

export default function CoeffTabPanelFour() {
    const [expanded3, setExpanded3] = React.useState<string | false>('panel3');

    
    const handleChange3 =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded3(newExpanded ? panel : false);
    };
   
  return (
    <>
        <Box className='tab_accorcdian_prnt'>
            <Accordion className='acordin_main'>
                <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
                className='a'
                >
                <Typography>Final Winner<Box component="img" src="img/quat_ic.svg" /></Typography>
                </AccordionSummary>
                <AccordionDetails className='accordian_inn'>
                    <Grid container spacing={2}>
                        <Grid item xs={12}  sm={6} md={4}>
                            <Typography component="h5">Alexander Volkanovski</Typography>
                        </Grid>
                        {/* <Grid item xs={12} sm={4}>
                        <Typography component="h5">Draw</Typography>
                        </Grid> */}
                        <Grid item xs={12} sm={6} md={4}>
                        <Typography component="h5">Korean Zombie</Typography>
                        </Grid>
                    </Grid>
                </AccordionDetails>
            </Accordion>
            <Accordion className='acordin_main' >
                <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel2a-content"
                id="panel2a-header"
                >
                <Typography>Over/Under<Box component="img" src="img/quat_ic.svg" /></Typography>
                </AccordionSummary>
                <AccordionDetails className='accordian_inn'>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={4}>
                            <Typography component="h5">Over 4.5</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                        <Typography component="h5">Under 4.5</Typography>
                        </Grid>
                    </Grid>
                </AccordionDetails>
            </Accordion>
            <Accordion className='acordin_main' expanded={expanded3 === 'panel3'} onChange={handleChange3('panel2')}>
                <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel3a-content"
                id="panel2a-header"
                >
                <Typography>Ending Round <Box component="img" src="img/quat_ic.svg" /></Typography>
                </AccordionSummary>
                <AccordionDetails className='accordian_inn'>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={4}>
                            <Typography component="h5">1st Round</Typography>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                        <Typography component="h5">2nd Round</Typography>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                        <Typography component="h5">3rd Round</Typography>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                        <Typography component="h5">4th Round</Typography>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                        <Typography component="h5">5th Round</Typography>
                        </Grid>
                    </Grid>
                </AccordionDetails>
            </Accordion>
        </Box>
    </>
  )
}
