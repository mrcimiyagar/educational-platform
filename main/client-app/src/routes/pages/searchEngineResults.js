import {
  AppBar,
  Card,
  Dialog,
  ImageList,
  ImageListItem,
  Paper,
  Slide,
  Toolbar,
  Typography,
} from "@material-ui/core";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import { Audiotrack, Chat, Photo, Videocam } from "@material-ui/icons";
import AccountBalanceIcon from "@material-ui/icons/AccountBalance";
import EmailIcon from "@material-ui/icons/Email";
import PeopleIcon from "@material-ui/icons/People";
import RedditIcon from "@material-ui/icons/Reddit";
import PropTypes from "prop-types";
import React, { useEffect } from "react";
import SwipeableViews from "react-swipeable-views";
import {
  gotoPage,
  isDesktop,
  popPage,
  query,
  registerDialogOpen,
  setQuery,
} from "../../App";
import HomeToolbar from "../../components/HomeToolbar";
import PhotoGrid from "../../components/PhotoGrid";
import Post from "../../components/Post";
import SearchEngineResultsSearchbar from "../../components/SearchEngineResultsSearchbar";
import SearchResultsMessages from "../../components/SearchResultsMessages";
import SearchResultsUsers from "../../components/SearchResultsUsers";
import SearchResultsVideos from "../../components/SearchResultsVideos";
import AudioWallpaper from "../../images/audio-wallpaper.jpg";
import EmptyIcon from "../../images/empty.png";
import { colors, token } from "../../util/settings";
import { serverRoot } from "../../util/Utils";
import Profile from "./profile";

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
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="right" ref={ref} {...props} />;
});

function SearchEngineResults(props) {
  const useStyles = makeStyles((theme) => ({
    indicator: {
      backgroundColor: colors.oposText,
    },
    imageList: {
      overflow: "auto",
    },
  }));

  document.documentElement.style.overflow = "hidden";

  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const [open, setOpen] = React.useState(true);
  registerDialogOpen(setOpen);

  let [users, setUsers] = React.useState([]);
  let [bots, setBots] = React.useState([]);
  let [rooms, setRooms] = React.useState([]);
  let [photos, setPhotos] = React.useState([]);
  let [audios, setAudios] = React.useState([]);
  let [videos, setVideos] = React.useState([]);
  let [messages, setMessages] = React.useState([]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };

  const handleClose = () => {
    setOpen(false);
    setTimeout(props.onClose, 250);
  };

  let fetchUsers = () => {
    let requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
      body: JSON.stringify({
        query: query,
      }),
      redirect: "follow",
    };
    fetch(serverRoot + "/search/search_users", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(JSON.stringify(result));
        if (result.users !== undefined) {
          setUsers(result.users);
        }
      })
      .catch((error) => console.log("error", error));
  };

  let fetchBots = () => {
    let requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
      body: JSON.stringify({
        query: query,
      }),
      redirect: "follow",
    };
    fetch(serverRoot + "/search/search_bots", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(JSON.stringify(result));
        if (result.bots !== undefined) {
          setBots(result.bots);
        }
      })
      .catch((error) => console.log("error", error));
  };

  let fetchRooms = () => {
    let requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
      body: JSON.stringify({
        query: query,
      }),
      redirect: "follow",
    };
    fetch(serverRoot + "/search/search_rooms", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(JSON.stringify(result));
        if (result.rooms !== undefined) {
          setRooms(result.rooms);
        }
      })
      .catch((error) => console.log("error", error));
  };

  let fetchFiles = (fileType) => {
    let requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
      body: JSON.stringify({
        query: query,
        fileType: fileType,
      }),
      redirect: "follow",
    };
    fetch(serverRoot + "/search/search_files", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(JSON.stringify(result));
        if (result.files !== undefined) {
          if (fileType === "photo") {
            setPhotos(result.files);
          } else if (fileType === "audio") {
            setAudios(result.files);
          } else if (fileType === "video") {
            setVideos(result.files);
          }
        }
      })
      .catch((error) => console.log("error", error));
  };

  let fetchMessages = () => {
    let requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
      body: JSON.stringify({
        query: query,
      }),
      redirect: "follow",
    };
    fetch(serverRoot + "/search/search_messages", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(JSON.stringify(result));
        if (result.messages !== undefined) {
          setMessages(result.messages);
        }
      })
      .catch((error) => console.log("error", error));
  };

  let fetchTotal = () => {
    fetchUsers();
    fetchBots();
    fetchRooms();
    fetchFiles("photo");
    fetchFiles("audio");
    fetchFiles("video");
    fetchMessages();
  };

  useEffect(() => {
    fetchTotal();
  }, []);

  return (
    <Dialog
      fullScreen
      open={open}
      TransitionComponent={Transition}
      PaperProps={{
        style: {
          width: "100%",
          height: "100%",
          background: "transparent",
          backdropFilter: colors.blur,
        },
      }}
      style={{
        background: "transparent",
        width: "100%",
        height: "100%",
        position: "fixed",
        left: 0,
        top: 0,
      }}
    >
      <div
        style={{
          direction: "ltr",
          width: "100%",
          height: "100%",
          position: "fixed",
          left: 0,
          top: 0,
        }}
      >
        <div style={{ width: "100%", height: "calc(100% - 32px)" }}>
          <SearchEngineResultsSearchbar
            handleClose={handleClose}
            onQueryChange={(q) => {
              setQuery(q);
              fetchTotal();
            }}
          />
          <SwipeableViews
            axis={"x-reverse"}
            index={value}
            onChangeIndex={handleChangeIndex}
            style={{ width: "100%", height: "100%", position: 'fixed', top: 0 }}
          >
            <TabPanel>
              <ImageList
                rowHeight={462}
                style={{
                  overflowY: "auto",
                  overflow: "auto",
                  height: "100%",
                }}
                cols={1}
              >
                <div style={{ width: "100%", height: 80 }} />
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((index) => (
                  <ImageListItem key={"search-post-" + 0} cols={1}>
                    <Post />
                  </ImageListItem>
                ))}
                <div style={{ width: "100%", height: 72 }} />
              </ImageList>
            </TabPanel>
            <TabPanel value={value} index={1}>
              <div style={{ height: 80 }} />
              <SearchResultsUsers
                data={users}
                onUserSelected={(userId) => {
                  props.onUserSelected(userId);
                }}
              />
            </TabPanel>
            <TabPanel value={value} index={2}>
              <div style={{ height: 80 }} />
              <ImageList rowHeight={196} className={classes.imageList} cols={2}>
                {bots.length > 0 ? (
                  bots.map((bot) => (
                    <ImageListItem
                      key={"search-bot-" + bot.id}
                      cols={1}
                      onClick={() => gotoPage("/app/storebot")}
                    >
                      <div style={{ position: "relative" }}>
                        <img
                          src={
                            serverRoot +
                            `/file/download_bot_avatar?token=${token}&botId=${bot.id}`
                          }
                          alt={bot.title}
                          style={{
                            paddingLeft: 24,
                            paddingRight: 24,
                            paddingTop: 16,
                            paddingBottom: 16,
                            backgroundColor: colors.field,
                            backdropFilter: colors.blur,
                            borderRadius: 16,
                            marginTop: 16,
                            marginRight: "5%",
                            width: "95%",
                            height: 128,
                          }}
                        />
                        <Card
                          style={{
                            backgroundColor: "rgba(255, 255, 255, 0.5)",
                            borderRadius: 16,
                            width: "95%",
                            height: 72,
                            marginRight: "2.5%",
                            marginTop: -32,
                          }}
                        >
                          <Typography
                            style={{
                              position: "absolute",
                              top: 156,
                              left: "50%",
                              transform: "translateX(-50%)",
                              color: colors.text
                            }}
                          >
                            {bot.title}
                          </Typography>
                        </Card>
                      </div>
                    </ImageListItem>
                  ))
                ) : (
                  <div
                    style={{
                      width: "calc(100% - 96px)",
                      height: "100%",
                      marginLeft: 48,
                      marginRight: 48,
                      marginTop: 80,
                      backgroundColor: "rgba(255, 255, 255, 0.25)",
                      backdropFilter: colors.blur,
                      borderRadius: "50%",
                    }}
                  >
                    <img
                      src={EmptyIcon}
                      style={{ width: "100%", height: "100%", padding: 64 }}
                    />
                  </div>
                )}
              </ImageList>
            </TabPanel>
            <TabPanel value={value} index={3}>
              <div style={{ height: 80 }} />
              <ImageList
                rowHeight={200}
                cols={2}
                gap={1}
                className={classes.imageList}
                style={{
                  marginLeft: -16,
                  marginRight: -16,
                  width: "calc(100% + 32px)",
                  zIndex: 2,
                }}
              >
                {rooms.length > 0 ? (
                  rooms.map((room) => (
                    <ImageListItem
                      key={"search-room-" + room.id}
                      cols={1}
                      rows={1}
                      onClick={() => {
                        gotoPage("/app/conf?room_id=1");
                      }}
                    >
                      <div style={{ position: "relative" }}>
                        <img
                          src={
                            "https://cdn.dribbble.com/users/6093092/screenshots/15548423/media/54c06b30c11db3ffd26b25c83ab9a737.jpg"
                          }
                          alt={room.title}
                          style={{
                            borderRadius: 16,
                            marginTop: 16,
                            marginRight: "2.5%",
                            width: "95%",
                            height: 128,
                          }}
                        />
                        <Card
                          style={{
                            backgroundColor: colors.field,
                            borderRadius: 16,
                            width: "95%",
                            height: 72,
                            marginRight: "2.5%",
                            marginTop: -32,
                          }}
                        >
                          <Typography
                            style={{
                              position: "absolute",
                              top: 156,
                              left: "50%",
                              transform: "translateX(-50%)",
                              color: colors.text
                            }}
                          >
                            {room.title}
                          </Typography>
                        </Card>
                      </div>
                    </ImageListItem>
                  ))
                ) : (
                  <div
                    style={{
                      width: "calc(100% - 96px)",
                      height: "100%",
                      marginLeft: 48,
                      marginRight: 48,
                      marginTop: 80,
                      backgroundColor: "rgba(255, 255, 255, 0.25)",
                      backdropFilter: colors.blur,
                      borderRadius: "50%",
                    }}
                  >
                    <img
                      src={EmptyIcon}
                      style={{ width: "100%", height: "100%", padding: 64 }}
                    />
                  </div>
                )}
              </ImageList>
            </TabPanel>
            <TabPanel value={value} index={4}>
              <div style={{ height: 80 }} />
              <PhotoGrid data={photos} />
            </TabPanel>
            <TabPanel value={value} index={5}>
              <div style={{ height: 80 }} />
              {audios.length > 0 ? (
                <ImageList
                  rowHeight={196}
                  style={{
                    width: "calc(100% + 32px)",
                    marginLeft: -16,
                    marginRight: -16,
                  }}
                  cols={2}
                >
                  {audios.map((audio) => (
                    <ImageListItem key={"search-audio-" + audio.id} cols={1}>
                      <div
                        style={{
                          position: "relative",
                          display: "flex",
                          flexWrap: "nowrap",
                        }}
                      >
                        <div
                          style={{
                            borderRadius: 176 / 2,
                            backgroundColor: "#000",
                            width: 176 - 32,
                            height: 176 - 32,
                            marginTop: 16 + 16,
                            marginRight: -112,
                          }}
                        />
                        <img
                          src={AudioWallpaper}
                          alt={audio.title}
                          style={{
                            borderRadius: 16,
                            marginTop: 16,
                            marginRight: -72,
                            width: "calc(95% - 32px)",
                            height: 176,
                          }}
                        />
                        <Typography
                          style={{
                            background: "rgba(255, 255, 255, 0.5)",
                            borderRadius: "12px 0px 0px 12px",
                            marginLeft: -72,
                            marginTop: 136,
                            width: 144,
                            height: 24,
                            textAlign: "center",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          {audio["User.firstName"] +
                            " " +
                            audio["User.lastName"]}
                        </Typography>
                      </div>
                    </ImageListItem>
                  ))}
                </ImageList>
              ) : (
                <div
                  style={{
                    width: "calc(100% - 96px)",
                    height: "100%",
                    marginLeft: 48,
                    marginRight: 48,
                    marginTop: 80,
                    backgroundColor: "rgba(255, 255, 255, 0.25)",
                    backdropFilter: colors.blur,
                    borderRadius: "50%",
                  }}
                >
                  <img
                    src={EmptyIcon}
                    style={{ width: "100%", height: "100%", padding: 64 }}
                  />
                </div>
              )}
            </TabPanel>
            <TabPanel value={value} index={6}>
              <div style={{ height: 80 }} />
              <SearchResultsVideos data={videos} />
            </TabPanel>
            <TabPanel value={value} index={7}>
              <div style={{ height: 80 }} />
              <SearchResultsMessages data={messages} />
            </TabPanel>
          </SwipeableViews>
          <Paper
            style={{
              borderRadius: "16px 16px 0px 0px",
              position: "fixed",
              bottom: 0,
              width: "100%",
              backgroundColor: colors.primaryMedium,
              backdropFilter: colors.blur,
            }}
          >
            <Tabs
              value={value}
              onChange={handleChange}
              variant="scrollable"
              scrollButtons="on"
              classes={{
                indicator: classes.indicator,
              }}
              style={{ color: colors.oposText, direction: "rtl" }}
            >
              <Tab
                icon={<EmailIcon style={{ fill: colors.oposText }} />}
                style={{ color: colors.oposText }}
                label="پست ها"
              />
              <Tab
                icon={<PeopleIcon style={{ fill: colors.oposText }} />}
                style={{ color: colors.oposText }}
                label="کاربران"
              />
              <Tab
                icon={<RedditIcon style={{ fill: colors.oposText }} />}
                style={{ color: colors.oposText }}
                label="بات ها"
              />
              <Tab
                icon={<AccountBalanceIcon style={{ fill: colors.oposText }} />}
                style={{ color: colors.oposText }}
                label="فضا ها"
              />
              <Tab
                icon={<Photo style={{ fill: colors.oposText }} />}
                style={{ color: colors.oposText }}
                label="عکس ها"
              />
              <Tab
                icon={<Audiotrack style={{ fill: colors.oposText }} />}
                style={{ color: colors.oposText }}
                label="صدا ها"
              />
              <Tab
                icon={<Videocam style={{ fill: colors.oposText }} />}
                style={{ color: colors.oposText }}
                label="ویدئو ها"
              />
              <Tab
                icon={<Chat style={{ fill: colors.oposText }} />}
                style={{ color: colors.oposText }}
                label="پیام ها"
              />
            </Tabs>
          </Paper>
        </div>
      </div>
    </Dialog>
  );
}
export default SearchEngineResults;
