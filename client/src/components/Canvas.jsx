import React, {useEffect, useRef, useState} from "react";
import axios from "axios";
import "../styles/canvas.scss";
import {observer} from "mobx-react-lite";
import canvasState from "../store/canvasState";
import toolState from "../store/toolState";
import Brush from "../tools/Brush";
import {Modal, Button} from "react-bootstrap";
import {useParams} from "react-router-dom"
import Rect from "../tools/Rect";
import config from "../config";
import Line from "../tools/Line";
import Eraser from "../tools/Eraser";
import Circle from "../tools/Circle";

const Canvas = observer(() => {
  const canvasRef = useRef()
  const usernameRef = useRef()
  const [modal, setModal] = useState(true)
  const params = useParams()

  useEffect(() => {
    canvasState.setCanvas(canvasRef.current)
    let ctx = canvasRef.current.getContext('2d')
    axios.get(`${config.protocol}${config.domain}/image?id=${params.id}`)
      .then(response => {
        const img = new Image()
        img.src = response.data
        img.onload = () => {
          ctx.clearRect(0,0, canvasRef.current.width, canvasRef.current.height)
          ctx.drawImage(img, 0,0, canvasRef.current.width, canvasRef.current.height)
        }
      })
  }, [])

  useEffect(() => {
    if (canvasState.username) {

      const socket = new WebSocket(`ws://${config.domain}/`)
      canvasState.setSocket(socket)
      canvasState.setSessionId(params.id)
      toolState.setTool(new Brush(canvasRef.current))

      socket.onopen = () => {
        socket.send(JSON.stringify({
          id: params.id,
          username: canvasState.username,
          method: 'connection'
        }))
      }
      socket.onmessage = (event) => {
        let msg = JSON.parse(event.data)
        switch (msg.method) {
          case 'connection':
            console.log(`Пользователь ${msg.username} подключился`)
            break
          case 'draw':
            drawHandler(msg)
            break
        }
      }
    }
  }, [canvasState.username])

  const drawHandler = (msg) => {
    const figure = msg.figure
    const ctx = canvasRef.current.getContext('2d')
    switch (figure.type) {
      case 'brush':
        Brush.draw(ctx, figure)
        break
      case 'eraser':
        Eraser.draw(ctx, figure)
        break
      case 'rect':
        Rect.staticDraw(ctx, figure)
        break
      case 'circle':
        Circle.staticDraw(ctx, figure)
        break
      case 'line':
        Line.staticDraw(ctx, figure)
        break
      case 'finish':
        ctx.beginPath()
    }
  }

  const mouseDownHandler = () => {
    canvasState.pushToUndo(canvasRef.current.toDataURL())

    axios.post(`${config.protocol}${config.domain}/image?id=${params.id}`, {img: canvasRef.current.toDataURL()})
      .then(response => console.log(`Изображение сохранено: ${response.data}`))
  }

  const connectionHandler = () => {
    canvasState.setUsername(usernameRef.current.value)
    setModal(false)
  }

  return (
    <div className="canvas">
      <Modal show={modal} onHide={() => {
      }}>
        <Modal.Header closeButton>
          <Modal.Title>Введите ваше имя</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input ref={usernameRef} type="text"/>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={connectionHandler}>
            Войти
          </Button>
        </Modal.Footer>
      </Modal>
      <canvas onMouseDown={() => mouseDownHandler()} ref={canvasRef} width={600} height={400}/>
    </div>
  );
});

export default Canvas;
