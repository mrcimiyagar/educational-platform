import { withStyles } from "@material-ui/core";
import Fab from "@material-ui/core/Fab";

let LoginButton = withStyles(theme => ({
    root: {
        color: '#ffffff',
        background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
        '&:hover': {
            background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)'
        },
    },
}))(Fab);

export default LoginButton;
