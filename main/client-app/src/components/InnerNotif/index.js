
import * as React from 'react';
import Snackbar from '@mui/material/Snackbar';

export let showInnerNotif = () => {};

export default function InnerNotif() {
  const [state, setState] = React.useState({
    open: false,
    vertical: 'top',
    horizontal: 'right',
  });

  const { vertical, horizontal, open, text, color } = state;

  showInnerNotif = (newState) => {
    setState({ open: true, ...newState });
  };

  const handleClose = () => {
    setState({ ...state, open: false });
  };

  return (
    <div>
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={open}
        onClose={handleClose}
        message={text}
        key={vertical + horizontal}
        ContentProps={{
          style: {
            backgroundColor: color
          }
        }}
      />
    </div>
  );
}
