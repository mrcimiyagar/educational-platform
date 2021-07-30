import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import { Paper } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%'
  },
  inline: {
    display: 'inline',
  },
}));

export default function SearchResultsUsers() {
  const classes = useStyles();

  return (
    <Paper style={{
      width: 'calc(100% + 32px)',
      marginLeft: -16,
      marginRight: -16
    }}>
      <List className={classes.root}>
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19].map(index => (
            <div>
            <ListItem alignItems="flex-start">
              <ListItemAvatar>
                <Avatar alt="Remy Sharp" src="https://material-ui.com/static/images/avatar/3.jpg" />
              </ListItemAvatar>
              <ListItemText
                primary="Brunch this weekend?"
                secondary={
                  <React.Fragment>
                    <Typography
                      component="span"
                      variant="body2"
                      className={classes.inline}
                      color="textPrimary"
                    >
                    Software Engineer
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
  );
}
