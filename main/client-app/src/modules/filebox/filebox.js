import { AppBar, Dialog, Fab, IconButton, makeStyles, Slide, Tab, Tabs, Toolbar, Typography } from "@material-ui/core";
import { Add, ArrowForward, Audiotrack, Close, InsertDriveFile, Photo, PlayCircleFilled, Search } from "@material-ui/icons";
import "chartjs-plugin-datalabels";
import React, { useEffect } from "react";
import SwipeableViews from "react-swipeable-views";
import { useFilePicker } from "use-file-picker";
import FilesGrid from "../../components/FilesGrid/FilesGrid";
import { colors, token } from "../../util/settings";
import { serverRoot, useForceUpdate } from "../../util/Utils";

export let toggleFileBox = undefined;

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="right" ref={ref} {...props} />;
});
let pickingFile = false;

export let FileBox = (props) => {
  const [open, setOpen] = React.useState(true);
  const forceUpdate = useForceUpdate();
  const [fileMode, setFileMode] = React.useState(0);
  const [files, setFiles] = React.useState([]);
  const [openFileSelector, { filesContent, loading, errors }] = useFilePicker({
    readAs: "DataURL",
  });
  const useStyles = makeStyles({
    root: {
      width: "100%",
      position: "fixed",
      bottom: 0,
      backgroundColor: colors.primaryMedium,
    },
    indicator: {
      backgroundColor: "#fff",
    },
    tab: {
      color: "#fff"
    },
  });
  const classes = useStyles();
  let loadFiles = () => {
    let requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
      body: JSON.stringify({
        moduleWorkerId: props.moduleWorkerId,
        roomId: props.roomId,
        fileMode:
          fileMode === 0
            ? "photo"
            : fileMode === 1
            ? "audio"
            : fileMode === "video"
            ? 2
            : 3,
      }),
      redirect: "follow",
    };
    fetch(serverRoot + "/file/get_files", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(JSON.stringify(result));
        result.files.forEach((fi) => {
          fi.progress = 100;
        });
        setFiles(result.files);
        forceUpdate();
      })
      .catch((error) => console.log("error", error));
  };
  const handleChange = (event, newValue) => {
    setFileMode(newValue);
  };
  const handleChangeIndex = (index) => {
    setFileMode(index);
  };
  useEffect(() => {
    if (!loading && pickingFile) {
      pickingFile = false;
      let dataUrl = filesContent[0].content;
      if (dataUrl === undefined) return;
      fetch(dataUrl)
        .then((d) => d.blob())
        .then((file) => {
          let data = new FormData();
          data.append("file", file);
          let request = new XMLHttpRequest();

          let ext = filesContent[0].name.includes(".")
            ? filesContent[0].name.substr(filesContent[0].name.indexOf(".") + 1)
            : "";
          let fileType =
            ext === "png" ||
            ext === "jpg" ||
            ext === "jpeg" ||
            ext === "gif" ||
            ext === "webp" ||
            ext === "svg"
              ? "photo"
              : ext === "wav" ||
                ext === "mpeg" ||
                ext === "aac" ||
                ext === "mp3"
              ? "audio"
              : ext === "webm" ||
                ext === "mkv" ||
                ext === "flv" ||
                ext === "mp4" ||
                ext === "3gp"
              ? "video"
              : "document";

          let f = {
            progress: 0,
            name: file.name,
            size: file.size,
            local: true,
            src: dataUrl,
            fileType: fileType,
          };

          request.onreadystatechange = function () {
            if (request.readyState == XMLHttpRequest.DONE) {
              loadFiles();
            }
          };

          request.open(
            "POST",
            serverRoot +
              `/file/upload_file?token=${token}&roomId=${props.roomId}&moduleWorkerId=${props.moduleWorkerId}&extension=${ext}`
          );

          files.push(f);
          setFiles(files);
          forceUpdate();
          request.upload.addEventListener("progress", function (e) {
            let percent_completed = (e.loaded * 100) / e.total;
            f.progress = percent_completed;
            if (percent_completed === 100) {
              f.local = false;
            }
            forceUpdate();
          });
          if (FileReader && files && files.length) {
            let fr = new FileReader();
            fr.readAsDataURL(file);
          }
          request.send(data);
        });
    }
  }, [loading]);
  useEffect(() => {
    loadFiles();
  }, props.moduleWorkerId);
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
          width: "100%",
          height: "100%",
          direction: 'rtl'
        }}
      >
        <AppBar
          style={{
            width: "100%",
            height: 72 + 72,
            backgroundColor: colors.primaryMedium,
            backdropFilter: colors.blur,
          }}
        >
          <Toolbar
            style={{
              width: "100%",
              justifyContent: "center",
              textAlign: "center",
              marginTop: 8,
            }}
          >
            <IconButton
              style={{
                width: 32,
                height: 32,
                position: "absolute",
                left: 16,
              }}
            >
              <Search style={{ fill: colors.oposText }} />
            </IconButton>
            <Typography
              variant={"h6"}
              style={{
                position: "absolute",
                right: 16 + 32 + 16,
                color: colors.oposText,
              }}
            >
              ???????? ????
            </Typography>
            <IconButton
              style={{
                width: 32,
                height: 32,
                position: "absolute",
                right: 16,
              }}
              onClick={() => {
                setOpen(false);
                setTimeout(() => {
                  props.onClose();
                }, 250);
              }}
            >
              <ArrowForward style={{ fill: colors.oposText }} />
            </IconButton>
          </Toolbar>
          <Tabs
            variant="fullWidth"
            value={fileMode}
            onChange={handleChange}
            classes={{
              indicator: classes.indicator,
            }}
            style={{ marginTop: 8, color: colors.oposText }}
          >
            <Tab icon={<Photo style={{ fill: colors.oposText }} />} label="?????? ????" />
            <Tab
              icon={<Audiotrack style={{ fill: colors.oposText }} />}
              label="?????? ????"
            />
            <Tab
              icon={<PlayCircleFilled style={{ fill: colors.oposText }} />}
              label="?????????? ????"
            />
            <Tab
              icon={<InsertDriveFile style={{ fill: colors.oposText }} />}
              label="?????? ????"
            />
          </Tabs>
        </AppBar>
        <div
          style={{
            height: "100%"
          }}
        >
          <div style={{position: 'fixed', top: 72 + 72, backgroundColor: colors.backSide, height: 'calc(100% - 144px)', width: '100%'}} />
          <SwipeableViews
            axis={"x-reverse"}
            index={fileMode}
            onChangeIndex={handleChangeIndex}
            style={{ height: "100%" }}
          >
            <div style={{ height: "100%" }}>
              <div style={{height: 72 + 72}} />
              <FilesGrid
                fileType={"photo"}
                files={files.filter((f) => f.fileType === "photo")}
                setFiles={setFiles}
                moduleWorkerId={props.moduleWorkerId}
                roomId={props.roomId}
                style={{ height: "100%" }}
              />
            </div>
            <div style={{ height: "100%" }}>
              <div style={{height: 72 + 72}} />
              <FilesGrid
                fileType={"audio"}
                files={files.filter((f) => f.fileType === "audio")}
                setFiles={setFiles}
                moduleWorkerId={props.moduleWorkerId}
                roomId={props.roomId}
              />
            </div>
            <div style={{ height: "100%" }}>
              <div style={{height: 72 + 72}} />
              <FilesGrid
                fileType={"video"}
                files={files.filter((f) => f.fileType === "video")}
                setFiles={setFiles}
                moduleWorkerId={props.moduleWorkerId}
                roomId={props.roomId}
              />
            </div>
            <div style={{ height: "100%" }}>
              <div style={{height: 72 + 72}} />
              <FilesGrid
                fileType={"document"}
                files={files.filter((f) => f.fileType === "document")}
                setFiles={setFiles}
                moduleWorkerId={props.moduleWorkerId}
                roomId={props.roomId}
              />
            </div>
          </SwipeableViews>
          <Fab
            style={{ position: "fixed", bottom: 24, left: 24, backgroundColor: colors.accent }}
            onClick={() => {
              pickingFile = true;
              openFileSelector();
            }}
          >
            <Add />
          </Fab>
        </div>
      </div>
    </Dialog>
  );
};
