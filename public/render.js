export default function render(screen, game, requestAnimationFrame, currentPlayerId){

    const canvas = screen.getContext("2d");
    
    draw(game.state)

    function draw(state){
        //fundo
        drawReact(0,0, state.screen.width, state.screen.heigth,"#000")
        // player
        Object.keys(state.players).map(player =>{
            drawReact(state.players[player].x, state.players[player].y, state.players[player].width, state.players[player].heigth)
        })
        // barra lateral
        drawReact(state.screen.width/2 -5,0,5,state.screen.heigth);
        // bola
        drawReact(state.ball.x, state.ball.y, 10, 10);
    }

    function drawReact(x,y,w,h,color="#fff"){
        canvas.fillStyle = color;
        canvas.fillRect(x,y,w,h);
    }

    requestAnimationFrame(() => {
        render(screen, game, requestAnimationFrame, currentPlayerId)
    })

}