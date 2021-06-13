import Tool from "./Tool";
import canvasState from "../store/canvasState";


export default class Line extends Tool {
    constructor(canvas) {
        super(canvas);
    }

    mouseDownHandler(e) {
        this.mouseDown = true
        this.currentX = e.pageX - e.target.offsetLeft
        this.currentY = e.pageY - e.target.offsetTop
        this.ctx.beginPath()
        this.ctx.moveTo(this.currentX, this.currentY )
        this.saved = this.canvas.toDataURL()
    }

    mouseUpHandler(e) {
        this.mouseDown = false
        canvasState.sendSocketRequest({
            type: 'line',
            startX: this.currentX,
            startY: this.currentY,
            x: e.pageX - e.target.offsetLeft,
            y: e.pageY - e.target.offsetTop,
            color: this.ctx.strokeStyle,
            width: this.ctx.lineWidth
        })
    }

    mouseMoveHandler(e) {
        if (this.mouseDown) {
            this.draw(e.pageX - e.target.offsetLeft, e.pageY - e.target.offsetTop);
        }
    }


    draw(x,y) {
        const img = new Image()
        img.src = this.saved
        img.onload = async function () {
            this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height)
            this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height)
            figure(this.ctx, this.currentX, this.currentY, x, y)
        }.bind(this)

    }

    static staticDraw(ctx, {startX, startY, x, y, color, width}) {
        ctx.strokeStyle = color
        ctx.lineWidth = width
        figure(ctx, startX, startY, x, y)
    }

}

function figure(ctx, startX, startY, x, y) {
    ctx.beginPath()
    ctx.moveTo(startX, startY )
    ctx.lineTo(x, y)
    ctx.stroke()
}
