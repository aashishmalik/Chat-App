const express = require('express')
const socketio = require('socket.io')
const http = require('http')

app = express()
const server = http.createServer(app)
const io = socketio(server)

let idtousername = {}

io.on('connection', (socket) => {

    socket.on('login', (data) => {
        let socketid = socket.id;
        idtousername[socketid] = data.username;
        socket.join(data.username) //create room


    })



    socket.on('send-msg', (data) => {

        if (data.message.startsWith('@')) {

            let user = data.message.split(':')[0].substring(1);
            let msg = data.message.split(':')[1].trim();
            io.in(user).emit('new-msg', { message: msg }) //room name


        } else
            io.emit('new-msg', { message: data.message, username: idtousername[socket.id] })
    })

})


app.use('/', express.static(__dirname + '/public'));

server.listen(4000, () => {
    console.log("server is running http://localhost:4000")
})