import Brush from "./Brush";
import Tool from "./Tool";


export default class Eraser extends Brush {
    constructor(canvas) {
        super(canvas)
        this.type = 'eraser'
        console.log(this.type)
    }

    static draw(ctx, {x, y, width}) {
        ctx.strokeStyle = "white"
        ctx.lineWidth = width
        ctx.lineTo(x, y)
        ctx.stroke()
    }
}
