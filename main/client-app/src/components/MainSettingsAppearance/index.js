import {
  AppBar,
  Dialog,
  FormControlLabel,
  IconButton,
  Slide,
  styled,
  Switch,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { ArrowForward, Search } from "@material-ui/icons";
import React from "react";
import { isDesktop, registerDialogOpen } from "../../App";
import {
  colors,
  DARK_THEME,
  DARK_THEME_SOLID,
  LIGHT_THEME,
  LIGHT_THEME_SOLID,
  setColors,
  setThemeBlur,
  setThemeMode,
  themeBlur,
  themeMode,
} from "../../util/settings";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="right" ref={ref} {...props} />;
});

const ThemeSwitch = styled(Switch)(({ theme }) => ({
  width: 62,
  height: 34,
  padding: 7,
  "& .MuiSwitch-switchBase": {
    margin: 1,
    padding: 0,
    transform: "translateX(6px)",
    "&.Mui-checked": {
      color: "#fff",
      transform: "translateX(22px)",
      "& .MuiSwitch-thumb:before": {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
          "#fff"
        )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
      },
      "& + .MuiSwitch-track": {
        opacity: 1,
        backgroundColor: theme.palette.mode === "dark" ? "#8796A5" : "#aab4be",
      },
    },
  },
  "& .MuiSwitch-thumb": {
    backgroundColor: theme.palette.mode === "dark" ? "#003892" : "#001e3c",
    width: 32,
    height: 32,
    "&:before": {
      content: "''",
      position: "absolute",
      width: "100%",
      height: "100%",
      left: 0,
      top: 0,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
        "#fff"
      )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
    },
  },
  "& .MuiSwitch-track": {
    opacity: 1,
    backgroundColor: theme.palette.mode === "dark" ? "#8796A5" : "#aab4be",
    borderRadius: 20 / 2,
  },
}));

export default function MainSettingsAppearance(props) {
  const [open, setOpen] = React.useState(true);
  registerDialogOpen(setOpen);
  const handleClose = () => {
    setOpen(false);
    setTimeout(props.onClose, 250);
  };
  const [dark, setDark] = React.useState(themeMode === "dark");
  const [blur, setBlur] = React.useState(themeBlur === "true");

  return (
    <Dialog
      onTouchStart={(e) => {
        e.stopPropagation();
      }}
      PaperProps={{
        style: {
          backgroundColor: colors.backSide,
          backdropFilter: colors.blur,
          direction: "rtl",
          overflowX: "hidden",
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
            <ArrowForward style={{ fill: colors.oposText }} />
          </IconButton>
          <Typography
            style={{ color: colors.oposText, textAlign: "right", flex: 1 }}
          >
            ????????
          </Typography>
          <IconButton>
            <Search style={{ fill: colors.oposText }} />
          </IconButton>
        </Toolbar>
      </AppBar>
      <div style={{ width: "100%", height: 80 }} />
      <FormControlLabel
        style={{ color: colors.text }}
        control={
          <ThemeSwitch
            defaultChecked={themeMode === "dark"}
            checked={dark}
            onChange={(event) => {
              setDark(event.target.checked);
              localStorage.setItem(
                "themeMode",
                event.target.checked ? "dark" : "light"
              );
              setThemeMode(event.target.checked ? "dark" : "light");
              setColors(event.target.checked ? DARK_THEME : LIGHT_THEME);
            }}
          />
        }
        label="????"
      />
      <FormControlLabel
        style={{ color: colors.text, marginTop: 16 }}
        control={
          <Switch
            checked={blur}
            onChange={(event) => {
              setBlur(event.target.checked);
              localStorage.setItem(
                "themeBlur",
                event.target.checked ? "true" : "false"
              );
              setThemeBlur(event.target.checked ? "true" : "false");
              setColors(event.target.checked ? (dark ? DARK_THEME : LIGHT_THEME) : (dark ? DARK_THEME_SOLID : LIGHT_THEME_SOLID));
            }}
            inputProps={{ "aria-label": "controlled" }}
          />
        }
        label="???????? ????"
      />
    </Dialog>
  );
}
