import {makeAutoObservable} from "mobx";

class ToolState {
  tool = null


  constructor() {
    makeAutoObservable(this)
  }

  setTool(tool, color) {
    this.tool = tool
    this.setFillColor(color)
    this.setStrokeColor(color)
  }

  setFillColor(color) {
    this.tool.fillColor = color
  }

  setStrokeColor(color) {
    this.tool.strokeStyle = color
  }

  setLineWidth(width) {
    this.tool.lineWidth = width
  }

}

export default new ToolState()
