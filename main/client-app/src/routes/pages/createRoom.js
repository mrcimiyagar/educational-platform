import { Fab, Paper } from "@material-ui/core";
import React, { useEffect } from "react";
import { setBottomSheetContent, setBSO, setOnBsClosed } from "../../App";
import { colors, token } from "../../util/settings";
import { serverRoot } from "../../util/Utils";
import { reloadRoomsList } from "../../components/RoomTreeBox";
import ProfileEditField from "../../components/ProfileEditField";
import { Done } from "@material-ui/icons";
import PrivatePublicToggle from "../../components/PrivatePublicToggle";
import ShowHideToggle from "../../components/ShowHideToggle";

export default function CreateRoom(props) {
  const [value, setValue] = React.useState("public");
  const [hidden, setHidden] = React.useState(false);
  const [isMine, setIsMine] = React.useState(false);

  const handleClose = () => {
    setBSO(false);
    setTimeout(() => {
      setBottomSheetContent(null);
      props.onClose();
    }, 250);
  };

  useEffect(() => {
    let requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
      body: JSON.stringify({
        spaceId: props.spaceId,
      }),
      redirect: "follow",
    };
    fetch(serverRoot + "/room/is_space_mine", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(JSON.stringify(result));
        setIsMine(result.isMine);
      })
      .catch((error) => console.log("error", error));
    setOnBsClosed(handleClose);
    setBottomSheetContent(
      <div style={{ width: "100%", height: 450, direction: "rtl" }}>
        <Fab
          style={{
            zIndex: 99999,
            position: "absolute",
            left: "calc(50% - 150px)",
            transform: "translate(-50%, 47px)",
            backgroundColor: colors.accent,
          }}
          onClick={() => {
            let requestOptions = {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                token: token,
              },
              body: JSON.stringify({
                title: document.getElementById("roomCreationTitle").value,
                chatType: "group",
                spaceId: props.spaceId,
                accessType: value,
                hidden: hidden
              }),
              redirect: "follow",
            };
            fetch(serverRoot + "/room/create_room", requestOptions)
              .then((response) => response.json())
              .then((result) => {
                console.log(JSON.stringify(result));
                if (result.room !== undefined) {
                  if (props.reloadDataCallback !== undefined) {
                    props.reloadDataCallback();
                  } else {
                    reloadRoomsList();
                  }
                  handleClose();
                }
              })
              .catch((error) => console.log("error", error));
          }}
        >
          <Done />
        </Fab>
        <Paper
          style={{
            borderRadius: "24px 24px 0 0",
            width: "100%",
            height: "calc(100% - 75px)",
            position: "absolute",
            top: 100,
            left: 0,
            background: colors.primaryMedium,
            backdropFilter: "blur(10px)",
          }}
        >
          <ProfileEditField
            id="roomCreationTitle"
            placeholder="عنوان اتاق"
            style={{
              marginTop: 56,
              marginLeft: 32,
              marginRight: 32,
              width: "calc(100% - 64px)",
              height: 48,
              color: "#fff",
              paddingLeft: 16,
              paddingRight: 16,
            }}
          />
          <div
            style={{
              width: "100%",
              textAlign: "center",
              justifyContent: "center",
              alignItems: "center",
              marginTop: 32,
            }}
          >
            <PrivatePublicToggle setParentValue={setValue} />
          </div>
          {props.spaceId !== undefined && props.spaceId !== null && isMine ? (
            <div
              style={{
                width: "100%",
                textAlign: "center",
                justifyContent: "center",
                alignItems: "center",
                marginTop: 32,
              }}
            >
              <ShowHideToggle setParentValue={setHidden} />
            </div>
          ) : null}
        </Paper>
      </div>
    );
    setBSO(true);
  }, []);
  return null;
}
