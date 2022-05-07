import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { colors, token } from '../../util/settings';
import { serverRoot } from '../../util/Utils';

export default function AudioItem(props) {
  const [albumArtLink, setAlbumArtLink] = React.useState('');
  React.useEffect(() => {
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

  }, []);
  return (
    <List style={{ width: '100%', backgroundColor: colors.backSide, backdropFilter: 'blur(10px)' }}>
      <ListItem alignItems="flex-start">
        <ListItemAvatar>
          <Avatar alt="Remy Sharp" src={albumArtLink} />
        </ListItemAvatar>
        <ListItemText
          primary="102. Egmont, Op. 84 Overture"
          style={{textAlign: 'right', width: '100%', color: colors.text}}
          secondary={
              <Typography
                component="span"
                variant="body2"
                color="text.primary"
                style={{display: 'inline', width: '100%', textAlign: 'right', color: colors.text }}
              >
                Ludwig van Bethoven
              </Typography>
          }
        />
      </ListItem>
    </List>
  );
}
