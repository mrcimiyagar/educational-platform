
import React from 'react'

export let enableEraser = undefined
export let enablePen = undefined
export let enableText = undefined
export let doReset = undefined
export let setColor = undefined

class DrawApp extends React.Component {

    constructor(props) {
        super(props)
    }

    componentDidMount() {
        this.reset(false)
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
            this.reset(true)
        }
        enableText = () => {
            this.setState({
                mode:'text'
            })
        }
        setColor = (code) => {
            this.setColor(code)
        }
    }

    draw(e) {
        this.setState({
            mode:'draw'
        })
    }

    erase() {
        this.setState({
            mode:'erase'
        })
    }

    text() {
        this.setState({
            mode: 'text'
        })
    }

    drawing(e) { //if the pen is down in the canvas, draw/erase

        if(this.state.pen === 'down') {

            this.ctx.beginPath()
            this.ctx.lineWidth = this.state.lineWidth
            this.ctx.lineCap = 'round';


            if (this.state.mode === 'draw') {
                this.ctx.strokeStyle = this.state.penColor
                this.ctx.globalCompositeOperation = 'source-over'; 
            }

            if (this.state.mode === 'erase') {
                this.ctx.globalCompositeOperation = "destination-out"; 
                this.ctx.strokeStyle = 'rgba(255, 255, 255, 1)'
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
        if (this.state.mode === 'text') {
            this.ctx.globalCompositeOperation = 'source-over'; 
            this.ctx.font = "30px Arial";
            this.ctx.fillText("Hello World",10,50);
        }
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

    reset(ask) { //clears it to all white, resets state to original
        let resetOrig = () => {
            this.setState({
                mode: 'draw',
                pen : 'up',
                lineWidth : 10,
                penColor : 'black'
            })

            this.ctx = this.refs.canvas.getContext('2d')
            this.ctx.globalCompositeOperation = "destination-out"; 
            this.ctx.fillStyle="white"
            this.ctx.fillRect(0, 0, window.innerWidth, window.innerHeight)
            this.ctx.lineWidth = 10
        }
        if (ask) {
            if (window.confirm ('آیا مایل به ریست کردن وایت بورد هستید ؟')) {
                resetOrig()
            }
        }
        else {
            resetOrig()
        }
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