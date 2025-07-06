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
  const [expanded, setExpanded] = React.useState<string | false>('panel1');
  const [expanded2, setExpanded2] = React.useState<string | false>('panel2');
  const [expanded3, setExpanded3] = React.useState<string | false>('panel3');

  const handleChange2 =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded2(newExpanded ? panel : false);
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
          options.betOptions.map((betOption: any, index2: any) => (
            <Accordion
              className='acordin_main'
              expanded={expanded2 === 'panel2'}
              onChange={handleChange2('panel2')}
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
                    <Grid item xs={12} sm={6} md={4}>
                      <Box className='cstm_radio'>
                        <input
                          type='radio'
                          name='tab_radio'
                          value={option.value}
                          onChange={() =>
                            onChangeValue(
                              // index +
                              //   1 +
                              //   (index2 > 0
                              //     ? options.betOptions[index2 - 1].options.length
                              //     : 0),
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
          ))}
      </Box>
    </>
  );
}
