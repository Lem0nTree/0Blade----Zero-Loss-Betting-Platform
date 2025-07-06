import React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CoeffTabPanel from './CoeffTabPanel';
import CoeffTabPanelTwo from './CoeffTabPanelTwo';
import CoeffTabPanelThree from './CoeffTabPanelThree';
import CoeffTabPanelFour from './CoeffTabPanelFour';
import betOptions from '../../data/betOptions.json';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

export default function CoeffTab({ matchDetails, sendToMatch }: any) {
  const [value, setValue] = React.useState(0);
  const options = betOptions.filter(
    (betOption) => betOption.category == matchDetails.matchcategory
  )[0];

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const getData = (value: any) => {
    sendToMatch(value);
  };

  return (
    <>
      <Box className='tabs_heder_coef_prnt'>
        <Tabs
          value={value}
          onChange={handleChange}
          variant='scrollable'
          scrollButtons
          allowScrollButtonsMobile
          aria-label='scrollable force tabs example'
          className='tabs_heder_prnt'
        >
          <Tab label='All' />
          {options.betOptions.map((option) => (
            <Tab label={option.tabTitle} />
          ))}
        </Tabs>
      </Box>
      <Box className='tab_panel_prnt'>
        <TabPanel value={value} index={0}>
          <CoeffTabPanel
            options={options}
            matchDetails={matchDetails}
            sendData={getData}
          />
        </TabPanel>
        {options.betOptions.map((option, index) => (
          <TabPanel value={value} index={index + 1}>
            <CoeffTabPanel
              options={{ betOptions: [options.betOptions[index]] }}
              matchDetails={matchDetails}
              sendData={getData}
            />
          </TabPanel>
        ))}
        {/* <TabPanel value={value} index={1}>
          <CoeffTabPanel
            options={options}
            matchDetails={matchDetails}
            sendData={getData}
          />
        </TabPanel> */}
        {/* <TabPanel value={value} index={1}>
          <CoeffTabPanelTwo />
        </TabPanel>
        <TabPanel value={value} index={2}>
          <CoeffTabPanelThree />
        </TabPanel>
        <TabPanel value={value} index={3}>
          <CoeffTabPanelFour />
        </TabPanel> */}
      </Box>
    </>
  );
}
