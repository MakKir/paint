import {makeAutoObservable} from "mobx";

class CanvasState {
    canvas = null
    socket = null
    sessionId = null
    undoList = []
    redoList = []
    username = ''


    constructor() {
        makeAutoObservable(this)
    }

    sendSocketRequest(figure) {
        this.socket.send(JSON.stringify({
            method: 'draw',
            id: this.sessionId,
            figure
        }))
    }

    setSessionId(id) {
        this.sessionId = id
    }

    setSocket(socket) {
        this.socket = socket
    }

    setUsername(username) {
        this.username = username
    }

    setCanvas(canvas) {
        this.canvas = canvas
    }

    pushToUndo(data) {
        this.undoList.push(data)
    }

    pushToRedo(data) {
        this.redoList.push(data)
    }

    undo() {
        let ctx = this.canvas.getContext('2d')

        if (this.undoList.length > 0) {
            let dataUrl = this.undoList.pop()
            console.log(this.canvas.toDataURL())
            this.redoList.push(this.canvas.toDataURL())
            drawCanvasImage(dataUrl, ctx, this.canvas)
        }
    }

    redo() {
        let ctx = this.canvas.getContext('2d')

        if (this.redoList.length > 0) {
            let dataUrl = this.redoList.pop()
            this.undoList.push(this.canvas.toDataURL())
            drawCanvasImage(dataUrl, ctx, this.canvas)
        }
    }


}

function drawCanvasImage(src, ctx, canvas) {
    let img = new Image()
    img.src = src
    img.onload = () => {
        ctx.clearRect(0,0, canvas.width, canvas.height)
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
    }
}

export default new CanvasState()
