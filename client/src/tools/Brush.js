import Tool from "./Tool";
import canvasState from "../store/canvasState";
import {instanceOf} from "prop-types";


export default class Brush extends Tool {
    constructor(canvas) {
        super(canvas)
        this.type = 'brush'
    }

    mouseMoveHandler(e) {
        if (this.mouseDown) {
            canvasState.sendSocketRequest({
                type: this.type,
                startX: this.startX,
                startY: this.startY,
                x: e.pageX - e.target.offsetLeft,
                y: e.pageY - e.target.offsetTop,
                width: this.ctx.lineWidth,
                color: this.ctx.strokeStyle
            })
        }
    }

    mouseDownHandler(e) {
      canvasState.sendSocketRequest({
        type: 'finish',
      })
        this.mouseDown = true
        this.ctx.beginPath()
        this.startX = e.pageX - e.target.offsetLeft
        this.startY = e.pageY - e.target.offsetTop
        this.ctx.moveTo(this.startX, this.startY)
    }

    mouseUpHandler(e) {
        this.mouseDown = false
        canvasState.sendSocketRequest({
          type: 'finish',
        })

    }

    static draw(ctx, {startX, startY, x, y, width, color}) {

        ctx.lineTo(x, y)
        ctx.lineWidth = width
        ctx.strokeStyle = color
        ctx.stroke()
    }
}
