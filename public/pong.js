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

let screen;
let playerId = 0;

function start(){
    const canvas = document.getElementById('screen');
    
    screen = canvas.getContext("2d");
    
    // cria jogador no state da pagina
    createPlayer();
    createPlayer();

    document.addEventListener("keydown", (key) => {     
        // keycode 38 = arrowUp, keycode 40 = arrowDown
        if(key.keyCode== 38 || key.keyCode==40){
            state.players[0].key = key.keyCode;
        }
    })

    // define intervalo de 60 fps para o loop
    setInterval(loop, 1000/60);

    //cria bola
    initBall();

}

function createPlayer(){

    if(Object.keys(state.players).length >= 2){
        return;
    }

    if(Object.keys(state.players).length == 1){
        playerId++
        return state.players[playerId] = {
            id: playerId,
            name: `Player${playerId}`,
            width: 15,
            heigth: 110,
            position: (state.screen.heigth / 2) - (10 / 2),
            points: 0,
            x: state.screen.width - 15 - 10,
            y: (state.screen.heigth - 110) / 2,
            key: 0,
            number: 2
        }
    }
    
    return state.players[0] = {
        id: playerId,
        name: `Player${playerId}`,
        width: 15,
        heigth: 110,
        position: (state.screen.heigth / 2) - (10 / 2),
        points: 0,
        x: 10,
        y: (state.screen.heigth - 110) / 2,
        key: 0,
        number: 1
    }

}

function loop(){
    
     //Verifica se a bola está colidindo com o barra do player 1
    if(
        state.ball.x >= state.players[0].x && state.ball.x <= state.players[0].x + 10 
        && state.ball.y >= state.players[0].y && state.ball.y <= state.players[0].y + 
        state.players[0].heigth
    ){
        state.ball.orientationX = 1;
    }
    //Verifica se a bola está colidindo com o barra do player 2
    else if(
        state.ball.x >= state.players[playerId].x && state.ball.x <= state.players[playerId].x + 10 
        && state.ball.y >= state.players[playerId].y && state.ball.y <= state.players[playerId].y + 
        state.players[playerId].heigth
    ){
        state.ball.orientationX = -1;
    }

    // verifica se a bola bateu no chão ou no teto
    if(state.ball.y + 10 >= state.screen.heigth || state.ball.y <= 0){
        state.ball.orientationY *= -1;
    }

    //move a bola no eixo X e Y
    state.ball.x += 5 * state.ball.orientationX;
    state.ball.y += 5 * state.ball.orientationY;

    if(state.ball.x + 10 > state.screen.width){
        state.players[0].points++;
        document.getElementById('player1_points').innerHTML = state.players[0].points;
        initBall();
    }else if(state.ball.x < 0){
        state.players[playerId].points++;
        document.getElementById('player2_points').innerHTML = state.players[playerId].points;
        initBall();
    }

    if(state.players[0].key == 38 && state.players[0].y > 0){
        state.players[0].y -= 7;
    }else if(state.players[0].key == 40   && state.players[0].y + state.players[0].heigth < state.screen.heigth){
        state.players[0].y += 7;
    }
    draw()

}

function initBall(){
    state.ball.orientationY = Math.pow( 2, Math.floor( Math.random() * 2 ) + 1 ) - 3; 
    state.ball.orientationX = Math.pow( 2, Math.floor( Math.random() * 2 ) + 1 ) - 3; 
    state.ball.x = state.screen.width  / 2 - 10;
    state.ball.y = state.screen.heigth / 2 - 10;
}

function draw(){
    //fundo
    drawReact(0,0, state.screen.width, state.screen.heigth,"#000")
    // players
    drawReact(state.players[0].x, state.players[0].y, state.players[0].width, state.players[0].heigth)
    drawReact(state.players[playerId].x, state.players[playerId].y, state.players[playerId].width, state.players[playerId].heigth)
    // barra lateral
    drawReact(state.screen.width/2 -5,0,5,state.screen.heigth);
    // bola
    drawReact(state.ball.x, state.ball.y, 10, 10);
}

function drawReact(x,y,w,h,color="#fff"){
    screen.fillStyle = color;
    screen.fillRect(x,y,w,h);
    screen.fillStyle = "#000";
}

start();