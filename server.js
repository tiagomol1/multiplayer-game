import http from 'http';
import express from 'express';
import * as socketio from 'socket.io'
import createGame from './public/game.js';

const app = express()
const server = http.createServer(app)
const sockets = new socketio.Server(server)

const game = createGame();
game.start()

app.use(express.static('./public'));

game.subscribe((command) => {
    if(command.type != 'move-ball'){
        console.log(`> Emitting ${command.type}`)
    }
    sockets.emit(command.type, command)
})

sockets.on('connection', (socket) => {
    const playerId = socket.id
    console.log(`> Player connected: ${playerId}`)

    game.createPlayer(playerId)

    //envia o state atual da pagina
    socket.emit('setup', game.state)

    //ação ao deconectar
    socket.on('disconnect', () => {
        console.log(`> Player disconnected: ${playerId}`)
        game.removePlayer(playerId)
    })

    socket.on('move-player', (command) => {
        command.playerId = playerId
        command.type = 'move-player'

        game.movePlayer(command)
    })
})

server.listen(3000, () => {
    console.log('>>> Server listening port 3000 <<<\n\n--- Server logs ---')
})
