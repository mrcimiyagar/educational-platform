import {
  Avatar,
  Card,
  Fab,
  Grow,
  Paper,
  Slide,
  Typography,
  ThemeProvider,
} from "@material-ui/core";
import ImageList from "@material-ui/core/ImageList";
import ImageListItem from "@material-ui/core/ImageListItem";
import { makeStyles } from "@material-ui/core/styles";
import ColorLensIcon from "@material-ui/icons/ColorLens";
import DataUsageIcon from "@material-ui/icons/DataUsage";
import LanguageIcon from "@material-ui/icons/Language";
import NotificationsIcon from "@material-ui/icons/Notifications";
import SecurityIcon from "@material-ui/icons/Security";
import VpnKeyIcon from "@material-ui/icons/VpnKey";
import WebIcon from "@material-ui/icons/Web";
import WifiTetheringIcon from "@material-ui/icons/WifiTethering";
import React, { useEffect } from "react";
import { inTheGame, isDesktop, setBottomSheetContent, setBSO } from "../../App";
import { colors, me, theme, token } from "../../util/settings";
import SettingsSearchbar from "../SettingsSearchbar";
import { serverRoot } from "../../util/Utils";
import { Save } from "@material-ui/icons";
import ProfileEditField from "../ProfileEditField";
import MainSettingsNotifications from "../MainSettingsNotifications";
import MainSettingsAppearance from "../MainSettingsAppearance";
import MainSettingsNetwork from "../MainSettingsNetwork";
import MainSettingsSecurity from "../MainSettingsSecurity";
import MainSettingsData from "../MainSettingsData";
import MainSettingsLanguage from "../MainSettingsLanguage";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    height: "100%",
  },
  imageList: {
    paddingTop: 48,
    width: "100%",
    height: "auto",
    paddingBottom: 56,
    paddingLeft: 16,
    paddingRight: 16,
    overflow: "hidden",
    transform: "translateZ(0)",
  },
  titleBar: {
    background:
      "linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, " +
      "rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)",
  },
  icon: {
    color: "white",
  },
}));

var lastScrollTop = 0;

export default function SettingsList(props) {
  const classes = useStyles();

  const [visibilityAllowed, setVisibilityAllowed] = React.useState(false);
  const [showNotificationsSettings, setShowNotificationsSettings] =
    React.useState(false);
  const [showAppearanceSettings, setShowAppearanceSettings] =
    React.useState(false);
  const [showSecuritySettings, setShowSecuritySettings] = React.useState(false);
  const [showNetworkSettings, setShowNetworkSettings] = React.useState(false);
  const [showDataSettings, setShowDataSettings] = React.useState(false);
  const [showLanguageSettings, setShowLanguageSettings] = React.useState(false);

  const itemData = [
    {
      icon: NotificationsIcon,
      title: "اعلانات",
      onClick: () => {
        setShowNotificationsSettings(true);
      },
    },
    {
      icon: ColorLensIcon,
      title: "ظاهر",
      onClick: () => {
        setShowAppearanceSettings(true);
      },
    },
    {
      icon: WifiTetheringIcon,
      title: "شبکه",
      onClick: () => {
        setShowNetworkSettings(true);
      },
    },
    {
      icon: SecurityIcon,
      title: "امنیت",
      onClick: () => {
        setShowSecuritySettings(true);
      },
    },
    {
      icon: DataUsageIcon,
      title: "دیتا",
      onClick: () => {
        setShowDataSettings(true);
      },
    },
    {
      icon: LanguageIcon,
      title: "زبان",
      onClick: () => {
        setShowLanguageSettings(true);
      },
    },
  ];

  useEffect(() => {
    let settingsSearchBarContainer = document.getElementById(
      "settingsSearchBarContainer"
    );
    if (settingsSearchBarContainer !== null) {
      settingsSearchBarContainer.style.transform =
        inTheGame && visibilityAllowed
          ? `translateX(${
              isDesktop() ? "calc(-50% - 125px)" : "-50%"
            }) translateY(0)`
          : `translateX(${
              isDesktop() ? "calc(-50% - 125px)" : "-50%"
            }) translateY(-100px)`;
    }
  }, [inTheGame, visibilityAllowed]);

  useEffect(() => {
    setTimeout(() => {
      setVisibilityAllowed(true);
    }, 250);

    let settingsSearchBarContainer = document.getElementById(
      "settingsSearchBarContainer"
    );
    let settingsSearchBarScroller = document.getElementById(
      "settingsSearchBarScroller"
    );
    settingsSearchBarScroller.addEventListener(
      "scroll",
      function () {
        var st = settingsSearchBarScroller.scrollTop;
        if (st > lastScrollTop) {
          settingsSearchBarContainer.style.transform = `translateX(${
            isDesktop() ? "calc(-50% - 125px)" : "-50%"
          }) translateY(-100px)`;
        } else {
          settingsSearchBarContainer.style.transform = `translateX(${
            isDesktop() ? "calc(-50% - 125px)" : "-50%"
          }) translateY(0)`;
        }
        lastScrollTop = st <= 0 ? 0 : st;
      },
      false
    );
  }, []);

  return (
    <div className={classes.root} id="settingsSearchBarScroller">
      <div
        id="settingsSearchBarContainer"
        style={{
          transform: `translateX(${
            isDesktop() ? "calc(-50% - 125px)" : "-50%"
          }) translateY(-100px)`,
          transition: "transform .5s",
          width: "75%",
          maxWidth: 300,
          position: "fixed",
          left: "50%",
          top: 32,
          zIndex: 1,
          direction: "rtl",
        }}
      >
        <SettingsSearchbar setDrawerOpen={props.onClose} />
      </div>
      <div
        style={{
          width: "100%",
          height: "100%",
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
          top: 0,
          backdropFilter: colors.blur,
          background: colors.backSide,
        }}
      />
      <ImageList
        rowHeight={224}
        cols={2}
        gap={1}
        className={classes.imageList}
        style={{
          width: isDesktop()
            ? "calc(100% - 32px - 280px - 144px - 16px)"
            : "100%",
          position: "absolute",
          left: isDesktop() ? 72 + 32 : 0,
          opacity: inTheGame && visibilityAllowed ? 1 : 0,
        }}
      >
        <ImageListItem
          cols={2}
          rows={1}
          style={{ marginTop: 48, height: 96 }}
        >
          <Grow in={inTheGame} {...{ timeout: 1000 }} transitionDuration={1000}>
            <Card
              onClick={() => {
                setBottomSheetContent(
                  <div style={{ width: "100%", height: 300 }}>
                    <Avatar
                      style={{
                        zIndex: 99999,
                        width: 150,
                        height: 150,
                        position: "absolute",
                        left: "50%",
                        transform: "translateX(-50%)",
                      }}
                      src={
                        serverRoot +
                        `/file/download_user_avatar?token=${token}&userId=${me.id}`
                      }
                    />
                    <ThemeProvider theme={theme}>
                      <Fab
                        color={"secondary"}
                        style={{
                          zIndex: 99999,
                          position: "absolute",
                          left: "calc(50% - 150px)",
                          transform: "translate(-50%, 47px)",
                        }}
                        onClick={() => {
                          let requestOptions = {
                            method: "POST",
                            headers: {
                              "Content-Type": "application/json",
                              token: token,
                            },
                            body: JSON.stringify({
                              firstName: document.getElementById(
                                "profileEditFirstName"
                              ).value,
                              lastName: document.getElementById(
                                "profileEditLastName"
                              ).value,
                            }),
                            redirect: "follow",
                          };
                          fetch(serverRoot + "/auth/edit_me", requestOptions)
                            .then((response) => response.json())
                            .then((result) => {
                              if (result.status === "success") {
                                me.firstName = document.getElementById(
                                  "profileEditFirstName"
                                ).value;
                                me.lastName = document.getElementById(
                                  "profileEditLastName"
                                ).value;
                                setBSO(false);
                                setTimeout(() => {
                                  setBottomSheetContent(null);
                                }, 250);
                              } else {
                                alert(result.message);
                              }
                            });
                        }}
                      >
                        <Save />
                      </Fab>
                    </ThemeProvider>
                    <Paper
                      style={{
                        borderRadius: "24px 24px 0 0",
                        width: "100%",
                        height: "calc(100% - 75px)",
                        position: "absolute",
                        top: 100,
                        left: 0,
                        background: colors.primaryMedium,
                        backdropFilter: colors.blur,
                      }}
                    >
                      <ProfileEditField
                        id="profileEditFirstName"
                        defaultValue={me.firstName}
                        placeholder={"نام"}
                        style={{
                          marginTop: 16 + 76 + 16,
                          marginLeft: 16,
                          marginRight: 16,
                          width: "calc(100% - 32px)",
                          height: 48,
                        }}
                      />
                      <ProfileEditField
                        id="profileEditLastName"
                        defaultValue={me.lastName}
                        placeholder={"نام خانوادگی"}
                        style={{
                          marginTop: 16,
                          marginLeft: 16,
                          marginRight: 16,
                          width: "calc(100% - 32px)",
                          height: 48,
                        }}
                      />
                    </Paper>
                  </div>
                );
                setBSO(true);
              }}
              style={{
                width: "calc(100% - 64px)",
                maxWidth: 200,
                height: 48,
                borderRadius: 24,
                position: "absolute",
                right: 16,
                transform: "translateY(24px)",
                display: "flex",
                backgroundColor: colors.field,
                backdropFilter: colors.blur,
              }}
            >
              <div style={{ padding: 8, width: 48, height: 48 }}>
                <Avatar
                  src={
                    serverRoot +
                    `/file/download_user_avatar?token=${token}&userId=${me.id}`
                  }
                  style={{ width: "100%", height: "100%" }}
                ></Avatar>
              </div>
              <Typography
                style={{ fontSize: 17, marginTop: 12, color: colors.text }}
              >
                {me.firstName + " " + me.lastName}
              </Typography>
            </Card>
          </Grow>
        </ImageListItem>
        {itemData.map((item, index) => {
          let IconComp = item.icon;
          return (
            <ImageListItem
              key={item.img}
              cols={1}
              rows={1}
              style={{
                padding: 8,
              }}
              onClick={item.onClick}
            >
              <Grow
                in={inTheGame}
                {...{ timeout: (index + 2) * 500 }}
                transitionDuration={1000}
              >
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    height: "100%",
                    backgroundColor: colors.field,
                    backdropFilter: colors.blur,
                    borderRadius: 16,
                  }}
                >
                  <IconComp
                    style={{
                      position: "absolute",
                      top: 32,
                      left: "50%",
                      transform: "translateX(-50%)",
                      fill: "#2196f3",
                      width: 112,
                      height: 112,
                    }}
                  />
                  <Typography
                    style={{
                      color: colors.text,
                      position: "absolute",
                      top: 156,
                      left: "50%",
                      transform: "translateX(-50%)",
                      fontWeight: "bold",
                    }}
                  >
                    {item.title}
                  </Typography>
                </div>
              </Grow>
            </ImageListItem>
          );
        })}
        <ImageListItem
          cols={2}
          rows={1}
          style={{ marginTop: "100%" }}
        ></ImageListItem>
      </ImageList>
      <Slide
        direction="right"
        in={inTheGame}
        mountOnEnter
        unmountOnExit
        {...{ timeout: 1000 }}
      >
        <Fab
          style={{
            position: "fixed",
            bottom: 16,
            left: 16,
            backgroundColor: colors.accent,
          }}
          onClick={props.onDeveloperModeClicked}
        >
          <VpnKeyIcon />
        </Fab>
      </Slide>
      {showNotificationsSettings ? (
        <MainSettingsNotifications
          onClose={() => {
            setShowNotificationsSettings(false);
          }}
        />
      ) : null}
      {showAppearanceSettings ? (
        <MainSettingsAppearance
          onClose={() => {
            setShowAppearanceSettings(false);
          }}
        />
      ) : null}
      {showNetworkSettings ? (
        <MainSettingsNetwork
          onClose={() => {
            setShowNetworkSettings(false);
          }}
        />
      ) : null}
      {showSecuritySettings ? (
        <MainSettingsSecurity
          onClose={() => {
            setShowSecuritySettings(false);
          }}
        />
      ) : null}
      {showDataSettings ? (
        <MainSettingsData
          onClose={() => {
            setShowDataSettings(false);
          }}
        />
      ) : null}
      {showLanguageSettings ? (
        <MainSettingsLanguage
          onClose={() => {
            setShowLanguageSettings(false);
          }}
        />
      ) : null}
    </div>
  );
}
