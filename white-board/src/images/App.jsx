import React from "react";
import "./App.scss";
import {Card, Typography} from '@material-ui/core'
import PencilIcon from '../'

function App(props) {
  return (
    <div style={{width: '100%', height: '100vh', backgroundColor: 'rgba(255, 255, 255, 0.5)', backdropFilter: 'blur(15px'}}>
      <Card style={{width: 72, height: 512, borderRadius: '0 24px 24px 0', position: 'fixed', left: 0, top: '50%', transform: 'translateY(-50%)'}}>
        <div style={{width: '100%', height: 24, alignItems: 'center', textAlign: 'center', justifyContent: 'center'}}>
          
        </div>
        <div style={{width: '100%', height: 'auto', alignItems: 'center', textAlign: 'center', justifyContent: 'center'}}>
          <img src={PencilIcon}/>
          <Typography>
            مداد
          </Typography>
        </div>
        <div style={{width: '100%', height: 24, alignItems: 'center', textAlign: 'center', justifyContent: 'center'}}>
          
        </div>
        <div style={{width: '100%', height: 'auto', alignItems: 'center', textAlign: 'center', justifyContent: 'center'}}>
          <img src={MarkerIcon}/>
          <Typography>
            مداد
          </Typography>
        </div>

      </Card>
    </div>
  )
}

export default App;
