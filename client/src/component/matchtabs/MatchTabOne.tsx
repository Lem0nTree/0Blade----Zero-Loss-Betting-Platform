import React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import TabOneData from './TabOneData';
import TabInfopanel from './TabInfopanel';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
      {value === index && (
        <Box>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function MatchTabOne({ matchDetails }: any) {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  return (
    <>
      <Box sx={{ width: '100%' }}>
        <Box className="tabs_heder_prnt tabs_heder_prnt_02">
          <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" className="tabs_prnt">
            <Tab label="Overview" {...a11yProps(0)} />
            <Tab label="Pool Information" {...a11yProps(1)} />
          </Tabs>
        </Box>
        <Box className="devider_one" />
        <Box className="tab_panel_prnt">
          <TabPanel value={value} index={0}>
            <TabOneData matchDetails={matchDetails} />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <TabInfopanel matchDetails={matchDetails} />
          </TabPanel>
        </Box>
      </Box>
    </>
  );
}
