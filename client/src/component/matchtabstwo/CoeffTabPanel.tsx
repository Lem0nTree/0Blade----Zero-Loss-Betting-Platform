import React from 'react'
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Box, Grid } from '@mui/material'

export default function CoeffTabPanel() {
    const [expanded, setExpanded] = React.useState<string | false>('panel1');
    const [expanded1, setExpanded1] = React.useState<string | false>('panel2');
    const [expanded3, setExpanded3] = React.useState<string | false>('panel3');
    const [expanded4, setExpanded4] = React.useState<string | false>('panel4');
    const [expanded5, setExpanded5] = React.useState<string | false>('panel5');

    const handleChange =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
    };
    const handleChange1 =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded1(newExpanded ? panel : false);
    };
    const handleChange3 =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded3(newExpanded ? panel : false);
    };
    const handleChange4 =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded4(newExpanded ? panel : false);
    };
    const handleChange5 =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded5(newExpanded ? panel : false);
    };
  return (
    <>
        <Box className='tab_accorcdian_prnt'>
            <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')} className='acordin_main'>
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
            <Accordion className='acordin_main' expanded={expanded1 === 'panel2'} onChange={handleChange1('panel2')}>
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
            <Accordion className='acordin_main' expanded={expanded3 === 'panel3'} onChange={handleChange3('panel3')}>
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
            <Accordion className='acordin_main acordin_main_02' expanded={expanded5 === 'panel5'} onChange={handleChange5('panel5')}>
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
