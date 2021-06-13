const express = require('express')
const app = express()
const WSServer = require('express-ws')(app)
const aWss = WSServer.getWss()
const cors = require('cors')
const config = require('./config')
const PORT = process.env.PORT || config.port
const fs = require('fs')
const path = require('path')

app.use(cors())
app.use(express.json())

app.ws('/', (ws, req) => {
    ws.on('message', (msg) => {
        msg = JSON.parse(msg)
        console.log(msg)
        switch (msg.method) {
            case "connection":
                connectionHandler(ws, msg)
                break
            case "draw":
                broadcastConnection(ws, msg)
                break
        }
    })
})

app.post('/image', (req,res) => {
    try {
        const data = req.body.img.replace('data:image/png;base64,', '')
        const filename = `${req.query.id}.jpg`
        fs.writeFileSync(path.resolve(__dirname, config.filesDir, filename), data, 'base64')
        res.status(200).json(filename)
    } catch (e) {
        console.log(e)
        return res.status(500).json({e})
    }
})
app.get('/image', (req,res) => {
    try {
        const file = fs.readFileSync(path.resolve(__dirname, config.filesDir, `${req.query.id}.jpg`))
        const data = 'data:image/png;base64,' + file.toString('base64')
        return res.status(200).json(data)
    } catch (e) {
        console.log(e)
        return res.status(500).json({e})
    }
})


app.listen(PORT, () => console.log(`server started on PORT ${PORT}`))

const connectionHandler = (ws, msg) => {
    ws.id = msg.id
    broadcastConnection(ws, msg)
}

const broadcastConnection = (ws, msg) => {

    aWss.clients.forEach(client => {
        if (client.id === msg.id) {
            console.log(client.id)
            client.send(JSON.stringify(msg))
        }
    })
}
