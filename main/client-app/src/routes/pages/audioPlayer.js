import { AppBar, Avatar, Dialog, IconButton, Slide, Toolbar, Typography } from "@material-ui/core";
import React, { useEffect } from "react";
import { isDesktop, popPage, registerDialogOpen } from "../../App";
import "./audioPlayer.css";
import { serverRoot, useForceUpdate } from "../../util/Utils";
import FastRewindIcon from "@mui/icons-material/FastRewind";
import FastForwardIcon from "@mui/icons-material/FastForward";
import { ArrowForward, Pause, PlayArrow } from "@material-ui/icons";
import { colors, token } from "../../util/settings";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="right" ref={ref} {...props} />;
});

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

  useEffect(() => {
    const src =
    serverRoot +
    "/file/download_file_thumbnail?fileId=" +
    props.fileId + '&roomId=' + props.roomId + '&moduleWorkerId=' + props.moduleWorkerId;
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
  }, []);

  return (
    <Dialog
      onTouchStart={(e) => {
        e.stopPropagation();
      }}
      PaperProps={{
        style: {
          direction: 'rtl',
          backgroundColor: 'transparent',
          boxShadow: "none",
          backdropFilter: 'blur(10px)'
        },
      }}
      fullScreen={!isDesktop()}
      open={open}
      onClose={handleClose}
      TransitionComponent={Transition}
    >
      <AppBar
        style={{
          backgroundColor: colors.primaryMedium,
          width: "100%",
          height: 64,
          position: 'fixed'
        }}
      >
        <Toolbar style={{ width: "100%", marginTop: 4 }}>
          <IconButton onClick={handleClose}>
            <ArrowForward style={{ fill: colors.oposText }} />
          </IconButton>
          <Typography stlye={{color: colors.oposText, textAlign: 'right', alignItems: 'right', justifyContent: 'right'}}>
            مدیا پلیر
          </Typography>
        </Toolbar>
      </AppBar>
      <div style={{marginTop: 64, backgroundColor: colors.backSide, width: '100%', height: 'calc(100% - 64px)', position: 'relative'}}>
        <Avatar style={{width: 200, height: 200}} src={albumArtLink}/>
      </div>
    </Dialog>
  );

  return (
    <Dialog
      onTouchStart={(e) => {
        e.stopPropagation();
      }}
      PaperProps={{
        style: {
          backgroundColor: "transparent",
          boxShadow: "none",
          borderRadius: 24,
        },
      }}
      fullScreen={!isDesktop()}
      open={open}
      onClose={handleClose}
      TransitionComponent={Transition}
    >
      <article
        className="screen"
        style={{
          backgroundColor: colors.backSide,
          backdropFilter: "blur(10px)",
        }}
      >
        <input
          type="checkbox"
          value="None"
          id="magicButton"
          name="check"
        ></input>
        <label className="main" for="magicButton"></label>

        <div className="coverImage" style={{ opacity: 0.5 }}></div>
        <div className="search"></div>
        <div className="bodyPlayer"></div>

        <table className="list">
          <tr className="song">
            <td className="nr">
              <h5>1</h5>
            </td>
            <td className="title">
              <h6>Heavydirtysoul</h6>
            </td>
            <td className="length">
              <h5>3:54</h5>
            </td>
            <td>
              <input type="checkbox" id="heart"></input>
              <label className="zmr" for="heart"></label>
            </td>
          </tr>

          <tr className="song">
            <td className="nr">
              <h5>2</h5>
            </td>
            <td className="title">
              <h6 style={{ color: "#ff564c" }}>StressedOut</h6>
            </td>
            <td className="length">
              <h5>3:22</h5>
            </td>
            <td>
              <input type="checkbox" id="heart1" checked></input>
              <label className="zmr" for="heart1"></label>
            </td>
          </tr>

          <tr className="song">
            <td className="nr">
              <h5>3</h5>
            </td>
            <td className="title">
              <h6>Ride</h6>
            </td>
            <td className="length">
              <h5>3:34</h5>
            </td>
            <td>
              <input type="checkbox" id="heart2"></input>
              <label className="zmr" for="heart2"></label>
            </td>
          </tr>

          <tr className="song">
            <td className="nr">
              <h5>4</h5>
            </td>
            <td className="title">
              <h6>Fairy Local</h6>
            </td>
            <td className="length">
              <h5>3:27</h5>
            </td>
            <td>
              <input type="checkbox" id="heart3" checked></input>
              <label className="zmr" for="heart3"></label>
            </td>
          </tr>

          <tr className="song">
            <td className="nr">
              <h5>5</h5>
            </td>
            <td className="title">
              <h6>Tear in My Heart</h6>
            </td>
            <td className="length">
              <h5>3:08</h5>
            </td>
            <td>
              <input type="checkbox" id="heart4"></input>
              <label className="zmr" for="heart4"></label>
            </td>
          </tr>

          <tr className="song">
            <td className="nr">
              <h5>6</h5>
            </td>
            <td className="title">
              <h6>Lane Boy</h6>
            </td>
            <td className="length">
              <h5>4:13</h5>
            </td>
            <td>
              <input type="checkbox" id="heart5"></input>
              <label className="zmr" for="heart5"></label>
            </td>
          </tr>

          <tr className="song">
            <td className="nr">
              <h5>7</h5>
            </td>
            <td className="title">
              <h6>The Judge</h6>
            </td>
            <td className="length">
              <h5>4:57</h5>
            </td>
            <td>
              <input type="checkbox" id="heart6"></input>
              <label className="zmr" for="heart6"></label>
            </td>
          </tr>

          <tr className="song">
            <td className="nr">
              <h5>8</h5>
            </td>
            <td className="title">
              <h6>Doubt</h6>
            </td>
            <td className="length">
              <h5>3:11</h5>
            </td>
            <td>
              <input type="checkbox" id="heart7"></input>
              <label className="zmr" for="heart7"></label>
            </td>
          </tr>

          <tr className="song">
            <td className="nr">
              <h5>9</h5>
            </td>
            <td className="title">
              <h6>Polarize</h6>
            </td>
            <td className="length">
              <h5>3:46</h5>
            </td>
            <td>
              <input type="checkbox" id="heart8"></input>
              <label className="zmr" for="heart8"></label>
            </td>
          </tr>
        </table>

        <div className="shadow"></div>

        <div className="bar"></div>

        <div className="info">
          <h4>STRESSED OUT</h4>
          <h3>twenty one pilots - Blurryface</h3>
        </div>
        <audio preload="auto" id="audio" controls>
          <source src="http://www.jplayer.org/audio/mp3/Miaow-02-Hidden.mp3" />
          <source src="http://www.jplayer.org/audio/mp3/Miaow-02-Hidden.ogg" />
        </audio>
        <table className="player">
          <td>
            <IconButton>
              <FastRewindIcon style={{ fill: "#fff" }} />
            </IconButton>
          </td>
          <td>
            <IconButton
              onClick={() => {
                var audio = document.getElementById("audio");
                if (audio.paused || audio.ended) {
                  audio.play();
                  setPlaying(true);
                } else {
                  audio.pause();
                  setPlaying(false);
                }
              }}
            >
              {playing ? (
                <Pause style={{ fill: "#fff" }} />
              ) : (
                <PlayArrow style={{ fill: "#fff" }} />
              )}
            </IconButton>
          </td>
          <td>
            <IconButton>
              <FastForwardIcon style={{ fill: "#fff" }} />
            </IconButton>
          </td>
        </table>

        <table className="footer">
          <td>
            <input type="checkbox" id="love" checked></input>
            <label className="love" for="love"></label>
          </td>
          <td>
            <input type="checkbox" id="shuffle"></input>
            <label className="shuffle" for="shuffle"></label>
          </td>
          <td>
            <input type="checkbox" id="repeat" checked></input>
            <label className="repeat" for="repeat"></label>
          </td>
          <td>
            <input type="checkbox" id="options"></input>
            <label className="options" for="options"></label>
          </td>
        </table>

        <div className="current">
          <h2>STRESSED OUT</h2>
        </div>
      </article>
    </Dialog>
  );
}
