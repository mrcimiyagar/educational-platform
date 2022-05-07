import * as React from 'react';
import { styled } from '@mui/material/styles';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { colors } from '../../util/settings';
import { Paper } from '@material-ui/core';

export default function AudioPlayerSubTabs() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const StyledTabs = styled((props) => (
    <Tabs
      {...props}
      TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan" /> }}
    />
  ))({
    '& .MuiTabs-indicator': {
      display: 'flex',
      justifyContent: 'center',
      backgroundColor: 'transparent',
    },
    '& .MuiTabs-indicatorSpan': {
      maxWidth: 40,
      width: '100%',
      backgroundColor: colors.text,
    },
  });

  const StyledTab = styled((props) => <Tab disableRipple {...props} />)(
    ({ theme }) => ({
      textTransform: 'none',
      fontWeight: theme.typography.fontWeightRegular,
      fontSize: theme.typography.pxToRem(15),
      marginRight: theme.spacing(1),
    }),
  );

  return (
    <Paper style={{borderRadius: '24px 24px 0px 0px', width: '100%', direction: 'rtl', transform: 'translateY(-24px)', backgroundColor: colors.nonTransparentPrimaryLight}}>
      <Box>
        <Box style={{width: '100%', height: 8}} />
        <StyledTabs
          value={value}
          onChange={handleChange}
          centered
        >
          <StyledTab label="همه" style={{fontSize: 18, color: colors.text}} />
          <StyledTab label="روم ها" style={{fontSize: 18, color: colors.text}} />
          <StyledTab label="پلی لیست ها" style={{fontSize: 18, color: colors.text}} />
        </StyledTabs>
        <Box style={{width: '100%', height: 32}} />
      </Box>
    </Paper>
  );
}