import {
  AppBar,
  Dialog,
  IconButton,
  Slide,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { ArrowForward, Search } from "@material-ui/icons";
import React from "react";
import { isDesktop, popPage, registerDialogOpen } from "../../App";
import { AudioBox } from "../../modules/audiobox";
import { colors } from "../../util/settings";
import { useForceUpdate } from "../../util/Utils";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="right" ref={ref} {...props} />;
});

export default function MainSettingsNetwork(props) {
  const [open, setOpen] = React.useState(true);
  registerDialogOpen(setOpen);
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
          backgroundColor: colors.primaryDark,
          backdropFilter: "blur(10px)",
          direction: 'rtl'
        },
      }}
      fullScreen={!isDesktop()}
      open={open}
      onClose={handleClose}
      TransitionComponent={Transition}
    >
      <AppBar
        style={{
          width: "100%",
          height: 64,
          backgroundColor: colors.primaryMedium,
        }}
      >
        <Toolbar style={{ width: "100%", paddingTop: 4 }}>
          <IconButton onClick={handleClose}>
            <ArrowForward style={{ fill: colors.icon }} />
          </IconButton>
          <Typography
            style={{ color: colors.text, textAlign: "right", flex: 1 }}
          >
            شبکه
          </Typography>
          <IconButton>
            <Search style={{ fill: colors.icon }} />
          </IconButton>
        </Toolbar>
      </AppBar>
      
    </Dialog>
  );
}
