import React, {useEffect} from 'react';
import Slide from "@material-ui/core/Slide";
import {gotoPage, popPage, selectedIndex, token} from "../../App";
import Dialog from "@material-ui/core/Dialog";
import {createTheme, makeStyles, ThemeProvider} from "@material-ui/core/styles";
import { AppBar, Avatar, Fab, Toolbar, Typography } from '@material-ui/core';
import { ArrowForward, Done, Search } from '@material-ui/icons';
import SearchEngineSearchbar from '../../components/SearchEngineSearchbar';
import SearchEngineDrawer from '../../components/SearchEngineDrawer';
import SearchEngineIcon from '../../images/world.png'
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import CloudIcon from '@material-ui/icons/Cloud';
import { pink } from '@material-ui/core/colors';
import LanguageIcon from '@material-ui/icons/Language';
import Jumper from '../../components/SearchEngineFam';
import Logo from '../../images/logo.png'
import { setToken } from '../../util/settings';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles((theme) => ({
    root: {
        direction: 'rtl',
        padding: '2px 4px',
        top: 0,
        alignItems: 'center',
        width: '100%',
        position: 'fixed',
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    input: {
        marginLeft: theme.spacing(1),
        flex: 1,
        fontFamily: 'mainFont'
    },
    iconButton: {
        padding: 10,
    },
    divider: {
        height: 28,
        margin: 4,
    },
}));

export default function SearchEngine(props) {

    setToken(localStorage.getItem('token'))
    
    const [open, setOpen] = React.useState(true);
    const handleClose = () => {
        setOpen(false);
        popPage()
    };
    let classes = useStyles();
    let [menuOpen, setMenuOpen] = React.useState(false)
    const theme = createTheme({
      palette: {
        primary: {
          main: '#2196f3',
        },
        secondary: pink
      },
    });
    return (
        <div className={classes.root}>
            <div style={{width: "100%", height: "100%", position: "relative"}}>
                <img src={Logo} style={{width: '50%', height: window.innerWidth / 2 + 'px', position: 'absolute', left: '50%', top: 100 - 76, transform: 'translateX(-50%)'}}/>
                <div style={{width: 112, height: 112, padding: 8, borderRadius: 56, position: 'absolute', left: '50%', top: 276 - 76, transform: 'translateX(-50%)'}}>
                    <Avatar src={SearchEngineIcon} style={{width: 112, height: 112}}/>
                </div>
                <div style={{width: '100%', height: 56, position: 'absolute', left: '50%', top: 416 - 76, transform: 'translateX(-50%)'}}>
                    <SearchEngineSearchbar openMenu={() => setMenuOpen(true)}/>
                </div>
                <div style={{width: '100%', position: 'absolute', top: 496 - 76, textAlign: 'center', justifyContent: 'center'}}>
                    <ThemeProvider theme={theme}>
                        <Fab color={'primary'} variant={'extended'} onClick={() => gotoPage('/app/searchengineresults')}>
                            <CloudIcon/>
                            <div style={{marginRight: 16}}>
                                جستجو در ابر
                            </div>
                        </Fab>
                        <Fab color={'secondary'} variant={'extended'} style={{marginRight: 16}} onClick={() => gotoPage('/app/searchengineresults')}>
                            <AccountBalanceIcon/>
                            <div style={{marginLeft: 16}}>
                                جستجو دراتاق
                            </div>
                        </Fab>
                        <br/>
                        <Fab color={'primary'} variant={'extended'} style={{marginTop: 16}}>
                            <LanguageIcon/>
                            <div style={{marginRight: 16}}>
                                گشت و گذار
                            </div>
                        </Fab>
                    </ThemeProvider>
                </div>
            </div>
            <div style={{position: 'fixed', right: 16, bottom: -64}}>
                <Jumper open={open} setOpen={setOpen}/>
            </div>
            <SearchEngineDrawer setOpen={setMenuOpen} open={menuOpen}/>
        </div>
    );
}
