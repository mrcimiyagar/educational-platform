
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

  let timeoutInstance = undefined;

  showInnerNotif = (newState) => {
    setState({ open: true, ...newState });
    timeoutInstance = setTimeout(() => {
      handleClose();
    }, 3000);
  };

  const handleClose = () => {
    if (timeoutInstance !== undefined) {
      clearTimeout(timeoutInstance);
      timeoutInstance = undefined;
    }
    setState({ ...state, open: false });
  };

  return (
    <div style={{position: 'fixed', left: 0, top: 0, zIndex: 99999}}>
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={open}
        onClose={handleClose}
        message={text}
        key={vertical + horizontal}
        ContentProps={{
          style: {
            backgroundColor: color,
            color: '#000',
            width: 200
          }
        }}
      />
    </div>
  );
}
