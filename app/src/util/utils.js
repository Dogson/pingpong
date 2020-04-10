export const getAdversary = (game) => {
    debugger;
    const players = JSON.parse(localStorage.getItem("players"));
    const currentPlayer = JSON.parse(localStorage.getItem("currentPlayer"));
    if (game.player1.id === currentPlayer.id) {
        return players.find((player) => {
            return game.player2.id === player.id
        });
    } else {
        return players.find((player) => {
            return game.player1.id === player.id
        });
    }
};

export const hasWon = (game, player) => {
    return game.winner && game.winner.id === player.id
}


export const hasLost = (game, player) => {
    if (!game.winner)
        return false;
    if (game.winner.id !== player.id)
        return true;
}