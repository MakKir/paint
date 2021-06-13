import React, {useRef} from 'react';
import '../styles/toolbar.scss'
import toolState from "../store/toolState";
import Brush from "../tools/Brush";
import canvasState from "../store/canvasState";
import Rect from "../tools/Rect";
import Line from "../tools/Line";
import Circle from "../tools/Circle";
import Eraser from "../tools/Eraser";

const Toolbar = () => {

  const fillRef = useRef()

  const changeColor = e => {
    toolState.setStrokeColor(e.target.value)
    toolState.setFillColor(e.target.value)
  }


  const download = () => {
    const dataUrl = canvasState.canvas.toDataURL()
    console.log(dataUrl)
    const a = document.createElement('a')
    a.href = dataUrl
    a.download = canvasState.sessionId + ".jpg"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  const selectTool = (tool) => {
    toolState.setTool(new tool(canvasState.canvas), fillRef.current.value)
  }

  const btns = {
    brush: Brush,
    rect: Rect,
    circle: Circle,
    eraser: Eraser,
    line: Line
  }

  return (
    <div className="toolbar">
      {Object.keys(btns).map(btn => {
        const cls = ['toolbar__btn', btn]
        return (
          <button
            className={cls.join(' ')}
            onClick={() => selectTool(btns[btn])}
            key={btn}
              />
        )
      })}
      <input onChange={e => changeColor(e)} ref={fillRef} style={{marginLeft: 10}} type="color"/>
      <button className="toolbar__btn undo" onClick={() => canvasState.undo()}/>
      <button className="toolbar__btn redo" onClick={() => canvasState.redo()}/>
      <button className="toolbar__btn save" onClick={() => download()}/>
    </div>
  );
};

export default Toolbar;
