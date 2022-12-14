import { AppBar, Toolbar, Typography } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import IconButton from "@material-ui/core/IconButton";
import Slide from "@material-ui/core/Slide";
import { ArrowForward, Search } from "@material-ui/icons";
import React from "react";
import { isDesktop, isMobile, isTablet, popPage } from "../../App";
import SpacesGridForInvitation from "../../components/SpacesGridForInvitation";
import { colors } from "../../util/settings";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="right" ref={ref} {...props} />;
});

export default function SpacesList(props) {
  const [open, setOpen] = React.useState(true);
  const handleClose = () => {
    setOpen(false);
    setTimeout(props.onClose, 250);
  };
  return (
    <Dialog
      onTouchStart={(e) => {
        e.stopPropagation();
      }}
      PaperProps={{
        style: {
          backgroundColor: "transparent",
          boxShadow: "none",
          width: "100%",
          overflow: "hidden",
        },
      }}
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
          backdropFilter: isDesktop() ? colors.blur : undefined,
          backdropFilter: isDesktop() ? colors.blur : undefined,
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
            backdropFilter: colors.blur,
            backgroundColor: colors.primaryMedium,
            borderRadius: isDesktop() ? "24px 24px 0 0" : undefined,
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
            <IconButton
              style={{ width: 32, height: 32, position: "absolute", left: 16 }}
            >
              <Search style={{ fill: colors.icon }} />
            </IconButton>
            <Typography variant={"h6"} style={{ color: colors.text }}>
              ?????? ????
            </Typography>
            <IconButton
              style={{ width: 32, height: 32, position: "absolute", right: 16 }}
              onClick={() => handleClose()}
            >
              <ArrowForward style={{ fill: colors.icon }} />
            </IconButton>
          </Toolbar>
        </AppBar>
        <div
          style={{
            backgroundColor: colors.primaryDark,
            width: "100%",
            height: isDesktop() ? "calc(100% - 56px)" : "100%",
            position: "absolute",
            top: 0,
          }}
        >
          <SpacesGridForInvitation
            userId={props.user_id}
            handleClose={handleClose}
          />
        </div>
      </div>
    </Dialog>
  );
}
