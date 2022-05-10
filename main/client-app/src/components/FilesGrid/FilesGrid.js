import {
  Card,
  IconButton,
  ImageList,
  ImageListItem,
  makeStyles,
} from "@material-ui/core";
import { PlayArrowTwoTone } from "@material-ui/icons";
import React, { useEffect } from "react";
import Viewer from "react-viewer";
import { gotoPage, isDesktop } from "../../App";
import { openAudioPlayer, openVideoPlayer } from "../../routes/pages/space";
import { colors, me, token } from "../../util/settings";
import {
  registerEvent,
  serverRoot,
  socket,
  unregisterEvent,
  useForceUpdate,
} from "../../util/Utils";
import Progressbar from "../Progress/Progressbar";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
    overflow: "hidden",
    height: "calc(100vh - 112px - 88px)",
    paddingTop: 24,
    marginTop: 16,
    width: "100%"
  },
  imageList: {
    paddingTop: 16,
    width: "100%",
    height: "auto",
  },
  icon: {
    color: "rgba(255, 255, 255, 0.54)",
  },
}));

export default function FilesGrid(props) {
  let forceUpdate = useForceUpdate();

  let classes = useStyles();

  unregisterEvent("file-added");
  registerEvent("file-added", (f) => {
    console.log(f);
    if (f.uploaderId !== me.id) {
      f.progress = 100;
      props.files.push(f);
      props.setFiles(props.files);
      forceUpdate();
    }
  });
  unregisterEvent("present-added");
  registerEvent("present-added", ({ f, p }) => {
    console.log(f);
    console.log(p);
    if (f.uploaderId !== me.id) {
      f.progress = 100;
      props.files.push(f);
      props.setFiles(props.files);
      props.presents.push(p);
      props.setPresents(props.presents);
      forceUpdate();
    }
  });

  let [photoViewerVisible, setPhotoViewerVisible] = React.useState(false);
  let [currentPhotoSrc, setCurrentPhotoSrc] = React.useState("");
  let [covers, setCovers] = React.useState(props.files.map((file) => ""));

  useEffect(() => {
    if (props.fileType === "audio") {
      props.files.forEach((file, index) => {
        const src =
          serverRoot +
          "/file/download_file_thumbnail?fileId=" +
          file.id +
          "&roomId=" + props.roomId +
          "&moduleWorkerId=" +
          props.moduleWorkerId;
        const options = {
          headers: {
            token: token,
          },
        };

        fetch(src, options)
          .then((res) => res.blob())
          .then((blob) => {
            var reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = function () {
              var base64String = reader.result;
              covers[index] = base64String;
              setCovers(covers);
              forceUpdate();
            };
          });
      });
    }
  }, [props.files]);

  let cols = Math.floor(window.innerWidth / 400);
  if (cols === 0) cols = 1;

  return (
    <div
      style={{
        width: "100%",
        position: "relative",
        overflow: "hidden",
        height: "auto",
        minHeight: 'calc(100% - 144px)'
      }}
    >
      <div className={classes.root} style={{ height: "auto" }}>
        <Viewer
          zIndex={props.usedBy === "presents" ? 1 : 99999}
          style={{ position: "fixed", left: 0, top: 0, height: "100%" }}
          visible={photoViewerVisible}
          onClose={() => {
            setPhotoViewerVisible(false);
          }}
          images={[{ src: currentPhotoSrc, alt: "" }]}
        />
        <ImageList
          rowHeight={window.innerWidth / (cols + 1)}
          className={classes.imageList}
          style={{ height: "auto" }}
          cols={cols}
        >
          {props.files.map((file, index) => {
            return (
              <ImageListItem key={file.id} cols={1}>
                <a
                  id={"downloadLink" + file.id}
                  href={
                    serverRoot +
                    `/file/download_file?token=${token}&roomId=${props.roomId}&moduleWorkerId=${props.moduleWorkerId}&fileId=${file.id}`
                  }
                  download
                  style={{ display: "none" }}
                ></a>
                <div
                  style={{
                    backgroundColor: "transparent",
                    width: "calc(100% - 32px)",
                    marginTop: 8,
                    marginLeft: 16,
                    marginRight: 16,
                    height: "100%",
                    direction: "rtl",
                  }}
                >
                  <div style={{ width: "100%", height: "100%" }}>
                    <div
                      style={{
                        display: "flex",
                        position: "relative",
                        width: "100%",
                        height: "100%",
                      }}
                    >
                      {
                        <img
                          onClick={() => {
                            if (props.fileType === "photo") {
                              setCurrentPhotoSrc(
                                file.local
                                  ? file.src
                                  : serverRoot +
                                      `/file/download_file?token=${token}&roomId=${props.roomId}&moduleWorkerId=${props.moduleWorkerId}&fileId=${file.id}`
                              );
                              setPhotoViewerVisible(true);
                            } else if (
                              props.fileType === "document" &&
                              props.usedBy === "presents"
                            ) {
                              props.setCurrentPresent(file.present);
                            } else {
                              document
                                .getElementById("downloadLink" + file.id)
                                .click();
                            }
                          }}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "contain",
                          }}
                          key={index}
                          alt="Thumbnail"
                          src={
                            props.fileType === "photo" ||
                            props.fileType === "video" ||
                            props.fileType === "document"
                              ? file.local
                                ? file.src
                                : serverRoot +
                                  `/file/download_file_thumbnail?token=${token}&roomId=${props.roomId}&moduleWorkerId=${props.moduleWorkerId}&fileId=${file.id}`
                              : covers[index]
                          }
                        />
                      }
                      {props.fileType === "video" ? (
                        <IconButton
                          onClick={() => {
                            openVideoPlayer(props.moduleWorkerId, file.id, props.roomId);
                          }}
                          style={{
                            width: 40,
                            height: 40,
                            position: "absolute",
                            left: "50%",
                            top: "50%",
                            transform: "translate(-50%, -50%)",
                          }}
                        >
                          <PlayArrowTwoTone style={{ width: 40, height: 40 }} />
                        </IconButton>
                      ) : props.fileType === "audio" ? (
                        <IconButton
                          onClick={() => {
                            openAudioPlayer(
                              props.moduleWorkerId,
                              file.id,
                              file.local
                                ? file.src
                                : serverRoot +
                                    `/file/download_file?token=${token}&roomId=${props.roomId}&moduleWorkerId=${props.moduleWorkerId}&fileId=${file.id}`,
                              props.roomId
                            );
                          }}
                          style={{
                            backgroundColor: "#fff",
                            borderRadius: "50%",
                            width: 40,
                            height: 40,
                            position: "absolute",
                            left: "50%",
                            top: "50%",
                            transform: "translate(-50%, -50%)",
                          }}
                        >
                          <PlayArrowTwoTone style={{ width: 40, height: 40 }} />
                        </IconButton>
                      ) : null}
                    </div>
                  </div>
                  <div
                    style={{
                      marginTop: -24,
                      marginLeft: 24,
                      marginRight: 24,
                      display: file.local === true ? "block" : "none",
                    }}
                  >
                    <Progressbar progress={file.progress} />
                  </div>
                </div>
              </ImageListItem>
            );
          })}
          <ImageListItem key={Math.random()} cols={cols} />
        </ImageList>
      </div>
    </div>
  );
}
