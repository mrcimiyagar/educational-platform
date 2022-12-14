import {
  AppBar,
  Avatar,
  Fab,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Toolbar,
  Typography,
} from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import IconButton from "@material-ui/core/IconButton";
import Slide from "@material-ui/core/Slide";
import { Add, ArrowForward, Done, Search } from "@material-ui/icons";
import React, { useEffect } from "react";
import { isDesktop, isMobile, isTablet, popPage } from "../../App";
import ProfileEditField from "../../components/ProfileEditField";
import { colors, token } from "../../util/settings";
import { serverRoot } from "../../util/Utils";
import { updateMyBotsList } from "./workshop";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useFilePicker } from "use-file-picker";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="right" ref={ref} {...props} />;
});

export default function CreateBotPage(props) {
  const [openFileSelector, { filesContent, loading, errors }] = useFilePicker({
    readAs: "DataURL",
  });
  let [cats, setCats] = React.useState([]);
  const [pickingFile, setPickingFile] = React.useState(false);
  let [currentcat, setCurrentCat] = React.useState(
    props.editingBot !== undefined ? props.editingBot.categoryId : undefined
  );

  useEffect(() => {
    let requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
      body: JSON.stringify({
        loadExtra: false,
      }),
      redirect: "follow",
    };
    fetch(serverRoot + "/bot/get_categories", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.categories !== undefined) {
          setCats(result.categories);
        }
      });
  }, []);

  const [open, setOpen] = React.useState(true);
  const handleClose = () => {
    setOpen(false);
    setTimeout(props.onClose, 250);
  };
  const handleChange = (event) => {
    setCurrentCat(event.target.value);
  };

  const createTheBot = (fileId) => {
    if (props.editingBot === undefined) {
      let requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: token,
        },
        body: JSON.stringify({
          avatarId: fileId,
          username:
            document.getElementById("botUsername").value,
          title: document.getElementById("botTitle").value,
          categoryId: currentcat,
        }),
        redirect: "follow",
      };
      fetch(serverRoot + "/bot/create_bot", requestOptions)
        .then((response) => response.json())
        .then((result) => {
          if (result.status === "success") {
            updateMyBotsList();
            handleClose();
          } else {
            alert(result.message);
          }
        });
    } else {
      let requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: token,
        },
        body: JSON.stringify({
          avatarId: fileId,
          botId: props.editingBot.id,
          title: document.getElementById("botTitle").value,
        }),
        redirect: "follow",
      };
      fetch(serverRoot + "/bot/update_bot", requestOptions)
        .then((response) => response.json())
        .then((result) => {
          if (result.status === "success") {
            updateMyBotsList();
            handleClose();
          } else {
            alert(result.message);
          }
        });
    }
  };

  return (
    <Dialog
      onTouchStart={(e) => {
        e.stopPropagation();
      }}
      PaperProps={{
        style: {
          background: "transparent",
          boxShadow: "none",
          width: isDesktop() ? "85%" : "100%",
          height: isDesktop() ? "75%" : "100%",
          overflow: "hidden",
        },
      }}
      fullWidth
      maxWidth="md"
      fullScreen={!isDesktop()}
      open={open}
      onClose={handleClose}
      TransitionComponent={Transition}
      style={{
        backdropFilter: isMobile() || isTablet() ? colors.blur : undefined,
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          ...((isMobile() || isTablet()) && {
            position: "absolute",
            top: 0,
            left: 0,
          }),
        }}
      >
        <AppBar
          position={"fixed"}
          style={{
            width: "100%",
            height: 64,
            background: colors.primaryMedium,
            backdropFilter: colors.blur,
          }}
        >
          <Toolbar
            style={{
              marginTop: isDesktop() || isTablet() ? 0 : 8,
              width: "100%",
              height: "100%",
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            <Typography variant={"h6"} style={{ color: colors.oposText }}>
              ???????? ??????
            </Typography>
            <IconButton
              style={{ width: 32, height: 32, position: "absolute", right: 16 }}
              onClick={() => handleClose()}
            >
              <ArrowForward style={{ fill: colors.oposText }} />
            </IconButton>
          </Toolbar>
        </AppBar>
        <div
          style={{
            borderRadius: isDesktop() ? "0 0 24px 24px" : undefined,
            backdropFilter: colors.blur,
            backgroundColor: colors.backSide,
            width: "100%",
            height: isDesktop() ? "calc(100% - 72px)" : "100%",
          }}
        >
          <div style={{ width: "100%", height: 64 + 16 }} />
          <Avatar
            style={{
              width: 112,
              height: 112,
              position: "absolute",
              left: "50%",
              top: 48 + 56,
              transform: "translateX(-50%)",
            }}
            onClick={() => {
              setPickingFile(true);
              openFileSelector();
            }}
            src={
              props.editingBot !== undefined
                ? serverRoot +
                  `/file/download_bot_avatar?token=${token}&botId=${props.editingBot.id}&update=${new Date().getMilliseconds()}`
                : undefined
            }
          />
          <div style={{ width: "100%", height: 112 + 48 }} />
          <ProfileEditField
            placeholder={"?????????? ??????"}
            id={"botTitle"}
            variant={"outlined"}
            defaultValue={
              props.editingBot !== undefined ? props.editingBot.title : ""
            }
            style={{
              height: 48,
              width: "calc(100% - 48px)",
              marginTop: 24,
              marginLeft: 24,
              marginRight: 24,
            }}
          />
          <ProfileEditField
            placeholder={"?????? ???????????? ??????"}
            id={"botUsername"}
            variant={"outlined"}
            defaultValue={
              props.editingBot !== undefined ? props.editingBot.username : ""
            }
            disabled={props.editingBot !== undefined}
            style={{
              height: 48,
              width: "calc(100% - 48px)",
              marginTop: 24,
              marginLeft: 24,
              marginRight: 24,
            }}
          />
          <FormControl
            fullWidth
            style={{
              marginTop: 24,
              marginLeft: 24,
              marginRight: 24,
              width: "calc(100% - 48px)",
              borderColor: colors.text,
              background: colors.field,
              borderRadius: 24,
              paddingLeft: 16,
              paddingRight: 16,
            }}
            disabled={props.editingBot !== undefined}
          >
            <InputLabel
              id="demo-simple-select-label"
              style={{ color: colors.text, marginLeft: 16 }}
            >
              ????????
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={currentcat}
              label="????????"
              onChange={handleChange}
              style={{ borderColor: colors.text, color: colors.text }}
            >
              {cats.map((cat) => {
                return <MenuItem value={cat.id}>{cat.title}</MenuItem>;
              })}
            </Select>
          </FormControl>
          <Fab
            style={{
              position: "fixed",
              bottom: 16,
              left: 16,
              backgroundColor: colors.accent,
            }}
            onClick={() => {
              if (!loading && pickingFile) {
                setPickingFile(false);
                let dataUrl = filesContent[0];
                fetch(dataUrl.content)
                  .then((res) => res.blob())
                  .then((file) => {
                    let data = new FormData();
                    data.append("file", file);
                    let request = new XMLHttpRequest();
                    request.open(
                      "POST",
                      serverRoot + `/bot/upload_bot_avatar?token=${token}`
                    );
                    let f = {
                      progress: 0,
                      name: file.name,
                      size: file.size,
                      local: true,
                    };
                    request.upload.addEventListener("progress", function (e) {
                      let percent_completed = (e.loaded * 100) / e.total;
                      f.progress = percent_completed;
                      if (percent_completed === 100) {
                        f.local = false;
                      }
                      //forceUpdate();
                    });
                    request.onreadystatechange = function () {
                      if (request.readyState == XMLHttpRequest.DONE) {
                        createTheBot(JSON.parse(request.responseText).file.id);
                      }
                    };
                    if (FileReader) {
                      let fr = new FileReader();

                      fr.onload = function () {
                        f.src = fr.result;
                      };
                      fr.readAsDataURL(file);
                    }
                    request.send(data);
                  });
              } else {
                createTheBot();
              }
            }}
          >
            <Done />
          </Fab>
          {props.editingBot !== undefined ? (
            <Fab
              style={{
                position: "fixed",
                bottom: 16,
                left: 16 + 56 + 16,
                backgroundColor: colors.accent,
              }}
              onClick={() => {
                if (window.confirm("?????? ???????????????? ?????? ?????? ?????? ??")) {
                  let requestOptions = {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      token: token,
                    },
                    body: JSON.stringify({
                      botId: props.editingBot.id,
                    }),
                    redirect: "follow",
                  };
                  fetch(serverRoot + "/bot/delete_bot", requestOptions)
                    .then((response) => response.json())
                    .then((result) => {
                      if (result.status === "success") {
                        updateMyBotsList();
                        handleClose();
                      } else {
                        alert(result.message);
                      }
                    });
                }
              }}
            >
              <DeleteOutlineIcon />
            </Fab>
          ) : null}
        </div>
      </div>
    </Dialog>
  );
}
