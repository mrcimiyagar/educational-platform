import { Container, Tab, Tabs } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import AlternateEmailIcon from '@material-ui/icons/AlternateEmail';
import NotificationsIcon from '@material-ui/icons/Notifications';
import PropTypes from 'prop-types';
import React from 'react';
import { colors } from '../../util/settings';
import HomeToolbar from '../HomeToolbar';
import NotifsList from '../NotifsList';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`nav-tabpanel-${index}`}
      aria-labelledby={`nav-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          {children}
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  indicator: {
    backgroundColor: '#333',
  },
}));

export default function HomeNotifs() {
  const classes = useStyles()
  const [value, setValue] = React.useState(0)

  const handleChange = (event, newValue) => {
    setValue(newValue)
  };

  return (
    <div className={classes.root}>
      <HomeToolbar>
      <AppBar style={{backgroundColor: colors.primaryLight}}>
          <Tabs
            variant="fullWidth"
            value={value}
            onChange={handleChange}
            classes={{
              indicator: classes.indicator
            }}
            style={{marginTop: 8, color: '#333'}}
          >
            <Tab icon={<NotificationsIcon style={{fill: '#333'}} />} label="اعلانات" />
            <Tab icon={<AlternateEmailIcon style={{fill: '#333'}} />} label="منشن ها" />
          </Tabs>
        </AppBar>
        </HomeToolbar>
        <div style={{width: '100%', height: '100%'}}>
        <TabPanel value={value} index={0}>
            <Container>
                <Box my={2} style={{minHeight: '100vh', paddingTop: 48}}>
                  <NotifsList/>
                </Box>
            </Container>
        </TabPanel>
        <TabPanel value={value} index={1}>
            <Container>
              <Box my={2} style={{minHeight: '100vh', paddingTop: 48}}>
                  <NotifsList/>
              </Box>
            </Container>
        </TabPanel>
        </div>
    </div>
  )
}
