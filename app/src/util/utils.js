export const getAdversary = (game) => {
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