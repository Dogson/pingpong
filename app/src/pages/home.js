import classes from "./home.module.scss";
import React from "react";
import {Layout} from "../layout/layout";
import {APP_CONFIG} from "../config/appConfig";
import {AvatarBox} from "../components/avatarBox";
import {getAllPlayers} from "../util/endpoitns";
import {Redirect} from "react-router-dom";

export const Home = ({children}) => {
    return <Layout>
        <WhoAreYou/>
    </Layout>
};

class WhoAreYou extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            players: JSON.parse(localStorage.getItem('players'))
        }

        this.handleAvatarClick = this.handleAvatarClick.bind(this);
    }

    componentDidMount() {
        if (!this.state.players) {
            getAllPlayers()
                .then((players) => {
                        this.setState({players});
                        localStorage.setItem('players', JSON.stringify(players));
                    }
                )
        }
    }

    handleAvatarClick(player) {
        localStorage.setItem("currentPlayer", JSON.stringify(player));
        this.setState({currentPlayer: player});
    }

    render() {
        if (localStorage.getItem("currentPlayer")) {
            return <Redirect to={"/current-games"}/>
        }
        return <div className={classes.whoAreYou}>
            <h2 className={classes.title}>Qui es-tu ?</h2>
            <div className={classes.boxesContainer}>

                {
                    this.state.players && this.state.players.map((player) => {
                        return <AvatarBox player={player} onClick={this.handleAvatarClick}/>
                    })
                }
            </div>
        </div>
    }
}