import {getAdversary} from "../util/utils";
import classes from "./currentGame.module.scss";
import React from "react";
import {AvatarBox} from "./avatarBox";
import Button from '@material-ui/core/Button';
import {submitScore} from "../util/endpoitns";
import cx from "classnames";
import {Layout} from "../layout/layout";
import {Redirect} from "react-router-dom";

const Vs = require("./Vs.png");
const victoryImg = require("./victory.gif");
const defeatImg = require("./defeat.gif");

export class CurrentGame extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            rounds: [
                {player: 0, adversary: 0},
                {player: 0, adversary: 0},
                {player: 0, adversary: 0}
            ],
            errorMessage: null,
            endResult: false,
        };

        debugger;
        this.handleScore = this.handleScore.bind(this);
        this.submitFinalScore = this.submitFinalScore.bind(this);
        this.validate = this.validate.bind(this);
    }

    handleScore(round, score) {
        this.setState({errorMessage: null})
        const rounds = {...this.state.rounds};

        rounds[round] = score;
        this.setState({rounds});
    }

    validate() {
        let errorMessage;
        for (let i = 0; i < 3; i++) {
            let round = this.state.rounds[i];
            if (errorMessage) {
                return errorMessage;
            } else if (round.player === 0 && round.adversary === 0) {
                errorMessage = "💪 Faites les 3 parties, quand même !"
            } else if (round.player < 11 && round.adversary < 11) {
                errorMessage = "😱 Les scores inscrits sont erronés !"
            }
        }
        return errorMessage;
    }

    submitFinalScore() {
        const {rounds} = this.state;
        const game = this.props.location.state;

        const errorMessage = this.validate();
        this.setState({errorMessage});
        if (!errorMessage) {
            submitScore(game, rounds)
                .then((victory) => {
                    const endResult = victory ? "victory" : "defeat";
                    this.setState({endResult})
                })
        }
    }

    render() {
        const game = this.props.location.state;
        const adversary = getAdversary(game);
        const player = JSON.parse(localStorage.getItem("currentPlayer"));
        return <Layout smallHeader> {
            this.state.endResult ? <EndScreen victory={this.state.endResult === "victory"}/> :
                <div className={classes.currentGame}>
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
                        <Round onChangeScore={this.handleScore} round={0} score={this.state.rounds[0]}
                               title={"Première manche"}/>
                        <Round onChangeScore={this.handleScore} round={1} score={this.state.rounds[1]}
                               title={"Deuxième manche"}/>
                        <Round onChangeScore={this.handleScore} round={2} score={this.state.rounds[2]}
                               title={"Troisième manche"}/>
                    </div>
                    {this.state.errorMessage && <div className={classes.errorMessage}>{this.state.errorMessage}</div>}
                    <Button className={classes.mainBtn} variant="contained" onClick={this.submitFinalScore}>Envoyer les
                        scores</Button>
                </div>
        }
        </Layout>
    }
}

class Round extends React.Component {

    handleChangeScore(value, player) {
        debugger;
        const {onChangeScore, score, round} = this.props;
        const newScore = {...score};
        newScore[player] = parseInt(value);

        onChangeScore(round, newScore);
    }

    increase(player) {
        const {onChangeScore, score, round} = this.props;
        const newScore = {...score};
        newScore[player] = score[player] + 1;
        debugger;
        onChangeScore(round, newScore);
    }

    decrease(player) {
        const {onChangeScore, score, round} = this.props;
        if (score[player] !== 0) {
            const newScore = {...score};
            newScore[player] = score[player] - 1;

            onChangeScore(round, newScore);
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
                           type="number" onFocus={(e) => {
                        e.target.select()
                    }}/>
                    <Button onClick={() => this.increase("player")} className={classes.plus}>+</Button>
                </div>
                <div className={classes.score}>
                    <Button onClick={() => this.decrease("adversary")} className={classes.minus}>-</Button>
                    <input className={classes.input} name="quantity" value={score.adversary}
                           onChange={(e) => this.handleChangeScore(e.target.value, "adversary")}
                           type="number" onFocus={(e) => {
                        e.target.select()
                    }}/>
                    <Button onClick={() => this.increase("adversary")} className={classes.plus}>+</Button>
                </div>
            </div>
        </div>
    }
}

class EndScreen extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    render() {
        const {victory} = this.props;

        if (this.state.redirect) {
            return <Redirect to="/home"/>
        }

        return <div className={classes.endScreen}>
            {victory ?
                <>
                    <div className={cx(classes.message, classes.victoryMessage)}>Victoire ✌️🏆</div>
                    <img src={victoryImg} width="100%" className={cx(classes.image, classes.victoryImage)}/>
                </> :
                <>
                    <div className={cx(classes.message, classes.defeatMessage)}>Défaite 😖</div>
                    <img src={defeatImg} width="100%" className={cx(classes.image, classes.defeatImage)}/>
                </>}

            <Button className={classes.mainBtn} variant="contained" onClick={() => {
                this.setState({redirect: true})
            }}>Un autre adversaire, tout de suite !</Button>
        </div>
    }
}