import {
  AppBar,
  Avatar,
  Box,
  Dialog,
  Fab,
  IconButton,
  Paper,
  Slide,
  Toolbar,
  Typography,
} from "@material-ui/core";
import React, { useEffect } from "react";
import { isDesktop, registerDialogOpen } from "../../App";
import "./audioPlayer.css";
import { serverRoot, useForceUpdate } from "../../util/Utils";
import FastRewindIcon from "@mui/icons-material/FastRewind";
import FastForwardIcon from "@mui/icons-material/FastForward";
import {
  ArrowForward,
  FastForward,
  FastRewind,
  Pause,
  PlayArrow,
  Repeat,
  Shuffle,
} from "@material-ui/icons";
import { colors, token } from "../../util/settings";
import Waveform from "react-audio-waveform";
import AudioPlayerTabs from "../../components/AudioPlayerTabs";
import AudioItem from "../../components/AudioItem";
import AudioPlayerSubTabs from "../../components/AudioPlayerSubTabs";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="right" ref={ref} {...props} />;
});

let timer = undefined;

export default function AudioPlayer(props) {
  let forceUpdate = useForceUpdate();
  const [open, setOpen] = React.useState(true);
  const [albumArtLink, setAlbumArtLink] = React.useState(undefined);
  registerDialogOpen(setOpen);
  const handleClose = () => {
    setOpen(false);
    setTimeout(props.onClose, 250);
  };
  const [playing, setPlaying] = React.useState(false);
  const [pos, setPos] = React.useState(0);
  const [dur, setDur] = React.useState(0);
  const [audioPeaks, setAudioPeaks] = React.useState([]);

  useEffect(() => {
    setTimeout(() => {
      const src =
        serverRoot +
        "/file/download_file_thumbnail?fileId=" +
        props.fileId +
        "&roomId=" +
        props.roomId +
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
          setAlbumArtLink(URL.createObjectURL(blob));
        });

      document.getElementById("audioController" + props.fileId).onended =
        function () {
          document.getElementById(
            "audioController" + props.fileId
          ).currentTime = 0;
        };
      let requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: token,
        },
        body: JSON.stringify({
          fileId: props.fileId,
          roomId: props.roomId,
        }),
        redirect: "follow",
      };
      fetch(serverRoot + "/file/download_audio_preview", requestOptions)
        .then((response) => response.json())
        .then((result) => {
          console.log(JSON.stringify(result));
          if (result !== undefined) {
            for (let i = 0; i < result.data.length; i++) {
              result.data[i] = result.data[i] / 100;
            }
            setAudioPeaks(result.data);
            setDur(
              document.getElementById("audioController" + props.fileId).duration
            );
          }
        });
      timer = setInterval(() => {
        setPos(
          document.getElementById("audioController" + props.fileId).currentTime
        );
        setPlaying(
          !document.getElementById("audioController" + props.fileId).paused
        );
      }, 250);
    }, 1000);
    return () => {
      if (timer !== undefined) {
        clearInterval(timer);
        timer = undefined;
      }
    };
  }, []);

  return (
    <Dialog
      onTouchStart={(e) => {
        e.stopPropagation();
      }}
      PaperProps={{
        style: {
          direction: "rtl",
          backgroundColor: "transparent",
          boxShadow: "none",
          backdropFilter: colors.blur,
        },
      }}
      fullScreen={!isDesktop()}
      open={open}
      onClose={handleClose}
      TransitionComponent={Transition}
    >
      <audio
        id={"audioController" + props.fileId}
        src={
          serverRoot +
          `/file/download_file?token=${token}&roomId=${props.roomId}&fileId=${props.fileId}`
        }
        style={{ display: "none" }}
      />
      <AppBar
        style={{
          backgroundColor: colors.primaryMedium,
          width: "100%",
          height: 64,
          position: "fixed",
        }}
      >
        <Toolbar style={{ width: "100%", marginTop: 4 }}>
          <IconButton onClick={handleClose}>
            <ArrowForward style={{ fill: colors.oposText }} />
          </IconButton>
          <Typography
            stlye={{
              color: colors.oposText,
              textAlign: "right",
              alignItems: "right",
              justifyContent: "right",
            }}
          >
            مدیا پلیر
          </Typography>
        </Toolbar>
      </AppBar>
      <div
        style={{
          marginTop: 64,
          backgroundColor: colors.backSide,
          width: "100%",
          height: "calc(100% - 64px)",
          position: "relative",
        }}
      >
        <img
          style={{
            width: "100%",
            height: 320,
            position: "fixed",
            top: 64,
          }}
          src={albumArtLink}
        />
        <div
          style={{
            width: "100%",
            height: 320,
            position: "fixed",
            top: 64,
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.75) 0%, rgba(255,255,255,0) 50%, rgba(0,0,0,0.65) 100%)",
          }}
        />
        <div
          style={{
            width: "calc(100% - 64px)",
            marginLeft: 32,
            marginRight: 32,
            position: 'absolute',
            top: 32 + 176
          }}
        >
          <Waveform
            barWidth={4}
            peaks={audioPeaks}
            height={56}
            pos={pos}
            duration={dur}
            onClick={(sec) => {
              setPos(sec);
              document.getElementById(
                "audioController" + props.fileId
              ).currentTime = sec;
            }}
            color="#fff"
            progressGradientColors={[
              [0, "#ccc"],
              [1, "#ccc"],
            ]}
          />
        </div>
        <div style={{ height: 320 }} />
        <AudioPlayerSubTabs />
        <Paper
          style={{
            width: "100%",
            height: "calc(100% - 64px - 72px - 150px - 80px)",
            overflowY: "auto",
            backgroundColor: colors.primaryLight,
            borderRadius: '24px 24px 0px 0px',
            transform: 'translateY(-48px)'
          }}
        >
          {[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0].map((a) => (
            <AudioItem
              fileId={props.fileId}
              roomId={props.roomId}
              moduleWorkerId={props.moduleWorkerId}
            />
          ))}
          <Box style={{width: '100%', height: 96}} />
        </Paper>
        <div
          style={{
            width: "100%",
          }}
        >
          <Paper
            style={{
              textAlign: "center",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              height: 80,
              position: "fixed",
              display: "flex",
              bottom: 0,
              backgroundColor: colors.primaryMedium,
              backdropFilter: colors.blur,
              borderRadius: '24px 24px 0px 0px'
            }}
          >
            <Fab
              style={{
                backgroundColor: colors.accent,
                marginTop: 8,
                marginLeft: 8,
                marginRight: 8,
              }}
              size={"small"}
            >
              <Repeat />
            </Fab>
            <Fab
              style={{
                backgroundColor: colors.accent,
                marginTop: 8,
                marginLeft: 8,
                marginRight: 8,
              }}
              size={"small"}
            >
              <FastForward />
            </Fab>
            <Fab
              style={{
                backgroundColor: colors.accent,
                marginLeft: 12,
                marginRight: 8,
              }}
              onClick={() => {
                if (playing) {
                  document
                    .getElementById("audioController" + props.fileId)
                    .pause();
                } else {
                  document
                    .getElementById("audioController" + props.fileId)
                    .play();
                }
              }}
            >
              {playing ? <Pause /> : <PlayArrow />}
            </Fab>
            <Fab
              style={{
                backgroundColor: colors.accent,
                marginTop: 8,
                marginLeft: 8,
                marginRight: 8,
              }}
              size={"small"}
            >
              <FastRewind />
            </Fab>
            <Fab
              style={{
                backgroundColor: colors.accent,
                marginTop: 8,
                marginLeft: 8,
                marginRight: 8,
              }}
              size={"small"}
            >
              <Shuffle />
            </Fab>
          </Paper>
        </div>
      </div>
    </Dialog>
  );
}
