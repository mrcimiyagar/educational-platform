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

let instantIsMine = false, instantTitle = '', instantAccessType = 'public', instantHidden = false;

export default function CreateRoom(props) {
  const [initTitle, setInitTitle] = React.useState("");
  const [value, setValue] = React.useState("public");
  const [hidden, setHidden] = React.useState(false);
  const [isMine, setIsMine] = React.useState(false);

  const showSheet = (it, iat, ih, iim) => {
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
                hidden: hidden,
              }),
              redirect: "follow",
            };
            fetch(serverRoot + props.editingRoomId === undefined ? "/room/create_room" : "/room/update_room", requestOptions)
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
            defaultValue={it}
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
            <PrivatePublicToggle setParentValue={setValue} defaultValue={iat} />
          </div>
          {iim ? (
            <div
              style={{
                width: "100%",
                textAlign: "center",
                justifyContent: "center",
                alignItems: "center",
                marginTop: 32,
              }}
            >
              <ShowHideToggle setParentValue={setHidden} defaultValue={ih} />
            </div>
          ) : null}
        </Paper>
      </div>
    );
    setBSO(true);
  };

  const handleClose = () => {
    setBSO(false);
    setTimeout(() => {
      setBottomSheetContent(null);
      props.onClose();
    }, 250);
  };

  useEffect(() => {
    setOnBsClosed(handleClose);
    if (props.spaceId === null || props.spaceId === undefined) {
      if (props.editingRoomId !== undefined) {
        let requestOptions = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            roomId: props.editingRoomId,
          }),
          redirect: "follow",
        };
        fetch(serverRoot + "/room/get_room", requestOptions)
          .then((res) => res.json())
          .then((result) => {
            if (result.room !== undefined && result.room !== null) {
              setInitTitle(result.room.title);
              instantTitle = result.room.title;
              setValue(result.room.accessType);
              instantAccessType = result.room.accessType;
              setHidden(result.room.hidden === true);
              instantHidden = (result.room.hidden === true);
              setIsMine(false);
              instantIsMine = false;
              setTimeout(() => showSheet(instantTitle, instantAccessType, instantHidden, instantIsMine));
            }
          });
      } else {
        instantTitle = '';
        instantAccessType = 'public';
        instantHidden = false;
        setIsMine(false);
        instantIsMine = false;
        setTimeout(() => showSheet(instantTitle, instantAccessType, instantHidden, instantIsMine));
      }
    } else {
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
      let prom1 = fetch(serverRoot + "/room/is_space_mine", requestOptions);
      prom1
        .then((response) => response.json())
        .then((result) => {
          console.log(JSON.stringify(result));
          setIsMine(result.isMine);
          instantIsMine = result.isMine;
          if (props.editingRoomId === undefined) {
            instantTitle = '';
            instantAccessType = 'public';
            instantHidden = false;
            setTimeout(() => showSheet(instantTitle, instantAccessType, instantHidden, instantIsMine));
          }
        });
      if (props.editingRoomId !== undefined) {
        let requestOptions2 = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            roomId: props.editingRoomId,
          }),
          redirect: "follow",
        };
        let prom2 = fetch(serverRoot + "/room/get_room", requestOptions2);
        prom2
          .then((res) => res.json())
          .then((result) => {
            console.log(JSON.stringify(result));
            if (result.room !== undefined && result.room !== null) {
              setInitTitle(result.room.title);
              instantTitle = result.room.title;
              setValue(result.room.accessType);
              instantAccessType = result.room.accessType;
              setHidden(result.room.hidden === true);
              instantHidden = (result.room.hidden === true);
            }
          });
        Promise.all([prom1, prom2]).then(() => setTimeout(() => showSheet(instantTitle, instantAccessType, instantHidden, instantIsMine)));
      }
    }
  }, []);
  return null;
}
