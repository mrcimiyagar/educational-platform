import React, { useEffect } from "react";
import { colors, token } from "../../util/settings";
import { serverRoot } from "../../util/Utils";
import "./index.css";
import Waveform from "react-audio-waveform";
import { Fab } from "@material-ui/core";
import { PlayArrow } from "@material-ui/icons";
import { Pause } from "@mui/icons-material";

export function WaveSurferBox(props) {
  const [pos, setPos] = React.useState(0);
  const [dur, setDur] = React.useState(0);
  const [audioPeaks, setAudioPeaks] = React.useState([]);
  const [playing, setPlaying] = React.useState(false);
  useEffect(() => {
    document.getElementById("audioController" + props.fileId).onended = function() {
      document.getElementById("audioController" + props.fileId).currentTime = 0;
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
    let timer = setInterval(() => {
      setPos(
        document.getElementById("audioController" + props.fileId).currentTime
      );
      setPlaying(!(document.getElementById("audioController" + props.fileId).paused));
    }, 250);
    return () => clearInterval(timer);
  }, []);
  return (
    <div style={{ width: "100%", height: 64, display: "flex" }}>
      <audio
        id={"audioController" + props.fileId}
        src={props.src}
        style={{ display: "none" }}
      />
      <Fab style={{ backgroundColor: colors.accent, width: 56, height: 56 }} onClick={() => {
        if (playing) {
          document.getElementById("audioController" + props.fileId).pause();
        }
        else {
          document.getElementById("audioController" + props.fileId).play();
        }
      }}>
        {playing ? <Pause/> : <PlayArrow/>}
      </Fab>
      <div style={{ width: "calc(100% - 72px)" }}>
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
    </div>
  );
}
