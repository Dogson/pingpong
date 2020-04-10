import classes from "./results.module.scss";
import React from "react";
import {Layout} from "../layout/layout";
import {AvatarBox} from "../components/avatarBox";
import {getAllResults} from "../util/endpoitns";
import {Redirect} from "react-router-dom";
import cx from "classnames";

const podiumImg = require("./podium.svg");

export class Results extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            players: JSON.parse(localStorage.getItem('players')),
            currentPlayer: JSON.parse(localStorage.getItem("currentPlayer")),
        };

    }

    componentDidMount() {
        getAllResults(this.state.players)
            .then((ranking) => {
                console.log(ranking);
                this.setState({ranking})
            })
    }

    render() {
        const {players, currentPlayer, ranking} = this.state;
        if (!currentPlayer || !players) {
            return <Redirect to={"/"}/>
        }
        return <Layout>
            <div className={classes.resultsContainer}>
                <h2 style={{textAlign: "center"}}>Résultats</h2>
                {
                    ranking && <>
                        <Podium result={ranking}/>
                        <RestOf result={ranking}/></>
                }
            </div>
        </Layout>
    }
}

const Podium = ({result}) => {
    const podiumRanking = [result[1], result[0], result[2]];

    return <div className={classes.podium}>
        {
            podiumRanking.map((ranking) =>
                <div className={cx(classes.podiumStep, classes["step" + ranking.rank])}>
                    <div className={classes.rankNumber}>{ranking.rank}</div>
                    <AvatarBox player={ranking} disabled small/>
                    <div className={classes.playerName}>
                        {ranking.name}
                    </div>
                    <div
                        className={classes.nbVictories}>{ranking.wins} {ranking.wins > 1 ? "victoires" : "victoire"}</div>
                </div>
            )
        }

    </div>
};

const RestOf = ({result}) => {
    let restOfRanking = [];
    for (let i = 3; i < 10; i++) {
        restOfRanking.push(result[i]);
    }

    return <div className={classes.restOf}>
        {restOfRanking.map((ranking) =>
            <div className={classes.restOfRow}>
                <div className={classes.rankNumber}>
                    {ranking.rank}
                </div>
                <AvatarBox player={ranking} disabled smallest/>
                <div className={classes.playerName}>
                    {ranking.name}
                </div>
                <div className={classes.nbVictories}>
                    {ranking.wins} {ranking.wins > 1 ? "victoires" : "victoire"}
                </div>
            </div>
        )}
    </div>
}