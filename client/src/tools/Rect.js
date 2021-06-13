import Tool from "./Tool";
import canvasState from "../store/canvasState";

export default class Rect extends Tool {
    constructor(canvas) {
        super(canvas)
    }

    mouseUpHandler(e) {
        this.mouseDown = false
        canvasState.sendSocketRequest({
            type: 'rect',
            x: this.startX,
            y: this.startY,
            w: this.width,
            h: this.height,
            color: this.ctx.fillStyle,
            strokeColor: this.ctx.strokeStyle,
            lineWidth: this.ctx.lineWidth
        })

    }
    mouseDownHandler(e) {
        this.mouseDown = true
        this.ctx.beginPath()
        this.startX = e.pageX - e.target.offsetLeft;
        this.startY = e.pageY - e.target.offsetTop;
        this.saved = this.canvas.toDataURL()
    }
    mouseMoveHandler(e) {
        if (this.mouseDown) {
            let currentX = e.pageX - e.target.offsetLeft;
            let currentY = e.pageY - e.target.offsetTop;
            this.width = currentX - this.startX;
            this.height = currentY - this.startY;
            this.draw(this.startX, this.startY, this.width, this.height)
        }
    }

    draw(x, y, w, h) {
        const img = new Image()
        img.src = this.saved
        img.onload = () => {
            this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height)
            this.ctx.drawImage(img, 0,0, this.canvas.width, this.canvas.height)
            figure(this.ctx, x, y, w, h)
        }

    }

    static staticDraw(ctx, {x, y, w, h, color, strokeColor, lineWidth}) {
        ctx.fillStyle = color
        ctx.strokeStyle = strokeColor
        ctx.lineWidth = lineWidth
        figure(ctx, x, y, w, h)
    }
}

function figure(ctx, x, y, w, h) {
    ctx.beginPath()
    ctx.rect(x, y, w, h)
    ctx.fill()
    ctx.stroke()
}
