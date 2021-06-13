import Tool from "./Tool";
import canvasState from "../store/canvasState";


export default class Circle extends Tool {
    constructor(canvas) {
        super(canvas);
    }

    mouseDownHandler(e) {
        this.mouseDown = true
        this.ctx.beginPath()
        this.startX = e.pageX - e.target.offsetLeft
        this.startY = e.pageY - e.target.offsetTop
        this.saved = this.canvas.toDataURL()
    }

    mouseUpHandler(e) {
        this.mouseDown = false
        canvasState.sendSocketRequest({
            type: 'circle',
            x: this.startX,
            y: this.startY,
            r: this.r,
            color: this.ctx.fillStyle,
            strokeColor: this.ctx.strokeStyle,
            lineWidth: this.ctx.lineWidth
        })
    }

    mouseMoveHandler(e) {
        if(this.mouseDown) {
            let currentX =  e.pageX - e.target.offsetLeft
            let currentY =  e.pageY - e.target.offsetTop
            let width = currentX - this.startX
            let height = currentY - this.startY
            this.r = Math.sqrt(width**2 + height**2)
            this.draw(this.startX, this.startY, this.r)
        }
    }

    draw(x,y,r) {
        const img = new Image()
        img.src = this.saved
        img.onload = async function () {
            this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height)
            this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height)
            figure(this.ctx, x, y, r)
        }.bind(this)
    }

    static staticDraw(ctx, {x, y, r, color, strokeColor, lineWidth}) {
        ctx.fillStyle = color
        ctx.strokeStyle = strokeColor
        ctx.lineWidth = lineWidth
        figure(ctx, x, y, r)
    }
}

function figure(ctx, x, y, r) {
    ctx.beginPath()
    ctx.arc(x, y, r, 0, 2*Math.PI)
    ctx.fill()
    ctx.stroke()
}
