import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ImageList from '@material-ui/core/ImageList';
import ImageListItem from '@material-ui/core/ImageListItem';
import { Avatar, Card, Chip, Fab, Typography } from '@material-ui/core';
import SettingsSearchbar from '../SettingsSearchbar';
import HomeToolbar from '../HomeToolbar';
import HomeIcon from '@material-ui/icons/Home';
import NotificationsIcon from '@material-ui/icons/Notifications';
import ColorLensIcon from '@material-ui/icons/ColorLens';
import WifiTetheringIcon from '@material-ui/icons/WifiTethering';
import SecurityIcon from '@material-ui/icons/Security';
import WebIcon from '@material-ui/icons/Web';
import LanguageIcon from '@material-ui/icons/Language';
import DataUsageIcon from '@material-ui/icons/DataUsage';
import VpnKeyIcon from '@material-ui/icons/VpnKey';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    height: '100vh'
  },
  imageList: {
    paddingTop: 48,
    width: '100%',
    height: 'auto',
    paddingBottom: 56,
    paddingLeft: 16,
    paddingRight: 16,
    // Promote the list into its own layer in Chrome. This cost memory, but helps keep FPS high.
    transform: 'translateZ(0)',
  },
  titleBar: {
    background:
      'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, ' +
      'rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
  },
  icon: {
    color: 'white',
  },
}));

const itemData = [
  {
    icon: NotificationsIcon,
    title: 'اعلانات'
  },
  {
    icon: ColorLensIcon,
    title: 'تم'
  },
  {
    icon: WifiTetheringIcon,
    title: 'شبکه'
  },
  {
    icon: SecurityIcon,
    title: 'امنیت'
  },
  {
    icon: WebIcon,
    title: 'ظاهر'
  },
  {
    icon: DataUsageIcon,
    title: 'دیتا'
  },
  {
    icon: LanguageIcon,
    title: 'زبان'
  },
]

export default function SettingsList(props) {
  const classes = useStyles();
  const [state, setState] = React.useState({
    gilad: true,
    jason: false,
    antoine: true,
  });

  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };

  return (
    <div className={classes.root}>
      <HomeToolbar>
        <div style={{width: '75%', position: 'fixed', right: '12.5%', top: 32, zIndex: 3}}>
          <SettingsSearchbar setDrawerOpen={props.setDrawerOpen}/>
        </div>
      </HomeToolbar>
      <ImageList style={{zIndex: 2}} rowHeight={224} cols={2} gap={1} className={classes.imageList}>
        <ImageListItem key={'settings-my-profile-tag'} cols={2} rows={1} style={{marginTop: 32}}>
          <Card style={{width: 'calc(100% - 64px)', height: 96, borderRadius: 48, marginLeft: 32, marginRight: 32, display: 'flex', backgroundColor: 'rgba(255, 255, 255, 0.5)', backdropFilter: 'blur(10px)'}}>
            <div style={{padding: 8, width: 96, height: 96}}>
              <Avatar src={'https://www.nj.com/resizer/h8MrN0-Nw5dB5FOmMVGMmfVKFJo=/450x0/smart/cloudfront-us-east-1.images.arcpublishing.com/advancelocal/SJGKVE5UNVESVCW7BBOHKQCZVE.jpg'} style={{width: '100%', height: '100%'}}></Avatar>
            </div>
            <Typography style={{marginTop: 32, fontSize: 20}}>کیهان محمدی</Typography>
          </Card>
        </ImageListItem>
        {itemData.map((item, index) => {
          let IconComp = item.icon
          return (
            <ImageListItem key={item.img} cols={1} rows={1} style={{marginTop: (index === 0 || index === 1) ? -72 : 0, padding: 8}}>
              <div style={{position: 'relative', width: '100%', height: '100%', backgroundColor: 'rgba(255, 255, 255, 0.5)', backdropFilter: 'blur(10px)', borderRadius: 16}}>
                  <IconComp style={{position: 'absolute', top: 32, left: '50%', transform: 'translateX(-50%)', fill: '#2196f3', width: 112, height: 112}}/>
                  <Typography style={{position: 'absolute', top: 156, left: '50%', transform: 'translateX(-50%)', fontWeight: 'bold', }}>{item.title}</Typography>
              </div>
            </ImageListItem>
          )
        })}
      </ImageList>
      <Fab color="secondary" style={{position: 'fixed', bottom: 72 + 16, left: 16}}>
        <VpnKeyIcon />
      </Fab>
    </div>
  );
}
