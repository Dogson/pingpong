import classes from "./authHome.module.scss";
import React from "react";
import {Layout} from "../layout/layout";
import {APP_CONFIG} from "../config/appConfig";
import {getAllPlayers, getPlayerGames} from "../util/endpoitns";
import {Redirect} from "react-router-dom";
import {AvatarBox} from "../components/avatarBox";
import {getAdversary} from "../util/utils";
import {cloneDeep} from "lodash";
import Button from "@material-ui/core/Button";


export class AuthHome extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentPlayer: JSON.parse(localStorage.getItem("currentPlayer")),
        };

        this.handleGameClick = this.handleGameClick.bind(this);
        this.logout = this.logout.bind(this);
    }

    componentDidMount() {
        this.state.currentPlayer && getPlayerGames(this.state.currentPlayer)
            .then((games) => {
                this.setState({unplayedGames: games});
            })
    }

    logout() {
        localStorage.removeItem("currentPlayer");
        this.setState({currentPlayer: null})
    }

    handleGameClick(game) {
        this.props.history.push({
            pathname: '/game',
            state: {
                id: game.id,
                player1: {id: game.player1.id},
                player2: {id: game.player2.id},
                winner: game.winner && game.winner.id,
                scores: game.scores
            }
        })
    }

    render() {
        const {currentPlayer, unplayedGames, currentGame} = this.state;
        if (!currentPlayer) {
            return <Redirect to={"/"}/>
        }
        return <Layout smallHeader>
            <UnplayedGames games={unplayedGames} onClick={this.handleGameClick} handleLogout={this.logout}/>
            <Button className={classes.mainBtn} style={{marginTop: 20}} variant="contained" onClick={() => this.props.history.push("/results")}>
                Accèder aux résultats
            </Button>
        </Layout>
    }
};

const UnplayedGames = ({games, onClick, handleLogout}) => {
    return <div className={classes.unplayedGames}>
        <h2>Hello {JSON.parse(localStorage.currentPlayer).name} <span style={{fontSize: 17}}>🏓</span> </h2>
        <div onClick={handleLogout} className={classes.notYou}>Ce n'est pas toi ?</div>
        <p style={{fontSize: 18}}>Choisis ton adversaire :</p>
        <div className={classes.advContainer}>
            {games && games.map((game) => {
                return <AvatarBox game={game} player={getAdversary(game)} onClick={() => onClick(game)}/>
            })}
        </div>
    </div>
};