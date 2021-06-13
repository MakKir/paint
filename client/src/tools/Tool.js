export default class Tool {
    constructor(canvas) {
        this.canvas = canvas
        this.ctx = canvas.getContext('2d')
        this.destroyEvents()
        this.listen()
    }

    listen() {
        this.canvas.onmousedown = this.mouseDownHandler.bind(this)
        this.canvas.onmouseup = this.mouseUpHandler.bind(this)
        this.canvas.onmousemove = this.mouseMoveHandler.bind(this)
    }

    set fillColor(color) {
        this.ctx.fillStyle = color
    }
    set strokeStyle(color) {
        this.ctx.strokeStyle = color
    }
    get fillColor() {
        return this.ctx.strokeStyle
    }
    set lineWidth(width) {
        this.ctx.lineWidth = width
    }


    destroyEvents() {
        this.canvas.onmousemove = null
        this.canvas.onmouseup = null
        this.canvas.onmousedown = null
    }
}
