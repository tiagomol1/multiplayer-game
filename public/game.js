export default function createGame(){

    const state = {
        players: {},
        screen:{
            heigth: 450,
            width: 800
        },
        ball: {
            orientationX: 0,
            orientationY: 0,
            x: 0,
            y: 0
        }
    }

    const observers = []

    function start(){
        // define intervalo de 60 fps para o loop
        setInterval(loop, 1000/60);
        //cria bola
        initBall();
    }

    function setState(newState){
        Object.assign(state, newState);
    }

    function createPlayer(playerId){

        if(Object.keys(state.players).length > 2){
            console.log('> Server full.');
        }else{

            if(Object.keys(state.players).length == 1){
                state.players[playerId] = {
                    id: playerId,
                    name: `Player`,
                    width: 15,
                    heigth: 110,
                    position: (state.screen.heigth / 2),
                    points: 0,
                    x: state.screen.width - 15 - 10,
                    y: (state.screen.heigth - 110) / 2,
                    number: 2
                }
            }else{
                state.players[playerId] = {
                    id: playerId,
                    name: `Player`,
                    width: 15,
                    heigth: 110,
                    position: (state.screen.heigth / 2) - (10 / 2),
                    points: 0,
                    x: 10,
                    y: (state.screen.heigth - 110) / 2,
                    number: 1
                }
            }
    
            notifyAll({
                type: 'add-player',
                playerId: state.players[playerId].id
            })
        }
        

    }

    function removePlayer(playerId){
        delete state.players[playerId]

        notifyAll({
            type: 'remove-player',
            playerId: playerId
        })
    }

    function loop(){
        // verifica se a bola bateu no chão ou no teto
            if(state.ball.y + 10 >= state.screen.heigth || state.ball.y <= 0){
                state.ball.orientationY *= -1;
            }

            Object.keys(state.players).map(player =>{
                if(
                state.ball.x >= state.players[player].x && state.ball.x <= state.players[player].x + 10 
                && state.ball.y >= state.players[player].y && state.players[player].number == 1
                && state.ball.y <= state.players[player].y + state.players[player].heigth
                ){
                    state.ball.orientationX = 1
                }

                if(
                state.ball.x >= state.players[player].x && state.ball.x <= state.players[player].x + 10 
                && state.ball.y >= state.players[player].y && state.players[player].number == 2
                && state.ball.y <= state.players[player].y + state.players[player].heigth
                ){''
                    state.ball.orientationX = -1
                }
            })

            if(Object.keys(state.players).length > 1){
                //move a bola no eixo X e Y
                state.ball.x += 5 * state.ball.orientationX;
                state.ball.y += 5 * state.ball.orientationY;
            }
           

            if(state.ball.x + 10 > state.screen.width){
                initBall();
                Object.keys(state.players).map(player => {
                    if(state.players[player].number == 1){
                        state.players[player].points = state.players[player].points + 1
                        state.players[player].type = 'points-player'
                        notifyAll(state.players[player])
                    }
                })
            }else if(state.ball.x < 0){
                Object.keys(state.players).map(player => {
                    if(state.players[player].number == 2){
                        state.players[player].points = state.players[player].points + 1
                        state.players[player].type = 'points-player'
                        notifyAll(state.players[player])
                    }
                })
                initBall();
            }

            notifyAll({
                type: 'move-ball',
                orientationX: state.ball.orientationX,
                orientationY: state.ball.orientationY,
                x: state.ball.x,
                y: state.ball.y
            })
        

    }

    function initBall(){
        state.ball.orientationY = Math.pow( 2, Math.floor( Math.random() * 2 ) + 1 ) - 3; 
        state.ball.orientationX = Math.pow( 2, Math.floor( Math.random() * 2 ) + 1 ) - 3; 
        state.ball.x = state.screen.width  / 2 - 10;
        state.ball.y = state.screen.heigth / 2 - 10;
    }

    function setBallMoviment(command){
        Object.assign(state.ball, command)
    }

    function movePlayer(command) {
        notifyAll(command)

        const acceptedMoves = {
            ArrowUp(player) {
                if (player.y > 6) {
                    player.y = player.y - 34
                }
            },
            ArrowDown(player) { 
                if(player.y < state.screen.heigth - player.heigth -9){
                    player.y = player.y + 34
                }
            }
        }

        const keyPressed = command.keyPressed
        const playerId = command.playerId
        const player = state.players[playerId]
        const moveFunction = acceptedMoves[keyPressed]

        if (player && moveFunction) {
            moveFunction(player)
        }

    }

    function setPoints(command){
        state.players[command.id].points = state.players[command.id].points + 1
        if(Object.keys(state.players).length == 2){
            if(state.players[command.id].number == 1){
                document.getElementById('player1_points').innerHTML = state.players[command.id].points
            }
            if(state.players[command.id].number == 2){
                document.getElementById('player2_points').innerHTML = state.players[command.id].points
            }
        }
    }

    function subscribe(observerFunction) {
        observers.push(observerFunction)
    }

    function notifyAll(command) {
        for (const observerFunction of observers) {
            observerFunction(command)
        }
    }
    
    return {
        state,
        setState,
        setBallMoviment,
        start,
        createPlayer,
        removePlayer,
        movePlayer,
        setPoints,
        subscribe
    }

}