import { Card, Fab, Grow, Slide } from "@material-ui/core";
import ImageList from "@material-ui/core/ImageList";
import ImageListItem from "@material-ui/core/ImageListItem";
import { makeStyles } from "@material-ui/core/styles";
import HomeIcon from "@material-ui/icons/Home";
import React, { useEffect } from "react";
import { gotoPage, inTheGame, isDesktop } from "../../App";
import EmptyIcon from "../../images/empty.png";
import RoomsList from "../../routes/pages/roomsList";
import { colors, token } from "../../util/settings";
import { serverRoot } from "../../util/Utils";
import EmptySign from "../EmptySign";
import HomeToolbar from "../HomeToolbar";
import SpacesSearchbar from "../SpacesSearchbar";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    height: "100vh",
  },
  imageList: {
    paddingTop: 32 + 56,
    width: "100%",
    height: "100%",
    overflow: "auto",
    direction: "rtl",
    paddingBottom: 112,
    paddingLeft: isDesktop() ? 112 : 16,
    paddingRight: 16,
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

export default function SpacesGridForInvitation(props) {
  const classes = useStyles();

  let [spaces, setSpaces] = React.useState([]);
  const [showRooms, setShowRooms] = React.useState(false);
  const [selectedSpaceId, setSelectedSpaceId] = React.useState(undefined);

  useEffect(() => {
    let requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
      redirect: "follow",
    };
    fetch(serverRoot + "/room/get_spaces_for_invitation", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(JSON.stringify(result));
        setSpaces(result.spaces);
      })
      .catch((error) => console.log("error", error));
  }, []);

  return (
    <div className={classes.root}>
      <div style={{ width: "100%", position: "fixed", height: "100%" }} />
      <ImageList
        rowHeight={266}
        cols={Math.max(1, Math.floor((window.innerWidth / 2 - 112) / 150))}
        gap={1}
        className={classes.imageList}
        style={{ zIndex: 2, overflow: "auto" }}
      >
        {spaces.length > 0 ? (
          spaces.map((item, index) => (
            <Grow
              in={inTheGame}
              {...{ timeout: (index + 1) * 500 }}
              transitionDuration={1000}
            >
              <ImageListItem
                key={item.img}
                cols={1}
                rows={1}
                onClick={() => {
                  setSelectedSpaceId(item.id);
                  setShowRooms(true);
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
      </ImageList>
      {(showRooms && selectedSpaceId !== undefined) ? (
        <RoomsList
          space_id={selectedSpaceId}
          onRoomSelected={(rId) => {
            let requestOptions = {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                token: token,
              },
              body: JSON.stringify({
                roomId: rId,
                userId: props.userId,
              }),
              redirect: "follow",
            };
            fetch(serverRoot + "/room/invite_to_room", requestOptions)
              .then((response) => response.json())
              .then((result) => {
                console.log(JSON.stringify(result));
                if (result.invite !== undefined) {
                  props.handleClose();
                  alert("دعوتنامه ارسال شد");
                }
              })
              .catch((error) => console.log("error", error));
          }}
        />
      ) : null}
    </div>
  );
}
