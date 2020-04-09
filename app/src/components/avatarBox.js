import classes from "./avatarBox.module.scss";
import React from "react";
import cx from "classnames";

export class AvatarBox extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {player, small, disabled} = this.props;
        const {name, avatar, color} = player;
        return <div className={cx(classes.avatarBox, {[classes.small]: small})}>
            <div className={classes.image} onClick={() => !disabled && this.props.onClick(player)}>
                <img src={avatar}/>
            </div>
        </div>
    }
}