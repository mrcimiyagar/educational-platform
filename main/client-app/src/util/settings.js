import { createTheme } from "@material-ui/core";
import React, { useEffect } from "react";
import {ConnectToIo, FetchMe, roothPath, serverRoot, setConfig, validateToken} from "./Utils";

export const theme = createTheme({
    palette: {
      primary: {
        main: '#9c27b0',
      },
      secondary: {
        main: 'rgba(240, 0, 120, 0.75)',
      },
    },
});

export let colors = {}, setColors = (c) => {};
export let ColorBase = (props) => {
    [colors, setColors] = React.useState({})
    useEffect(() => {
        validateToken(token, (result) => {
			if (result) {
                let requestOptions4 = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'token': token
                    },
                    redirect: 'follow'
                };
                fetch(serverRoot + "/auth/fetch_config", requestOptions4)
                    .then(response => response.json())
                    .then(result => {
                        console.log(JSON.stringify(result));
                        if (result.config !== undefined) {
                            localStorage.setItem('themeColor', result.config.themeColor);
                            setColors(JSON.parse(result.config.themeColor));
                        }
                    });
            }
        });
    }, []);
    return <div/>;
}

export let token = '';
export function setToken(t) {
    token = t;
}

export let phone = '';
export function setPhone(t) {
    phone = t;
}

export let me = {};
export function setMe(m) {
    me = m;
}

export let currentSurvey = {};
export function setCurrentSurvey(m) {
    currentSurvey = m;
}