import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import { ColorPicker } from 'react-color-gradient-picker'
import 'react-color-gradient-picker/dist/index.css'

const gradient = {
  points: [
    {
      left: 0,
      red: 0,
      green: 0,
      blue: 0,
      alpha: 1,
    },
    {
      left: 100,
      red: 255,
      green: 0,
      blue: 0,
      alpha: 1,
    },
  ],
  degree: 0,
  type: 'linear',
}

function GradientPicker() {
  const [gradientAttrs, setGradientAttrs] = useState(gradient)

  const onChange = (gradientAttrs) => {
    setGradientAttrs(gradientAttrs)
  }

  return (
    <div style={{padding: 16, backgroundColor: '#fff', borderRadius: 16}}>
      <ColorPicker
        onStartChange={onChange}
        onChange={onChange}
        onEndChange={onChange}
        gradient={gradientAttrs}
        isGradient
      />
    </div>
  )
}

export default GradientPicker
