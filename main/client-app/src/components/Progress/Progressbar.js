import LinearProgress from '@material-ui/core/LinearProgress';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';

const useStyles = makeStyles({
    root: {
        width: '100%',
    },
});

export default function Progressbar(props) {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <LinearProgress variant="determinate" value={props.progress} />
        </div>
    );
}