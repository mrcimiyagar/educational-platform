import { Paper } from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import React from "react";
import { gotoPage } from "../../App";
import EmptyIcon from "../../images/empty.png";
import { colors, token } from "../../util/settings";
import { serverRoot } from "../../util/Utils";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  inline: {
    display: "inline",
  },
}));

export default function SearchResultsUsers(props) {
  const classes = useStyles();

  return props.data.length > 0 ? (
    <Paper
      style={{
        width: "calc(100% + 16px)",
        marginLeft: -8,
        marginRight: -8,
        backgroundColor: colors.field,
        borderRadius: 16
      }}
    >
      <List className={classes.root}>
        {props.data.map((user) => (
          <div>
            <ListItem
              key={"search-user-" + user.id}
              alignItems="flex-start"
              button={true}
              style={{ direction: "rtl" }}
              onClick={() => {
                props.onUserSelected(user.id);
              }}
            >
              <ListItemAvatar>
                <Avatar
                  src={
                    serverRoot +
                    `/file/download_user_avatar?token=${token}&userId=${user.id}`
                  }
                />
              </ListItemAvatar>
              <ListItemText
                primary={
                  <React.Fragment>
                    <Typography
                      className={classes.inline}
                      style={{
                        position: "absolute",
                        right: 64,
                        color: colors.text,
                      }}
                    >
                      {user.firstName + " " + user.lastName}
                    </Typography>
                  </React.Fragment>
                }
                secondary={
                  <React.Fragment>
                    <Typography
                      className={classes.inline}
                      style={{
                        position: "absolute",
                        right: 64,
                        top: 36,
                        color: colors.text,
                      }}
                    >
                      مهندس نرم افزار
                    </Typography>
                  </React.Fragment>
                }
              />
            </ListItem>
            <Divider variant="inset" component="li" />
          </div>
        ))}
      </List>
    </Paper>
  ) : (
    <div
      style={{
        width: "calc(100% - 96px)",
        height: "100%",
        marginLeft: 48,
        marginRight: 48,
        marginTop: 80,
        backgroundColor: "rgba(255, 255, 255, 0.25)",
        backdropFilter: colors.blur,
        borderRadius: "50%",
      }}
    >
      <img
        src={EmptyIcon}
        style={{ width: "100%", height: "100%", padding: 64 }}
      />
    </div>
  );
}
