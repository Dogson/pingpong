import classes from "./authHome.module.scss";
import React from "react";
import {Layout} from "../layout/layout";
import {APP_CONFIG} from "../config/appConfig";
import {GameWidget} from "../components/gameWidget";
import {getAllPlayers, getUnplayedGame} from "../util/endpoitns";
import {Redirect} from "react-router-dom";
import {AvatarBox} from "../components/avatarBox";
import {getAdversary} from "../util/utils";
import {CurrentGame} from "../components/currentGame";


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
        this.state.currentPlayer && getUnplayedGame(this.state.currentPlayer)
            .then((games) => {
                this.setState({unplayedGames: games});
            })
    }

    logout() {
        localStorage.removeItem("currentPlayer");
        this.setState({currentPlayer: null})
    }

    handleGameClick(game) {
        this.setState({currentGame: game});
    }

    render() {
        const {currentPlayer, unplayedGames, currentGame} = this.state;
        if (!currentPlayer) {
            return <Redirect to={"/"}/>
        }
        return <Layout smallHeader>
            {currentGame ?
                <CurrentGame game={currentGame}/> :
                <UnplayedGames games={unplayedGames} onClick={this.handleGameClick} handleLogout={this.logout}/>}
        </Layout>
    }
};

const UnplayedGames = ({games, onClick, handleLogout}) => {
    return <div className={classes.unplayedGames}>
        <h2>Hello {JSON.parse(localStorage.currentPlayer).name}</h2>
        <div onClick={handleLogout} className={classes.notYou}>Ce n'est pas toi ?</div>
        <p>Choisis ton adversaire :</p>
        <div className={classes.advContainer}>
            {games && games.map((game) => {
                return <AvatarBox player={getAdversary(game)} onClick={() => onClick(game)}/>
            })}
        </div>


    </div>
};