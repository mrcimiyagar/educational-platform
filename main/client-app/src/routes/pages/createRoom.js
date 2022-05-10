import { Button, Fab, Paper } from "@material-ui/core";
import React, { useEffect } from "react";
import {
  removeTab,
  setBottomSheetContent,
  setBSO,
  setOnBsClosed,
  tabs,
} from "../../App";
import { colors, token } from "../../util/settings";
import { serverRoot } from "../../util/Utils";
import { reloadRoomsList } from "../../components/RoomTreeBox";
import ProfileEditField from "../../components/ProfileEditField";
import { Done } from "@material-ui/icons";
import PrivatePublicToggle from "../../components/PrivatePublicToggle";
import ShowHideToggle from "../../components/ShowHideToggle";
import { homeRoomId } from "../../util/settings";

let instantIsMine = false,
  instantTitle = "",
  instantAccessType = "public",
  instantHidden = false;

export default function CreateRoom(props) {
  const [initTitle, setInitTitle] = React.useState("");
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
                roomId: props.editingRoomId,
                spaceId: props.spaceId,
                accessType: instantAccessType,
                hidden: instantHidden,
              }),
              redirect: "follow",
            };
            fetch(
              serverRoot +
                (props.editingRoomId === undefined
                  ? "/room/create_room"
                  : "/room/update_room"),
              requestOptions
            )
              .then((response) => response.json())
              .then((result) => {
                console.log(JSON.stringify(result));
                if (
                  result.room !== undefined ||
                  props.editingRoomId !== undefined
                ) {
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
            background: colors.backSide,
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
            <PrivatePublicToggle
              setParentValue={(v) => {
                instantAccessType = v;
              }}
              defaultValue={iat}
            />
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
              <ShowHideToggle
                setParentValue={(v) => {
                  instantHidden = v;
                }}
                defaultValue={ih}
              />
            </div>
          ) : null}
          {iim && props.editingRoomId !== undefined ? (
            <div
              style={{
                width: "100%",
                textAlign: "center",
                justifyContent: "center",
                alignItems: "center",
                marginTop: 32,
              }}
            >
              <Button
                style={{
                  width: "calc(100% - 64px)",
                  marginLeft: 32,
                  marginRight: 32,
                  height: 56,
                  color: colors.text,
                  borderColor: colors.text,
                }}
                variant={"outlined"}
                onClick={() => {
                  if (window.confirm("اتاق حذف شود ؟")) {
                    let requestOptions = {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                        token: token,
                      },
                      body: JSON.stringify({
                        roomId: props.editingRoomId,
                      }),
                      redirect: "follow",
                    };
                    fetch(serverRoot + "/room/delete_room", requestOptions)
                      .then((res) => res.json())
                      .then((result) => {
                        if (result.status === "success") {
                          if (props.reloadDataCallback !== undefined) {
                            props.reloadDataCallback();
                          } else {
                            reloadRoomsList();
                          }
                          handleClose();
                          setTimeout(() => {
                            let removingTabs = tabs.filter(tab => tab === props.editingRoomId);
                            if (removingTabs.length > 0) {
                              removeTab(props.editingRoomId);
                            }
                          }, 250);
                        }
                      });
                  }
                }}
              >
                حذف اتاق
              </Button>
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
              instantAccessType = result.room.accessType;
              instantHidden = result.room.hidden === true;
              setIsMine(false);
              instantIsMine = false;
              setTimeout(() =>
                showSheet(
                  instantTitle,
                  instantAccessType,
                  instantHidden,
                  instantIsMine
                )
              );
            }
          });
      } else {
        instantTitle = "";
        instantAccessType = "public";
        instantHidden = false;
        setIsMine(false);
        instantIsMine = false;
        setTimeout(() =>
          showSheet(
            instantTitle,
            instantAccessType,
            instantHidden,
            instantIsMine
          )
        );
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
            instantTitle = "";
            instantAccessType = "public";
            instantHidden = false;
            setTimeout(() =>
              showSheet(
                instantTitle,
                instantAccessType,
                instantHidden,
                instantIsMine
              )
            );
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
              instantAccessType = result.room.accessType;
              instantHidden = result.room.hidden === true;
            }
          });
        Promise.all([prom1, prom2]).then(() =>
          setTimeout(() =>
            showSheet(
              instantTitle,
              instantAccessType,
              instantHidden,
              instantIsMine
            )
          )
        );
      }
    }
  }, []);
  return null;
}
