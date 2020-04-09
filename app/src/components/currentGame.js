import {getAdversary} from "../util/utils";
import classes from "./currentGame.module.scss";
import React from "react";
import {AvatarBox} from "./avatarBox";
import Button from '@material-ui/core/Button';
import {submitScore} from "../util/endpoitns";

const Vs = require("./Vs.png");

export class CurrentGame extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            rounds: [
                {player: 0, adversary: 0}, {player: 0, adversary: 0}, {player: 0, adversary: 0}
            ]
        };

        this.handleScore = this.handleScore.bind(this);
        this.submitFinalScore = this.submitFinalScore.bind(this);
    }

    handleScore(round, score) {
        const rounds = {...this.state.rounds};

        rounds[round] = score;
        this.setState({rounds});
    }

    submitFinalScore() {
        const  {score} = this.state;
        const {game} = this.props;

        submitScore(game, score)
            .then(() => {
                alert("coucou");
                //todo afficher un mesage de defaite ou de victory
            })
    }

    render() {
        const {game} = this.props;
        const adversary = getAdversary(game);
        const player = JSON.parse(localStorage.getItem("currentPlayer"));

        return <div className={classes.currentGame}>
            <div className={classes.playersContainer}>
                <div className={classes.player}>
                    <AvatarBox player={player} disabled small/>
                    <span className={classes.playerName}>{player.name}</span>
                </div>
                <img src={Vs} height="60"/>
                <div className={classes.adversary}>
                    <AvatarBox player={adversary} disabled small/>
                    <span className={classes.playerName}>{adversary.name}</span>
                </div>
            </div>

            <div className={classes.roundsContainer}>
                <Round onChangeScore={this.handleScore} score={this.state.rounds[0]} title={"Première manche"}/>
                <Round onChangeScore={this.handleScore} score={this.state.rounds[1]} title={"Deuxième manche"}/>
                <Round onChangeScore={this.handleScore} score={this.state.rounds[2]} title={"Troisième manche"}/>
            </div>
            <Button className={classes.submit} variant="contained" onClick={this.submitFinalScore}>Envoyer les scores</Button>
        </div>
    }
    
    
}

class Round extends React.Component {

    handleChangeScore(value, player) {
        const {onChangeScore, score} = this.props;
        const newScore = {...score};
        newScore[player] = parseInt(value);

        onChangeScore(newScore);
    }

    increase(player) {
        const {onChangeScore, score} = this.props;
        const newScore = {...score};
        newScore[player] = score[player]++;

        onChangeScore(newScore);
    }

    decrease(player) {
        const {onChangeScore, score} = this.props;
        if (score[player] !== 0) {
            const newScore = {...score};
            newScore[player] = score[player]--;

            onChangeScore(newScore);
        }
    }


    render() {
        const {score, title} = this.props;
        return <div className={classes.round}>
            <h3 style={{textAlign: "center"}}>{title}</h3>
            <div className={classes.scoresContainer}>
                <div className={classes.score}>
                    <Button onClick={() => this.decrease("player")} className={classes.minus}>-</Button>
                    <input className={classes.input} name="quantity" value={score.player}
                           onChange={(e) => this.handleChangeScore(e.target.value, "player")}
                           type="number"/>
                    <Button onClick={() => this.increase("player")} className={classes.plus}>+</Button>
                </div>
                <div className={classes.score}>
                    <Button onClick={() => this.decrease("adversary")} className={classes.minus}>-</Button>
                    <input className={classes.input} name="quantity" value={score.adversary}
                           onChange={(e) => this.handleChangeScore(e.target.value, "adversary")}
                           type="number"/>
                    <Button onClick={() => this.increase("adversary")} className={classes.plus}>+</Button>
                </div>
            </div>
        </div>
    }
}