import {
  Avatar,
  createTheme,
  Drawer,
  Fab,
  Slide,
  ThemeProvider,
} from '@material-ui/core'
import { pink } from '@material-ui/core/colors'
import Add from '@material-ui/icons/Add'
import Edit from '@material-ui/icons/Edit'
import React, { useEffect } from 'react'
import { inTheGame, isDesktop, isInRoom, isMobile, isTablet } from '../../App'
import BotContainer from '../../components/BotContainer'
import BotsBoxSearchbar from '../../components/BotsBoxSearchbar'
import HomeToolbar from '../../components/HomeToolbar'
import ClockHand1 from '../../images/clock-hand-1.png'
import ClockHand2 from '../../images/clock-hand-2.png'
import { token } from '../../util/settings'
import { serverRoot, socket, useForceUpdate } from '../../util/Utils'

var lastScrollTop = 0

let widget1Gui = {
  type: 'Box',
  id: 'clockBox',
  width: '100%',
  height: '100%',
  transition: 'transform 1s',
  children: [
    {
      type: 'Image',
      id: 'clockBackImage',
      width: '100%',
      height: '100%',
      borderRadius: 1000,
      position: 'absolute',
      left: 0,
      top: 0,
      zIndex: 1,
      src:
        'https://i.pinimg.com/originals/eb/ad/bc/ebadbc481c675e0f2dea0cc665f72497.jpg',
    },
    {
      type: 'Box',
      id: 'clockBackShadow',
      width: '100%',
      height: '100%',
      borderRadius: 1000,
      position: 'absolute',
      left: 0,
      top: 0,
      zIndex: 2,
      background: 'rgba(255, 255, 255, 0.5)',
    },
    {
      type: 'Text',
      id: 'clockMsg',
      width: '100%',
      height: 'auto',
      position: 'absolute',
      alignChildren: 'center',
      top: 32,
      zIndex: 3,
      text: 'سلام کیهان',
      transform: 'rotateY(-180deg)',
      display: 'none',
    },
    {
      type: 'Image',
      id: 'weather',
      width: '50%',
      position: 'absolute',
      alignChildren: 'center',
      top: 56,
      right: 56,
      zIndex: 3,
      src:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrRZ2vclesoWZ4DOCjXPzbAvg5VEFEn7OiHQ&usqp=CAU',
      transform: 'rotateY(-180deg)',
      display: 'none',
    },
    {
      type: 'Text',
      id: 'weatherMsg',
      width: '100%',
      height: 'auto',
      position: 'absolute',
      alignChildren: 'center',
      top: 112 + 40 + 24,
      zIndex: 3,
      text: 'نیمه ابری 31 درجه',
      transform: 'rotateY(-180deg)',
      display: 'none',
    },
    {
      type: 'Box',
      id: 'secondHand',
      width: 250,
      height: 25,
      position: 'absolute',
      left: 0,
      top: 'calc(50% - 12.5px)',
      transform: 'rotate(75deg)',
      transition: 'transform 1s',
      zIndex: 3,
      children: [
        {
          type: 'Image',
          id: 'secondImage',
          width: 125,
          height: '100%',
          position: 'absolute',
          left: '50%',
          src: ClockHand1,
        },
      ],
    },
    {
      type: 'Box',
      id: 'minuteHand',
      width: 250,
      height: 25,
      position: 'absolute',
      left: '0',
      top: 'calc(50% - 12.5px)',
      transform: 'rotate(-135deg)',
      transition: 'transform 1s',
      zIndex: 3,
      children: [
        {
          type: 'Image',
          id: 'minuteImage',
          width: 100,
          height: '100%',
          position: 'absolute',
          left: '50%',
          src: ClockHand1,
        },
      ],
    },
    {
      type: 'Box',
      id: 'hourHand',
      width: 250,
      height: 25,
      position: 'absolute',
      left: 0,
      top: 'calc(50% - 12.5px)',
      transform: 'rotate(295deg)',
      transition: 'transform 1s',
      zIndex: 3,
      children: [
        {
          type: 'Image',
          id: 'hourImage',
          width: 125,
          height: '100%',
          position: 'absolute',
          left: '50%',
          src: ClockHand2,
        },
      ],
    },
  ],
}
let timeSecMirror = {
  widgetId: 'widget-0',
  elId: 'secondHand',
  property: 'transform',
  value: 'rotate(calc((@timeSec * 6deg) - 90deg))',
  variable: { id: 'timeSec', from: 'time.now.seconds' },
}
let timeMinMirror = {
  widgetId: 'widget-0',
  elId: 'minuteHand',
  property: 'transform',
  value: 'rotate(calc((@timeMin * 6deg) - 90deg))',
  variable: { id: 'timeMin', from: 'time.now.minutes' },
}
let timeHourMirror = {
  widgetId: 'widget-0',
  elId: 'hourHand',
  property: 'transform',
  value: 'rotate(calc((@timeHour * 30deg) - 90deg))',
  variable: { id: 'timeHour', from: 'time.now.hours' },
}

let timeSecShowUpdate = {
  elId: 'secondHand',
  property: 'display',
  newValue: 'block',
}
let timeSecHideUpdate = {
  elId: 'secondHand',
  property: 'display',
  newValue: 'none',
}

let idDict = {}
let memDict = {}

export default function BotsBox(props) {
  let forceUpdate = useForceUpdate()
  let [editMode, setEditMode] = React.useState(false)
  let [widgetPreviews, setWidgetPreviews] = React.useState([{id: 1}])
  let [widgets, setWidgets] = React.useState([])
  let [guis, setGuis] = React.useState({'widget-1': widget1Gui})
  let [mirrors, setMirrors] = React.useState([])
  let [timers, setTimers] = React.useState({})
  let [menuOpen, setMenuOpen] = React.useState(false)
  useEffect(() => {
    let element = document.getElementById('botsContainerOuter')
    let botsSearchbar = document.getElementById('botsSearchbar')
    botsSearchbar.style.transform = 'translateY(-100px)'
    element.addEventListener(
      'scroll',
      function () {
        var st = element.scrollTop
        if (st > lastScrollTop) {
          botsSearchbar.style.transform = 'translateY(-100px)'
          botsSearchbar.style.transition = 'transform .5s'
        } else {
          botsSearchbar.style.transform = 'translateY(0)'
          botsSearchbar.style.transition = 'transform .5s'
        }
        lastScrollTop = st <= 0 ? 0 : st
      },
      false,
    )
    let requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        token: token,
      },
      redirect: 'follow',
    }

    fetch(serverRoot + '/bot/get_subscriptions', requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(JSON.stringify(result))
        //setWidgetPreviews(result.widgets)
        forceUpdate()
      })
      .catch((error) => console.log('error', error))
  }, [])

  useEffect(() => {
    setInterval(() => {
      mirrors.forEach((mirror) => {
        let timeNow =
          mirror.variable.from === 'time.now.seconds'
            ? new Date().getSeconds()
            : mirror.variable.from === 'time.now.minutes'
            ? new Date().getMinutes()
            : mirror.variable.from === 'time.now.hours'
            ? new Date().getHours() % 12
            : 0
        let varCont = mirror.value
        varCont = varCont.replace('@' + mirror.variable.id, timeNow)
        idDict[mirror.widgetId][mirror.elId].obj[mirror.property] = varCont
      })
      forceUpdate()
    }, 1000)

    socket.on('notifyWidget', ({ widgetId, ev, data }) => {
      if (ev === 'init') {
        guis[widgetId] = data
        setGuis(guis)
        forceUpdate()
      } else if (ev === 'update') {
        data.forEach((d) => {
          idDict[widgetId][d.elId].obj[d.property] = d.newValue
        })
        forceUpdate()
      } else if (ev === 'mirror') {
        data.forEach((d) => {
          d.widgetId = widgetId
        })
        mirrors = mirrors.concat(data)
        setMirrors(mirrors)
        forceUpdate()
      } else if (ev === 'timer') {
        let timer = setInterval(() => {
          data.updates.forEach((d) => {
            idDict[widgetId][d.elId].obj[d.property] = d.newValue
          })
          forceUpdate()
        }, data.interval)
        timers[data.timerId] = timer
        setTimers(timers)
        forceUpdate()
      } else if (ev === 'untimer') {
        let timer = timers[data.timerId]
        clearInterval(timer)
        delete timers[data.timerId]
        setTimers(timers)
        forceUpdate()
      } else if (ev === 'memorize') {
        memDict[data.memoryId] = data.value
      } else if (ev === 'attachClick') {
        idDict[widgetId][data.elId].view.onclick = (e) => {
          data.updates.forEach((d) => {
            idDict[widgetId][d.elId].obj[d.property] = d.newValue
          })
          forceUpdate()
        }
      }
    })
    let botsSearchbar = document.getElementById('botsSearchbar')
    botsSearchbar.style.transform = 'translateY(0)'
    botsSearchbar.style.transition = 'transform .5s'
  }, [])

  useEffect(() => {
    if (menuOpen) {
      setTimeout(() => {
        widgetPreviews.forEach((wp) => {
          let wpDiv = document.getElementById(`widget-pane-${wp.id}-preview`)
          wpDiv.onclick = () => {
            setMenuOpen(false)
            widgets.push(wp)
            setWidgets(widgets)
            forceUpdate()
          }
        })
      }, 500)
    }
  }, [menuOpen])

  let theme = createTheme({
    palette: {
      primary: {
        main: '#BBDEFB',
      },
      secondary: {
        main: '#FFC107',
      },
    },
  })

  return (
    <div
      style={{ width: '100%', height: '100%', display: props.style.display }}
    >
      <div
        id={'botsSearchbar'}
        style={{
          width: '75%',
          position: 'absolute',
          right: '12.5%',
          top: 32,
          zIndex: 3,
        }}
      >
        <BotsBoxSearchbar openMenu={props.openMenu} />
      </div>
      <div
        id={'botsContainerOuter'}
        style={{
          width: '100%',
          height: '100%',
          overflow: 'auto',
          zIndex: 2,
          position: 'absolute',
          left: 0,
          top: 0,
        }}
      >
        <div id={'botsContainerInner'} style={{ width: '100%', height: 2000 }}>
          {widgets.map((w) => {
            return (
              <BotContainer
                widgetId={w.id}
                isPreview={false}
                onIdDictPrepared={(idD) => {
                  idDict['widget-' + w.id] = idD
                }}
                editMode={editMode}
                widgetWidth={250}
                widgetHeight={250}
                widgetX={16}
                widgetY={28}
                gui={guis['widget-' + w.id]}
              />
            )
          })}
          <div id="ghostpane" style={{ display: 'none' }}></div>
        </div>
      </div>
      <ThemeProvider theme={theme}>
      <Slide
          direction="right"
          in={inTheGame}
          mountOnEnter
        >
      <Fab
        color={'secondary'}
        style={{
          position: 'fixed',
          bottom: (isInRoom() && (isMobile() || isTablet())) ? (72 + 16) : 16,
          left: isDesktop() && isInRoom() ? 32 : 16,
          zIndex: 4,
        }}
        onClick={() => setEditMode(!editMode)}
      >
        <Edit />
      </Fab>
      </Slide>
      <Slide
          direction="right"
          in={inTheGame}
          mountOnEnter
          {...{ timeout: 500 }}
        >
      <Fab
        size={'medium'}
        color={'primary'}
        style={{
          position: 'fixed',
          bottom: (isInRoom() && (isMobile() || isTablet())) ? (56 + 16 + 72 + 16) : (16 + 56 + 16),
          left: (isDesktop() && isInRoom() ? 32 : 16) + 4,
          zIndex: 4,
        }}
        onClick={() => setMenuOpen(true)}
      >
        <Add />
      </Fab>
      </Slide>
      </ThemeProvider>
      <Drawer
        onClose={() => setMenuOpen(false)}
        open={menuOpen}
        anchor={'left'}
        style={{ direction: 'ltr' }}
      >
        <div
          style={{
            width: 360,
            height: '100%',
            backgroundColor: '#fff',
            display: 'flex',
          }}
        >
          <div style={{ width: 80, height: '100%', backgroundColor: '#eee' }}>
            <Avatar
              style={{
                width: 64,
                height: 64,
                backgroundColor: '#fff',
                position: 'absolute',
                right: 8,
                bottom: 16,
                padding: 8,
              }}
            />
          </div>
          <div style={{ width: 280, height: '100%', position: 'relative' }}>
            {widgetPreviews.map((wp) => (
              <BotContainer
                widgetId={wp.id}
                isPreview={true}
                onIdDictPrepared={(idD) => {
                  idDict['widget-' + wp.id] = idD
                }}
                editMode={editMode}
                widgetWidth={250}
                widgetHeight={250}
                widgetX={16}
                widgetY={28}
                gui={guis['widget-' + wp.id]}
              />
            ))}
          </div>
        </div>
      </Drawer>
    </div>
  )
}
