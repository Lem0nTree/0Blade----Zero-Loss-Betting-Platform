import React from 'react'
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CoeffTabPanel from './CoeffTabPanel';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
  }
  
  function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
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
    
export default function CoeffTab() {
    const [value, setValue] = React.useState(0);
  
    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
      setValue(newValue);
    };
  
  return (
    <>
        <Box className='tabs_heder_coef_prnt'>
            <Tabs
                value={value}
                onChange={handleChange}
                variant="scrollable"
                scrollButtons
                allowScrollButtonsMobile
                aria-label="scrollable force tabs example"
                className='tabs_heder_prnt'
            >
                <Tab label="All" />
                <Tab label="Base" />
                <Tab label="Total" />
                <Tab label="Fora" />
                <Tab label="Time" />
                <Tab label="Accurate score" />
                <Tab label="Goals" />
                <Tab label="Intervals" />
                <Tab label="Players" />
                <Tab label="Penalties/Removals " />
            </Tabs>
        </Box>
        <Box className='tab_panel_prnt'>
            <TabPanel value={value} index={0}>
                <CoeffTabPanel />
            </TabPanel>
            <TabPanel value={value} index={1}>
              <CoeffTabPanel />
            </TabPanel>
            <TabPanel value={value} index={2}>
              <CoeffTabPanel />
            </TabPanel>
            <TabPanel value={value} index={3}>
              <CoeffTabPanel />
            </TabPanel>
            <TabPanel value={value} index={4}>
              <CoeffTabPanel />
            </TabPanel>
            <TabPanel value={value} index={5}>
              <CoeffTabPanel />
            </TabPanel>
            <TabPanel value={value} index={6}>
              <CoeffTabPanel />
            </TabPanel>
            <TabPanel value={value} index={7}>
              <CoeffTabPanel />
            </TabPanel>
            <TabPanel value={value} index={8}>
              <CoeffTabPanel />
            </TabPanel>
            <TabPanel value={value} index={9}>
              <CoeffTabPanel />
            </TabPanel>
        </Box>
    </>
  )
}
