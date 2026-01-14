import React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Box, Grid } from '@mui/material';

export default function CoeffTabPanel({
  options,
  matchDetails,
  sendData,
}: any) {
  // Initialize with first panel expanded
  const [expandedPanels, setExpandedPanels] = React.useState<{ [key: string]: boolean }>({
    panel0: true, // First accordion expanded by default
  });

  const handleChange = (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
    setExpandedPanels((prev) => ({
      ...prev,
      [panel]: newExpanded,
    }));
  };

  const onChangeValue = (value: any, name: any, tabTitle: any, label: any) => {
    sendData([value, name, tabTitle, label]);
  };
  return (
    <>
      <Box className='tab_accorcdian_prnt'>
        {/* <Accordion
          expanded={expanded === 'panel1'}
          onChange={handleChange('panel1')}
          className='acordin_main'
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls='panel1a-content'
            id='panel1a-header'
            className='a'
          >
            <Typography>
              Final Winner
              <Box component='img' src='../img/quat_ic.svg' />
            </Typography>
          </AccordionSummary>
          <AccordionDetails className='accordian_inn'>
            <Grid container spacing={2}>
              {matchDetails.matchoutcome.map((participant: any, index: any) => (
                <Grid item xs={12} sm={6} md={4}>
                  <Box className='cstm_radio'>
                    <input
                      type='radio'
                      name='tab_radio'
                      value={participant}
                      onChange={() =>
                        onChangeValue(
                          index + 1,
                          participant,
                          'Final Winner',
                          'Final Winner'
                        )
                      }
                    />
                    <Typography component='h5'>{participant}</Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </AccordionDetails>
        </Accordion> */}
        {options.betOptions &&
          options.betOptions.map((betOption: any, index2: any) => {
            const panelId = `panel${index2}`;
            return (
            <Accordion
              key={index2}
              className='acordin_main'
              expanded={expandedPanels[panelId] || false}
              onChange={handleChange(panelId)}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls='panel2a-content'
                id='panel2a-header'
              >
                <Typography>
                  {betOption.label}
                  <Box component='img' src='../img/quat_ic.svg' />
                </Typography>
              </AccordionSummary>
              <AccordionDetails className='accordian_inn'>
                <Grid container spacing={2}>
                  {betOption.options.map((option: any, index: any) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <Box className='cstm_radio'>
                        <input
                          type='radio'
                          name={`tab_radio_${index2}`}
                          value={option.value}
                          onChange={() =>
                            onChangeValue(
                              option.value,
                              option.name,
                              betOption.tabTitle,
                              betOption.label
                            )
                          }
                        />
                        <Typography component='h5'>{option.name}</Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </AccordionDetails>
            </Accordion>
            );
          })}
      </Box>
    </>
  );
}
