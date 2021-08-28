import { Fab } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import Divider from '@material-ui/core/Divider';
import { makeStyles } from '@material-ui/core/styles';
import NavigationIcon from '@material-ui/icons/Navigation';
import Rating from '@material-ui/lab/Rating';
import React from 'react';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: '100٪',
    direction: 'rtl'
  },
  inline: {
    display: 'inline',
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
}));

export default function StoreComments() {
  const classes = useStyles();

  return (
    <div style={{marginTop: 32}}>
      {
        [0, 1, 2].map(item => (
          <div style={{margin: 16, display: 'flex', position: 'relative'}}>
          <span>
            <Avatar alt="Remy Sharp" src="https://www.nj.com/resizer/h8MrN0-Nw5dB5FOmMVGMmfVKFJo=/450x0/smart/cloudfront-us-east-1.images.arcpublishing.com/advancelocal/SJGKVE5UNVESVCW7BBOHKQCZVE.jpg" />
          </span>
          <span style={{marginRight: 16, color: '#fff'}}>
            خیلی خوب بود
            <br/>
            <br/>
             <b>کیهان محمدی</b>- خیلی عالیه ولی میتونه بهتر هم بشه .
          </span>
          <Rating value={4} style={{position: 'absolute', left: 0, top: 0}}/>
      <Divider variant="inset" component="li" />
        </div>
        ))
      }
      <Fab
          variant="extended"
          size="small"
          color="primary"
          style={{position: 'absolute', marginTop: 16, left: '50%', transform: 'translateX(-50%)'}}
        >
          <NavigationIcon className={classes.extendedIcon} />
          نمایش همه ی کامنت ها
        </Fab>
    </div>
  );
}