
import React from 'react'

export let enableEraser = undefined
export let enablePen = undefined
export let doReset = undefined
export let setColor = undefined

class DrawApp extends React.Component {

    constructor(props) {
        super(props)
    }

    componentDidMount() {
        this.reset()
        enableEraser = () => {
            this.setState({
                mode:'erase'
            })
        }
        enablePen = () => {
            this.setState({
                mode:'draw'
            })
        }
        doReset = () => {
            if (window.confirm ('آیا مایل به ریست کردن وایت بورد هستید ؟')) {
                this.setState({
                    mode: 'draw',
                    pen : 'up',
                    lineWidth : 10,
                    penColor : 'black'
                })
    
                this.ctx = this.refs.canvas.getContext('2d')
                this.ctx.lineWidth = 10
            }
        }
        setColor = (code) => {
            this.setColor(code)
        }
    }

    draw(e) { //response to Draw button click 
        this.setState({
            mode:'draw'
        })
    }

    erase() { //response to Erase button click
        this.setState({
            mode:'erase'
        })
    }

    drawing(e) { //if the pen is down in the canvas, draw/erase

        if(this.state.pen === 'down') {

            this.ctx.beginPath()
            this.ctx.lineWidth = this.state.lineWidth
            this.ctx.lineCap = 'round';


            if(this.state.mode === 'draw') {
                this.ctx.strokeStyle = this.state.penColor
            }

            if(this.state.mode === 'erase') {
                this.ctx.strokeStyle = '#ffffff'
            }

            this.ctx.moveTo(this.state.penCoords[0], this.state.penCoords[1]) //move to old position
            this.ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY) //draw to new position
            this.ctx.stroke();

            this.setState({ //save new position 
                penCoords:[e.nativeEvent.offsetX, e.nativeEvent.offsetY]
            })
        }
    }

    penDown(e) { //mouse is down on the canvas
        this.setState({
            pen:'down',
            penCoords:[e.nativeEvent.offsetX, e.nativeEvent.offsetY]
        })
    }

    penUp() { //mouse is up on the canvas
        this.setState({
            pen:'up'
        })
    }

    penSizeUp(){ //increase pen size button clicked
        this.setState({
            lineWidth: this.state.lineWidth += 5
        })
    }

    penSizeDown() {//decrease pen size button clicked
        this.setState({
            lineWidth: this.state.lineWidth -= 5
        })
    }

    setColor(c){ //a color button was clicked
        this.setState({
            penColor : c
        })
    }

    reset() { //clears it to all white, resets state to original
        this.setState({
            mode: 'draw',
            pen : 'up',
            lineWidth : 10,
            penColor : 'black'
        })

        this.ctx = this.refs.canvas.getContext('2d')
        this.ctx.fillStyle="white"
        this.ctx.fillRect(0, 0, window.innerWidth, window.innerHeight)
        this.ctx.lineWidth = 10
    }

    render() {
        return (
            <div style={{width: '100%', height: '100%'}}>
                <canvas ref="canvas" width={window.innerWidth + 'px'} height={window.innerHeight + 'px'} style={{
                    width: '100%',
                    height: '100%',
                }} 
                    onMouseMove={(e)=>this.drawing(e)} 
                    onMouseDown={(e)=>this.penDown(e)} 
                    onMouseUp={(e)=>this.penUp(e)}>
                </canvas>
            </div>
        )
    }
}

export default DrawApp