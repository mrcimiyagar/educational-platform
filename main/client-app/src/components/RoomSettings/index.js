import {
  AppBar,
  Avatar,
  Button,
  FormControlLabel,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  Radio,
  RadioGroup,
  Tab,
  Tabs,
} from '@material-ui/core'
import Accordion from '@material-ui/core/Accordion'
import AccordionDetails from '@material-ui/core/AccordionDetails'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import Box from '@material-ui/core/Box'
import {
  createTheme,
  makeStyles,
  ThemeProvider,
} from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import GradientIcon from '@material-ui/icons/Gradient'
import InvertColorsIcon from '@material-ui/icons/InvertColors'
import Photo from '@material-ui/icons/Photo'
import PropTypes from 'prop-types'
import React, { useEffect } from 'react'
import { CirclePicker } from 'react-color'
import { isDesktop } from '../../App'
import AllChats from '../AllChats'
import ChannelChats from '../ChannelChats'
import GroupChats from '../GroupChats'
import RoomWallpaperPicker from '../RoomWallpaperPicker'
import GradientPicker from '../../components/GradientPicker'
import { useFilePicker } from 'use-file-picker'
import { me, token } from '../../util/settings'
import { serverRoot } from '../../util/Utils'
import { Delete, Folder } from '@material-ui/icons'
import ArrowBackIos from '@material-ui/icons/ArrowBackIos'

function TabPanel(props) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`nav-tabpanel-${index}`}
      aria-labelledby={`nav-tab-${index}`}
      {...other}
      style={{ width: '100%', height: '100%' }}
    >
      {value === index && (
        <Box p={3} style={{ width: '100%', height: '100%' }}>
          {children}
        </Box>
      )}
    </div>
  )
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    direction: 'rtl',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
  listRoot: {
    flexGrow: 1,
    maxWidth: 752,
  },
  demo: {
    backgroundColor: theme.palette.background.paper,
  },
  title: {
    margin: theme.spacing(4, 0, 2),
  }
}))

export default function RoomSettings(props) {
  const classes = useStyles()
  const [expanded, setExpanded] = React.useState(false)
  let [
    valueofRoomBackgroundOption,
    setValueofRoomBackgroundOption,
  ] = React.useState('0')
  let [room, setRoom] = React.useState({})

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false)
  }
  const handleChangeOfRadios = (event, newValue) => {
    setValueofRoomBackgroundOption(newValue)
  }

  const [openFileSelector, { filesContent, loading, errors }] = useFilePicker({
    readAs: 'DataURL',
  })

  const theme = createTheme({
    palette: {
      primary: {
        main: '#fff',
      },
    },
  })

  useEffect(() => {
    let requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        token: token,
      },
      body: JSON.stringify({
        roomId: props.roomId,
      }),
      redirect: 'follow',
    }
    fetch(serverRoot + '/room/get_room', requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(JSON.stringify(result))
        if (result.room !== undefined) {
          setRoom(result.room)
        }
      })
      .catch((error) => console.log('error', error))
  }, [])

  function generate(element) {
    return [0, 1, 2].map((value) =>
      React.cloneElement(element, {
        key: value,
      }),
    );
  }

  return (
    <div className={classes.root}>
      <Avatar
        src={room.avatarId}
        style={{
          width: 112,
          height: 112,
          position: 'absolute',
          left: '50%',
          marginTop: 32,
          transform: 'translateX(-50%)',
        }}
      />
      <div style={{ width: '100%', height: 112 + 32 + 16 }} />
      <Typography
        style={{
          color: '#fff',
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      >
        {room.title}
      </Typography>
      <div style={{ width: '100%', height: 48 + 16 + 16, direction: 'ltr' }} />
          <div>
            <List>
              {generate(
                <ListItem style={{position: 'relative'}}>
                  <ListItemAvatar>
                    <Avatar>
                      <Folder />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={<Typography style={{color: '#fff', width: '100%', textAlign: 'right'}}>Single-line item</Typography>}
                    secondary={<Typography style={{color: '#fff', width: '100%', textAlign: 'right'}}>Single-line item Single-line item</Typography>}
                  />
                  <IconButton style={{width: 40, height: 40, position: 'absolute', left: 0, top: 0}}>
                    <ArrowBackIos style={{fill: '#fff'}}/>
                  </IconButton>
                </ListItem>,
              )}
            </List>
          </div>
      <Typography className={classes.heading}>ویدئو</Typography>
      <Typography className={classes.heading}>بات ها</Typography>
      <Typography className={classes.heading}>تسک بورد</Typography>
      <Typography className={classes.heading}>وایت بورد</Typography>
      <Typography className={classes.heading}>فایل ها</Typography>
      <Typography className={classes.heading}>سوالات</Typography>
    </div>
  )
}
