import React from 'react';

function App() {

  return (
    <div style={{width: 'auto', height: '100vh', display: 'flex', flexwrap: 'wrap'}}>
      <div
        id="max"
        style={{
          display: 'none',
          width: '100%',
          height: '100%',
          position: 'relative',
          zIndex: 99999
        }}
      >
        <video
          onClick="disableMax()"
          autoPlay
          id="screenMax"
          style={{
          transform: 'rotateY(0)',
          objectFit: 'cover',
          position: 'absolute',
          left: '0px',
          top: '0px',
          width: 'calc(100% - 200px - 16px)',
          height: 'auto'
          }}
        ></video>
        <video
          onClick="disableMax()"
          autoPlay
          id="webcamMax"
          style={{
          objectFit: 'cover',
          position: 'absolute',
          right: '0px',
          top: '0px',
          width: '200px',
          height: '200px',
          }}
        ></video>
      </div>
      <div
        id="participents"
        className="participents"
        style={{width: '100%', height: 'auto'}}
      >
        <div id="me" className="container" style={{display: 'none'}}></div>
      </div>
      <div style={{width: '100%', height: 128}}></div>
      <div
        id="openContainer"
        style={{width: '100%', height: '100%', position: 'fixed', left: '0px', top: '0px', zIndex: 99999, display: 'block'}}
      >
        <button
          id="openBtn"
          style={{display: 'none', position: 'fixed', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', width: '100px', height: '100px', borderRadius: '50px'}}
          onClick="window.openCallPage()"
        >
          ورود به مکالمه
        </button>
      </div>
    </div>
  )
}

export default App
