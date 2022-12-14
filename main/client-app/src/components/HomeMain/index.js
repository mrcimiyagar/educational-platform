import { Fab, Slide, Toolbar, Zoom } from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import ChatIcon from "@material-ui/icons/Chat";
import EditIcon from "@material-ui/icons/Edit";
import GroupIcon from "@material-ui/icons/Group";
import RadioIcon from "@material-ui/icons/Radio";
import PropTypes from "prop-types";
import React, { useEffect } from "react";
import {
  cacheChat,
  fetchChats,
  gotoPage,
  histPage,
  inTheGame,
  isDesktop,
  isInMessenger,
  isMobile,
  isTablet,
  setInTheGame,
} from "../../App";
import store from "../../redux/main";
import { setColors, colors, token } from "../../util/settings";
import { serverRoot, useForceUpdate } from "../../util/Utils";
import AllChats from "../AllChats";
import BotChats from "../BotChats";
import ChannelChats from "../ChannelChats";
import GroupChats from "../GroupChats";
import HomeBottombar from "../HomeBottombar";
import HomeDrawer from "../HomeDrawer";
import HomeNotifs from "../HomeNotifs";
import HomeSearchbar from "../HomeSearchbar";
import HomeSettings from "../HomeSettings";
import HomeToolbar from "../HomeToolbar";
import Jumper from "../SearchEngineFam";
import SpacesGrid from "../SpacesGrid";
import SmartToyOutlinedIcon from "@mui/icons-material/SmartToyOutlined";
import HomeMessenger from "../HomeMessenger";
import { RocketLaunch } from "@mui/icons-material";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`nav-tabpanel-${index}`}
      aria-labelledby={`nav-tab-${index}`}
      {...other}
      style={{ width: "100%", height: "100%" }}
    >
      {value === index && (
        <Box p={3} style={{ width: "100%", height: "100%" }}>
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
    width: "100%",
    maxWidth: "100%",
    height: "100%",
  },
  indicator: {
    backgroundColor: "#fff",
  },
  tab: {
    minWidth: isDesktop() || isTablet() ? 100 : undefined,
    maxWidth: isDesktop() || isTablet() ? 100 : undefined,
    width: isDesktop() || isTablet() ? 100 : undefined,
    color: "#fff",
  },
}));

export let updateHome = undefined;
export let setLastMessage = () => {};
export let addNewChat = () => {};
export let updateChat = () => {};

let tabIndexBackup = 0;
let searchText = "";

export default function HomeAppbar(props) {
  updateHome = useForceUpdate();
  const classes = useStyles();

  const [value, setValue] = React.useState(3);
  let [chats, setChats] = React.useState([]);
  let searchFilltered = chats.filter((chat) => {
    if (
      chat.title !== undefined &&
      chat.title !== null &&
      chat.title.includes(searchText)
    ) {
      return true;
    } else if (
      chat.participent !== undefined &&
      chat.participent !== null &&
      (chat.participent.firstName + " " + chat.participent.lastName).includes(
        searchText
      )
    ) {
      return true;
    } else {
      return false;
    }
  });

  /*useEffect(() => {
    fetchChats().then(chats => {
     setChats(chats);
    })
  }, []);*/

  setLastMessage = (msg, targetChat) => {
    try {
      if (chats.filter((c) => c.id === msg.roomId).length > 0) {
        chats.filter((c) => c.id === msg.roomId)[0].lastMessage = msg;
        chats.sort(function (a, b) {
          if (a.lastMessage === undefined && b.lastMessage === undefined)
            return 0;
          if (b.lastMessage === undefined) return 0 - a.lastMessage.time;
          if (a.lastMessage === undefined) return b.lastMessage.time - 0;
          return b.lastMessage.time - a.lastMessage.time;
        });
        if (targetChat !== undefined) {
          chats.forEach((chat) => {
            if (targetChat.id === chat.id) {
              chat.lastMessage = targetChat.lastMessage;
              chat.unread = targetChat.unread;
            }
          });
        }
        setChats(chats);
        updateHome();
      }
    } catch (ex) {
      console.log(ex);
    }
  };
  addNewChat = (chat) => {
    try {
      chats.unshift(chat);
      chats.sort(function (a, b) {
        if (a.lastMessage === undefined && b.lastMessage === undefined)
          return 0;
        if (b.lastMessage === undefined) return 0 - a.lastMessage.time;
        if (a.lastMessage === undefined) return b.lastMessage.time - 0;
        return b.lastMessage.time - a.lastMessage.time;
      });
      setChats(chats);
      updateHome();
    } catch (ex) {
      console.log(ex);
    }
  };

  updateChat = (chat) => {
    for (let i = 0; i < chats.length; i++) {
      if (chats[i].id === chat.id) {
        chats[i] = chat;
        setChats(chats);
        updateHome();
        break;
      }
    }
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    let requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
      redirect: "follow",
    };
    fetch(serverRoot + "/chat/get_chats", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(JSON.stringify(result));
        result.rooms.forEach((chat) => {
          cacheChat(chat);
        });
        result.rooms.sort(function (a, b) {
          if (a.lastMessage === undefined && b.lastMessage === undefined)
            return 0;
          if (b.lastMessage === undefined) return 0 - a.lastMessage.time;
          if (a.lastMessage === undefined) return b.lastMessage.time - 0;
          return b.lastMessage.time - a.lastMessage.time;
        });
        setChats(result.rooms);
      })
      .catch((error) => console.log("error", error));

    setInTheGame(true);
  }, []);

  if (props.tabIndex !== undefined) {
    tabIndexBackup = props.tabIndex;
  }

  return (
    <div className={classes.root}>
      <HomeMessenger
        chats={searchFilltered}
        onSearch={(text) => {
          searchText = text;
          updateHome();
        }}
        value={value}
        handleChange={handleChange}
        onClose={props.onClose}
        setSelectedChatId={props.setSelectedChatId}
        selectedChatId={props.selectedChatId}
      />
    </div>
  );
}
