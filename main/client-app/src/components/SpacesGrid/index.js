import { Card, Dialog, Fab, Grow, Slide } from "@material-ui/core";
import ImageList from "@material-ui/core/ImageList";
import ImageListItem from "@material-ui/core/ImageListItem";
import { makeStyles } from "@material-ui/core/styles";
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import React, { useEffect } from "react";
import {
  cacheSpace,
  fetchSpaces,
  inTheGame,
  setCurrentRoomId,
} from "../../App";
import { colors, homeRoomId, token } from "../../util/settings";
import { serverRoot } from "../../util/Utils";
import EmptySign from "../EmptySign";
import SpacesSearchbar from "../SpacesSearchbar";
import { Add } from "@material-ui/icons";
import StorefrontIcon from "@mui/icons-material/Storefront";
import CreateRoom from "../../routes/pages/createRoom";
import SearchEngine from "../../routes/pages/searchEngine";

const useStyles = makeStyles((theme) => ({
  imageList: {
    width: "100%",
    direction: "rtl",
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 104,
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

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="right" ref={ref} {...props} />;
});

export let closeSpacesGrid = () => {};

export default function SpacesGrid(props) {
  const [open, setOpen] = React.useState(true);
  const [showGlobe, setShowGlobe] = React.useState(false);
  const handleClose = () => {
    setOpen(false);
    setTimeout(() => {
      props.onClose();
    }, 250);
  };

  const classes = useStyles();

  document.documentElement.style.overflowY = "hidden";

  let [spaces, setSpaces] = React.useState([]);
  let [visibilityAllowed, setVisibilityAllowed] = React.useState(false);
  let [showAddRoom, setShowAddRoom] = React.useState(false);

  const loadSpaces = () => {
    fetchSpaces()
      .then((result) => {
        setSpaces(result);
        let requestOptions = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            token: token,
          },
          redirect: "follow",
        };
        fetch(serverRoot + "/room/get_spaces", requestOptions)
          .then((response) => response.json())
          .then((result) => {
            console.log(JSON.stringify(result));
            if (result.spaces !== undefined) {
              setSpaces(result.spaces);
              result.spaces.forEach((s) => {
                cacheSpace(s);
              });
            }
          })
          .catch((error) => console.log("error", error));
      })
      .catch((ex) => {
        console.log(ex);
      });
  };

  useEffect(() => {
    setTimeout(() => {
      setVisibilityAllowed(true);
    }, 250);
    loadSpaces();
  }, []);

  return (
    <Dialog
      onTouchStart={(e) => {
        e.stopPropagation();
      }}
      PaperProps={{
        style: {
          backgroundColor: "transparent",
          boxShadow: "none",
          backdropFilter: "blur(15px)",
          backgroundColor: colors.backSide,
        },
      }}
      fullScreen
      open={open}
      onClose={handleClose}
      TransitionComponent={Transition}
    >
      <div
        id="spacesSearchBarScroller"
        style={{
          overflow: "auto",
          position: "fixed",
          left: 0,
          top: 0,
          right: 0,
          bottom: 0,
        }}
      >
        <SpacesSearchbar
          id="spacesSearchBarContainer"
          onBackClicked={handleClose}
          onGlobeClicked={() => setShowGlobe(true)}
          style={{
            transform: `translateX(-50%)`,
            transition: "transform .5s",
            width: "75%",
            maxWidth: 300,
            position: "fixed",
            right: "12.5%",
            top: 32,
            zIndex: 3,
            backgroundColor: colors.field,
          }}
        />
        <div
          style={{
            width: "100%",
            position: "fixed",
            height: "100%",
            opacity: inTheGame && visibilityAllowed ? 1 : 0,
            transition: "opacity 1s",
          }}
        />
        <ImageList
          rowHeight={266}
          cols={Math.max(1, Math.floor((window.innerWidth - 112 - 240) / 200))}
          gap={1}
          className={classes.imageList}
        >
          {spaces.length > 0 ? (
            spaces.map((item, index) => (
              <Grow in={inTheGame} {...{ timeout: (index + 1) * 500 }}>
                <ImageListItem
                  key={item.img}
                  cols={1}
                  rows={1}
                  onClick={() => {
                    handleClose();
                    setTimeout(() => {
                      setCurrentRoomId(item.mainRoomId);
                    }, 250);
                  }}
                >
                  <Card
                    style={{
                      position: "relative",
                      margin: 4,
                      backdropFilter: "blur(10px)",
                      backgroundColor: colors.field,
                      borderRadius: 16,
                    }}
                  >
                    <img
                      src={
                        "https://cdn.dribbble.com/users/6093092/screenshots/15548423/media/54c06b30c11db3ffd26b25c83ab9a737.jpg"
                      }
                      alt={item.title}
                      style={{ borderRadius: 16, width: "100%", height: 196 }}
                    />
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        paddingTop: 8,
                        paddingBottom: 12,
                        textAlign: "center",
                        justifyContent: "center",
                        alignItems: "center",
                        color: colors.text,
                      }}
                    >
                      {item.title}
                    </div>
                  </Card>
                </ImageListItem>
              </Grow>
            ))
          ) : (
            <EmptySign />
          )}
          {spaces.length > 0 ? (
            <div style={{ width: "100%", height: 200 }} />
          ) : null}
        </ImageList>
        <Fab
          style={{
            position: "fixed",
            bottom: 24,
            left: 24,
            backgroundColor: colors.accent,
          }}
          onClick={() => {
            handleClose();
            setTimeout(() => {
              setCurrentRoomId(homeRoomId);
            }, 250);
          }}
        >
          <HomeOutlinedIcon />
        </Fab>
        <Fab
          style={{
            position: "fixed",
            bottom: 24,
            left: 24 + 56 + 16,
            backgroundColor: colors.accent,
          }}
          onClick={() => {
            handleClose();
            setTimeout(() => {
              setCurrentRoomId(1);
            }, 250);
          }}
        >
          <StorefrontIcon />
        </Fab>
        <Fab
          style={{
            position: "fixed",
            bottom: 24 + 56 + 16,
            left: 24,
            backgroundColor: colors.accent,
          }}
          onClick={() => setShowAddRoom(true)}
        >
          <Add />
        </Fab>
        {showAddRoom ? (
          <CreateRoom
            reloadDataCallback={loadSpaces}
            onClose={() => {
              setShowAddRoom(false);
            }}
          />
        ) : null}
        {showGlobe ? <SearchEngine onClose={() => setShowGlobe(false)} /> : null}
      </div>
    </Dialog>
  );
}
