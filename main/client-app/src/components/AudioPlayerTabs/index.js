import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { colors } from '../../util/settings';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

export default function AudioPlayerTabs(props) {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box
      sx={{ flexGrow: 1, display: 'flex', height: 176 }}
      style={{backgroundColor: colors.backSide, backdropFilter: 'blur(10px)'}}
    >
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={value}
        onChange={handleChange}
        aria-label="Vertical tabs example"
        sx={{ borderRight: 1, borderColor: 'divider' }}
        style={{transform: 'translateX(-16px)'}}
      >
        <Tab label="همه" {...a11yProps(0)} />
        <Tab label="روم ها" {...a11yProps(1)} />
        <Tab label="پلی لیست ها" {...a11yProps(2)} />
      </Tabs>
      <TabPanel value={value} index={0}>
        {props.all}
      </TabPanel>
      <TabPanel value={value} index={1}>
        {props.rooms}
      </TabPanel>
      <TabPanel value={value} index={2}>
        {props.all}
      </TabPanel>
    </Box>
  );
}
