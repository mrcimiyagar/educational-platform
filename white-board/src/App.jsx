import React from "react";
import "./App.scss";
import {Card, Typography} from '@material-ui/core'
import PencilIcon from './images/pencil.png'
import MarkerIcon from './images/marker.png'
import EraserIcon from './images/eraser.png'
import ShapesIcon from './images/shapes.png'
import TextIcon from './images/text.png'
import ResetIcon from './images/reset.png'
import ColorPicker from './components/ColorPicker'
import DrawApp, { doReset, enableEraser, enablePen, enableText, setColor } from "./components/Board";

function App(props) {

  return (
    <div style={{width: '100%', height: '100vh', backgroundColor: 'rgba(255, 255, 255, 0.375)', backdropFilter: 'blur(15px',
                 transform: 'translateZ(0)',
                 willChange: 'transform'}}
      >
      <DrawApp/>
      <Card style={{width: 72, height: 'auto', borderRadius: '0 24px 24px 0', position: 'fixed', left: 0, top: '50%', transform: 'translateY(-50%)'}}>
        <div style={{width: '100%', height: 24, alignItems: 'center', textAlign: 'center', justifyContent: 'center'}}>
          
        </div>
        <div onClick={() => enablePen()} style={{width: '100%', height: 'auto', alignItems: 'center', textAlign: 'center', justifyContent: 'center'}}>
          <img src={PencilIcon} style={{width: 40, height: 40}}/>
          <Typography>
            مداد
          </Typography>
        </div>
        <div style={{width: '100%', height: 24, alignItems: 'center', textAlign: 'center', justifyContent: 'center'}}>
          
        </div>
        <div style={{width: '100%', height: 'auto', alignItems: 'center', textAlign: 'center', justifyContent: 'center'}}>
          <img src={MarkerIcon} style={{width: 40, height: 40}}/>
          <Typography>
            ماژیک
          </Typography>
        </div>
        <div style={{width: '100%', height: 24, alignItems: 'center', textAlign: 'center', justifyContent: 'center'}}>
          
        </div>
        <div onClick={() => enableEraser()} style={{width: '100%', height: 'auto', alignItems: 'center', textAlign: 'center', justifyContent: 'center'}}>
          <img src={EraserIcon} style={{width: 40, height: 40}}/>
          <Typography>
            پاک کن
          </Typography>
        </div>
        <div style={{width: '100%', height: 24, alignItems: 'center', textAlign: 'center', justifyContent: 'center'}}>
          
        </div>
        <div style={{width: '100%', height: 'auto', alignItems: 'center', textAlign: 'center', justifyContent: 'center'}}>
          <img src={ShapesIcon} style={{width: 40, height: 40}}/>
          <Typography>
            شکل ها
          </Typography>
        </div>
        <div style={{width: '100%', height: 24, alignItems: 'center', textAlign: 'center', justifyContent: 'center'}}>
          
        </div>
        <div onClick={() => enableText()} style={{width: '100%', height: 'auto', alignItems: 'center', textAlign: 'center', justifyContent: 'center'}}>
          <img src={TextIcon} style={{width: 40, height: 40}}/>
          <Typography>
            متن
          </Typography>
        </div>
        <div style={{width: '100%', height: 24, alignItems: 'center', textAlign: 'center', justifyContent: 'center'}}>
          
        </div>
        <div onClick={() => doReset()} style={{width: '100%', height: 'auto', alignItems: 'center', textAlign: 'center', justifyContent: 'center'}}>
          <img src={ResetIcon} style={{width: 40, height: 40}}/>
          <Typography>
            ریست
          </Typography>
        </div>
        <div style={{width: '100%', height: 24, alignItems: 'center', textAlign: 'center', justifyContent: 'center'}}>
          
        </div>
      </Card>
      <ColorPicker type={1} onColorSelected={(code) => setColor(code)}/>
      <ColorPicker type={2}/>
    </div>
  )
}

export default App;
