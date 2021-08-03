import React, {useEffect} from 'react';
import HomeToolbar from '../../components/HomeToolbar';
import BotsBoxSearchbar from '../../components/BotsBoxSearchbar';
import Draggable from 'react-draggable'
import { ResizableBox } from 'react-resizable';
import { useForceUpdate } from '../../util/Utils';
import BotContainer, { handleGuiUpdate } from '../../components/BotContainer';
import { Fab } from '@material-ui/core';
import Edit from '@material-ui/icons/Edit';
import ClockHand1 from '../../images/clock-hand-1.png'
import ClockHand2 from '../../images/clock-hand-2.png'
import {evaluate} from 'mathjs'

var lastScrollTop = 0

let widget1Gui = {
    type: 'Box',
    width: '100%', 
    height: '100%',
    children: [
        {
            type: 'Image', 
            width: '100%', 
            height: '100%', 
            borderRadius: 1000,
            position: 'absolute',
            left: 0,
            top: 0,
            zIndex: 1,
            src: 'https://i.pinimg.com/originals/eb/ad/bc/ebadbc481c675e0f2dea0cc665f72497.jpg'
        },
        {
            type: 'Box', 
            width: '100%', 
            height: '100%',
            borderRadius: 1000,
            position: 'absolute',
            left: 0,
            top: 0,
            zIndex: 2,
            background: 'rgba(255, 255, 255, 0.5)'
        },
        {
            type: 'Box',
            id: 'secondHand',
            width: 250,
            height: 25,
            position: 'absolute',
            left: 0,
            top: 'calc(50% - 12.5px)',
            transform: 'rotate(-90deg)',
            transition: 'transform 1s',
            zIndex: 3,
            children: [
                {
                    type: 'Image',
                    width: 125,
                    height: '100%',
                    position: 'absolute',
                    left: '50%',
                    src: ClockHand1
                }
            ]
        },
        {
            type: 'Box',
            id: 'minuteHand',
            width: 250,
            height: 25,
            position: 'absolute',
            left: '0',
            top: 'calc(50% - 12.5px)',
            transform: 'rotate(-90deg)',
            transition: 'transform 1s',
            zIndex: 3,
            children: [
                {
                    type: 'Image',
                    width: 100,
                    height: '100%',
                    position: 'absolute',
                    left: '50%',
                    src: ClockHand1
                }
            ]
        },
        {
            type: 'Box',
            id: 'hourHand',
            width: 250,
            height: 25,
            position: 'absolute',
            left: 0,
            top: 'calc(50% - 12.5px)',
            transform: 'rotate(-90deg)',
            transition: 'transform 1s',
            zIndex: 3,
            children: [
                {
                    type: 'Image',
                    width: 125,
                    height: '100%',
                    position: 'absolute',
                    left: '50%',
                    src: ClockHand2
                }
            ]
        }
    ]
}

let timeSecMirror = {elId: 'secondHand', property: 'transform', value: 'rotate(calc((@timeSec * 6deg) - 90deg))', variable: {id: 'timeSec', from: 'time.now.seconds'}}
let timeMinMirror = {elId: 'minuteHand', property: 'transform', value: 'rotate(calc((@timeMin * 6deg) - 90deg))', variable: {id: 'timeMin', from: 'time.now.minutes'}}
let timeHourMirror = {elId: 'hourHand', property: 'transform', value: 'rotate(calc((@timeHour * 6deg) - 90deg))', variable: {id: 'timeHour', from: 'time.now.hours'}}

let idDict = {}

export default function BotsBox(props) {
    let forceUpdate = useForceUpdate()
    let [editMode, setEditMode] = React.useState(false)
    let [guis, setGuis] = React.useState([])
    let [mirrors, setMirrors] = React.useState([])
    useEffect(() => {
        
        guis.push(widget1Gui)
        setGuis(guis)
        mirrors.push(timeSecMirror)
        mirrors.push(timeMinMirror)
        mirrors.push(timeHourMirror)
        setMirrors(mirrors)

        forceUpdate()
        
        let element = document.getElementById('botsContainer')
        let botsSearchbar = document.getElementById('botsSearchbar')
        element.addEventListener("scroll", function() {
            var st = element.scrollTop;
            if (st > lastScrollTop){
                botsSearchbar.style.transform = 'translateY(-100px)'
                botsSearchbar.style.transition = 'transform .5s'
            } else {
                botsSearchbar.style.transform = 'translateY(0)'
                botsSearchbar.style.transition = 'transform .5s'
            }
            lastScrollTop = st <= 0 ? 0 : st;
        }, false);
        
        setInterval(() => {
            mirrors.forEach(mirror => {
                let timeNow = mirror.variable.from === 'time.now.seconds' ? new Date().getSeconds() : mirror.variable.from === 'time.now.minutes' ? new Date().getMinutes() : mirror.variable.from === 'time.now.hours' ? (new Date().getHours() % 12) : 0
                let varCont = mirror.value
                varCont = varCont.replace('@' + mirror.variable.id, timeNow)
                idDict['widget-1'][mirror.elId].obj[mirror.property] = varCont
            })
            forceUpdate()
        }, 1000);
    }, [])
    return (
        <div style={{width: "100%", height: '100%', display: props.style.display}}>
            <img style={{width: '100%', height: '100%', position: 'fixed', left: 0, top: 0, zIndex: 1}} src={'https://4kwallpapers.com/images/wallpapers/colorful-background-texture-multi-color-orange-illustration-1080x1920-3104.jpg'}/>
            <HomeToolbar>
                <div id={'botsSearchbar'} style={{width: '75%', position: 'absolute', right: '12.5%', top: 32, zIndex: 3}}>
                    <BotsBoxSearchbar openMenu={props.openMenu}/>
                </div>
            </HomeToolbar>
            <div id={'botsContainer'} style={{width: '100%', height: '100%', overflow: 'auto', zIndex: 2, position: 'absolute', left: 0, top: 0}}>
                <div style={{width: '100%', height: 2000}}>
                    <BotContainer onIdDictPrepared={(idD) => {idDict['widget-1'] = idD;}} editMode={editMode} widgetId={1} widgetWidth={250} widgetHeight={250} widgetX={150} widgetY={150} gui={guis[0]}/>
                    <div id="ghostpane" style={{display: 'none'}}></div>
                </div>
            </div>
            <Fab color={'secondary'} style={{position: 'fixed', bottom: 16 + 72, left: 16, zIndex: 4}} onClick={() => setEditMode(!editMode)}>
                <Edit/>
            </Fab>
        </div>
    );
}
