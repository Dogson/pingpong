import {getAdversary} from "./utils";

const firebase = require("firebase");
// Required for side-effects
require("firebase/firestore");

firebase.initializeApp({
    apiKey: "AIzaSyB5MaLewGQsnMUq1DKoOD9gGYYPRr4xBSM",
    authDomain: "pingpong-364f5.firebaseapp.com",
    databaseURL: "https://pingpong-364f5.firebaseio.com",
    projectId: "pingpong-364f5",
    storageBucket: "pingpong-364f5.appspot.com",
    messagingSenderId: "359967768861",
    appId: "1:359967768861:web:18ce9e48720d7cf25021f4"

});

let db = firebase.firestore();


export async function initGames() {
    const games = await getAllGames();
    if (!games || games.length === 0) {
        const totalPlayers = 10;
        let players = await getAllPlayers();

        let row1 = players.slice(0, 5);
        let row2 = players.slice(totalPlayers - 5);

        const games = [];

        for (let i = 0; i < totalPlayers - 1; i++) {
            row1.forEach((player1, index) => {
                const game = {
                    player1: player1.ref,
                    player2: row2[row2.length - 1 - index].ref
                };
                const gamuExist = games.find((g) => {
                    return g.player1 === game.player2 || g.player2 === game.player1;
                });
                if (!gamuExist) {
                    games.push(game);
                }
            });
            let newPlayers = [];
            for (let i = 0; i < totalPlayers; i++) {
                if (i === 0)
                    newPlayers[i] = players[i];
                else if (i === totalPlayers - 1)
                    newPlayers[i] = players[1];
                else
                    newPlayers[i] = players[i + 1];
            }
            players = newPlayers;
            row1 = players.slice(0, 5);
            row2 = players.slice(totalPlayers - 5);
        }

        let batch = db.batch();

        games.forEach((game) => {
            batch.set(db.collection("games").doc(), game);
        });

        await batch.commit();
    }
};

async function getAllGames() {
    return db.collection("games").get().then((querySnapshot) => {
        return querySnapshot.docs;
    });
}

export async function getAllPlayers() {
    return db.collection("players").get().then((querySnapshot) => {
        return querySnapshot.docs.map((doc) => {
            return {
                id: doc.id,
                ...doc.data()
            };
        });
    });
}

export async function getPlayerGames(player) {
    const id = player.id;

    const playerRef = db.collection("players").doc(id);

    const gamesRef = db.collection("games");
    const query1 = gamesRef.where("player1", "==", playerRef).get();
    const query2 = gamesRef.where("player2", "==", playerRef).get();

    const [query1Snapshot, query2Snapshot] = await Promise.all([
        query1,
        query2
    ]);

    const query1Array = query1Snapshot.docs;
    const query2Array = query2Snapshot.docs;

    const games = query1Array.concat(query2Array);

    return games.map((game) => {
        return {
            id: game.id,
            ...game.data()
        }
    })
}

export async function submitScore(game, score) {
    let victory = false;
    let nbVictory = 0;
    for (let i = 0; i < 3; i++) {
        if (score[i].player > score[i].adversary) {
            nbVictory++;
        }
    }
    if (nbVictory >= 2) {
        victory = true;
    }

    const currentPlayer = JSON.parse(localStorage.getItem("currentPlayer"));
    const mappedScores = {};
    for (let i = 0; i < 3; i++) {
        let round = score[i];

        const idxCurrentPlayer = game.player1.id === currentPlayer.id ? 0 : 1;

        mappedScores[i] = [];

        if (idxCurrentPlayer === 0) {
            mappedScores[i].push(round.player);
            mappedScores[i].push(round.adversary);
        } else {
            mappedScores[i].push(round.adversary);
            mappedScores[i].push(round.player);
        }
    }

    const winnerId = victory ? currentPlayer.id : getAdversary(game).id;
    const winnerRef = db.collection("players").doc(winnerId);

    const gameRef = db.collection("games").doc(game.id);

    console.log(mappedScores);

    console.log(mappedScores);

    return gameRef.update({scores: mappedScores, winner: winnerRef})
        .then(() => {
            return victory;
        });
}