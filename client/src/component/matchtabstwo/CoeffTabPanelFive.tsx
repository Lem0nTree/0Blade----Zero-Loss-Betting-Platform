import React from 'react'
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Box, Grid } from '@mui/material'

export default function CoeffTabPanelFive() {
    const [expanded4, setExpanded4] = React.useState<string | false>('panel4');

    
    const handleChange4 =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded4(newExpanded ? panel : false);
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
                <Typography>To win the match<Box component="img" src="img/quat_ic.svg" /></Typography>
                </AccordionSummary>
                <AccordionDetails className='accordian_inn'>
                    <Grid container spacing={2}>
                        <Grid item xs={12}  sm={6} md={4}>
                            <Typography component="h5">1</Typography>
                        </Grid>
                        {/* <Grid item xs={12} sm={4}>
                        <Typography component="h5">Draw</Typography>
                        </Grid> */}
                        <Grid item xs={12} sm={6} md={4}>
                        <Typography component="h5">X</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                        <Typography component="h5">2</Typography>
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
                <Typography>Over / Under<Box component="img" src="img/quat_ic.svg" /></Typography>
                </AccordionSummary>
                <AccordionDetails className='accordian_inn'>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={6}>
                            <Typography component="h5">Over 1.5</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} md={6}>
                        <Typography component="h5">Under 1.5</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} md={6}>
                        <Typography component="h5">Over 2.5</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} md={6}>
                        <Typography component="h5">Under 2.5</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} md={6}>
                        <Typography component="h5">Over 3.5</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} md={6}>
                        <Typography component="h5">Under 3.5</Typography>
                        </Grid>
                    </Grid>
                </AccordionDetails>
            </Accordion>
            <Accordion className='acordin_main'>
                <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel3a-content"
                id="panel2a-header"
                >
                <Typography>Handicap Match <Box component="img" src="img/quat_ic.svg" /></Typography>
                </AccordionSummary>
                <AccordionDetails className='accordian_inn'>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={4}>
                            <Typography component="h5">Athletic Bilbao (-2)</Typography>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                        <Typography component="h5">Draw (-2)</Typography>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                        <Typography component="h5">Espanyol (-2)</Typography>
                        </Grid>
                    </Grid>
                </AccordionDetails>
            </Accordion>
            <Accordion className='acordin_main acordin_main_02' expanded={expanded4 === 'panel4'} onChange={handleChange4('panel4')}>
                <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel4a-content"
                id="panel2a-header"
                >
                <Typography>Goal / No Goal <Box component="img" src="img/quat_ic.svg" /></Typography>
                </AccordionSummary>
                <AccordionDetails className='accordian_inn accordian_inn_02'>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <Typography component="h5">Goal</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                        <Typography component="h5">No Goal</Typography>
                        </Grid>
                    </Grid>
                </AccordionDetails>
            </Accordion>
            <Accordion className='acordin_main acordin_main_02'>
                <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel4a-content"
                id="panel2a-header"
                >
                <Typography>Accurate Score <Box component="img" src="img/quat_ic.svg" /></Typography>
                </AccordionSummary>
                <AccordionDetails className='accordian_inn accordian_inn_02'>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={4}>
                            <Typography component="h5">0-0</Typography>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                        <Typography component="h5">1-0</Typography>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Typography component="h5">0-1</Typography>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Typography component="h5">1-1</Typography>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Typography component="h5">2-1</Typography>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Typography component="h5">1-2</Typography>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Typography component="h5">2-2</Typography>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Typography component="h5">3-1</Typography>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Typography component="h5">1-3</Typography>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Typography component="h5">3-3</Typography>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Typography component="h5">2-3</Typography>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Typography component="h5">3-2</Typography>
                        </Grid>
                    </Grid>
                </AccordionDetails>
            </Accordion>
        </Box>
    </>
  )
}
