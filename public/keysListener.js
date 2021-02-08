export default function keysListener(document){
    
    const state = {
        observers: [],
        playerId: null
    }

    function registerPlayer(playerId){
        state.playerId = playerId
    }
    
    function subscribe(observerFunction) {
        state.observers.push(observerFunction)
    }

    function notifyAll(command) {
        for (const observerFunction of state.observers) {
            observerFunction(command)
        }
    }

    document.addEventListener("keydown", handleKeyListiner)

    function handleKeyListiner(event){
        const keyPressed = event.key;

        const command = {
            type: 'move-player',
            playerId: state.playerId,
            keyPressed
        }

        notifyAll(command)
    }

    return {
        registerPlayer,
        subscribe
    }

}