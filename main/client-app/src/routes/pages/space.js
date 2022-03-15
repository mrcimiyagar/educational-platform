import { Paper } from "@mui/material";
import React, { useEffect } from "react";
import SpaceSearchbar from "../../components/SpaceSearchbar";
import SpaceWallpaper from "../../images/space-wallpaper.png";
import SpaceBottombar from "../../components/SpaceBottombar";

let oldSt = 0;

export default function Space(props) {
  const [searchBarFixed, setSearchBarFixed] = React.useState(false);
  useEffect(() => {
    const searchScrollView = document.getElementById("searchScrollView");
    searchScrollView.addEventListener(
      "scroll",
      function () {
        var st = searchScrollView.scrollTop;
        if (st > oldSt) {
          setSearchBarFixed(true);
        } else {
          setSearchBarFixed(false);
        }
        oldSt = st;
      },
      false
    );
  }, []);
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "fixed",
        left: 0,
        top: 0,
        overflow: "hidden",
      }}
    >
      <img
        alt={"space wallpaper"}
        style={{
          width: "calc(100% + 32px)",
          height: "calc(100% + 16px)",
          position: "fixed",
          left: -16,
          top: -16,
          right: -16,
          objectFit: "cover",
        }}
        src={SpaceWallpaper}
      />

      <div
        id="searchScrollView"
        style={{
          width: "100%",
          height: "100%",
          position: "fixed",
          left: 0,
          top: 0,
          overflow: "auto",
        }}
      >
        <div style={{ width: "100%", height: 72 + 16 }} />
        {[
          0, 1, 2, 3, 4, 5, 6, 7, 0, 1, 2, 3, 4, 5, 6, 7
        ].map((i) => (
          <div style={{display: 'flex'}}>
          <Paper
            style={{
              width: 'calc(50% - 32px)',
              height: 150,
              marginLeft: 16,
              marginRight: 16,
              marginTop: 32,
              backdropFilter: "blur(10px)",
              background: "rgba(200, 200, 0, 0.5)",
              borderRadius: 24,
            }}
          ></Paper>
          <Paper
            style={{
                width: 'calc(50% - 32px)',
              height: 150,
              marginLeft: 16,
              marginRight: 16,
              marginTop: 32,
              backdropFilter: "blur(10px)",
              background: "rgba(200, 200, 0, 0.5)",
              borderRadius: 24,
            }}
          ></Paper>
          </div>
        ))}
        <div style={{ width: "100%", height: 72 + 16 }} />
      </div>

      <Paper
        style={{
          background: "rgba(255, 255, 255, 0.5)",
          borderRadius: 0,
          width: "100%",
          height: searchBarFixed ? 64 : 96,
          backdropFilter: "blur(10px)",
          position: "fixed",
          top: -16,
          transition: "height .25s",
        }}
      >
        <div style={{ width: "100%", height: 28 }} />
        <SpaceSearchbar fixed={searchBarFixed} />
      </Paper>

      <SpaceBottombar fixed={searchBarFixed} />
    </div>
  );
}
