import classes from "./avatarBox.module.scss";
import React from "react";
import cx from "classnames";
import {hasLost, hasWon} from "../util/utils";

export class AvatarBox extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {player, small, disabled, game, smallest} = this.props;
        const {name, avatar, color} = player;

        let gameResult = null;
        if (game) {
            const currentPlayer = JSON.parse(localStorage.getItem("currentPlayer"));
            if (hasWon(game, currentPlayer)) {
                gameResult = "victory";
            } else if (hasLost(game, currentPlayer)) {
                gameResult = "defeat";
            }
        }

        return <div className={cx(classes.avatarBox, {[classes.small]: small}, {[classes.smallest]: smallest})}>
            <div className={cx(classes.image, classes[gameResult])} onClick={() => !disabled && this.props.onClick(player)}>
                {gameResult && <div className={cx(classes.gameResult, classes[gameResult])}>
                    {gameResult === "victory" ?
                        <span>🏆 Victoire</span> :
                        <span>😖 Défaite</span>
                    }
                </div>}
                <img src={avatar} style={{position: "absolute", top: 0, left: 0}}
                     className={cx({[classes.gamePlayed]: !!gameResult})}/>
            </div>
        </div>
    }
}