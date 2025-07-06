import React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TableData from './TableData';

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

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function TabDatas({ matches }: any) {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  return (
    <>
      <Box sx={{ width: '100%' }}>
        <Box className='tabs_heder_prnt'>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label='basic tabs example'
            className='tabs_prnt'
          >
            <Tab label='All Games' {...a11yProps(0)} />
            <Tab label='Betting Period' {...a11yProps(1)} />
            <Tab label='Locked Period' {...a11yProps(2)} />
            {/* <Tab label='Pending Claim' {...a11yProps(3)} /> */}
            <Tab label='Finished' {...a11yProps(3)} />
          </Tabs>
          <Box className='filter_box'>
            <Box component='img' src='img/filter_ic.svg' alt='' />
            <Typography>Filter</Typography>
            <input type='text' placeholder='0'></input>
          </Box>
        </Box>
        <Box className='tab_panel_prnt'>
          <TabPanel value={value} index={0}>
            <TableData matches={matches} index={0} />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <TableData matches={matches} index={1} />
          </TabPanel>
          <TabPanel value={value} index={2}>
            <TableData matches={matches} index={2} />
          </TabPanel>
          <TabPanel value={value} index={3}>
            <TableData matches={matches} index={3} />
          </TabPanel>
          {/* <TabPanel value={value} index={4}>
            <TableData matches={matches} index={4} />
          </TabPanel> */}
        </Box>
      </Box>
    </>
  );
}
