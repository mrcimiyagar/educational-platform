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
import SearchEngineFam from '../../components/SearchEngineFam'

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles((theme) => ({
    root: {
        padding: '2px 4px',
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        position: 'fixed',
        bottom: 0,
        zIndex: 1000,
        backgroundColor: '#ddd'
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
        <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
            <div style={{width: "100%", height: "100%", position: "absolute", top: 0, left: 0, backgroundColor: '#eee'}}>
                <SearchEngineSearchbar openMenu={() => setMenuOpen(true)}/>
                <div style={{width: '100%', position: 'absolute', top: 'calc(35% + 56px)', textAlign: 'center', justifyContent: 'center'}}>
                    <ThemeProvider theme={theme}>
                        <Fab color={'primary'} variant={'extended'}>
                            <CloudIcon/>
                            <div style={{marginRight: 16}}>
                                جستجو در ابر
                            </div>
                        </Fab>
                        <Fab color={'secondary'} variant={'extended'} style={{marginRight: 16}}>
                            <AccountBalanceIcon/>
                            <div style={{marginRight: 16}}>
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
                <div style={{position: 'relative', width: window.innerWidth + 'px', height: window.innerWidth + 'px', borderRadius: window.innerWidth / 2 + 'px', transform: 'translateY(-50%)', backgroundColor: '#2196f3'}}>
                    <Typography variant={'h4'} style={{position: 'absolute', bottom: 112, left: '50%', transform: 'translateX(-50%)', color: '#fff'}}>
                        ابر آسمان
                    </Typography>
                </div>
                <div style={{width: 112, height: 112, padding: 8, backgroundColor: '#eee', borderRadius: 56, position: 'absolute', top: 'calc(50% - 280px)', left: '50%', transform: 'translateX(-50%)'}}>
                    <Avatar src={SearchEngineIcon} style={{width: '100%', height: '100%'}}/>
                </div>
            </div>
            <SearchEngineFam open={open} setOpen={setOpen}/>
            <SearchEngineDrawer setOpen={setMenuOpen} open={menuOpen}/>
        </Dialog>
    );
}
