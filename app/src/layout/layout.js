import classes from "./layout.module.scss";
import React from "react";
import cx from "classnames";
import {Helmet} from "react-helmet";

export const Layout = ({children, smallHeader}) => {
    return <div className={classes.wrapper}>
        <Helmet title="Ping-Pong"/>
        <div className={classes.container}>
            <PageTitle small={smallHeader}/>
            {children}
        </div>
    </div>
};

class PageTitle extends React.Component {

    render() {
        const {small} = this.props;

        return <div className={cx(classes.pageTitle, {[classes.small]: small})}>
            <h1 className={classes.title} onClick={() => {
                this.props.history.push("/")
            }}>
                Ping-pong
            </h1>
            <h1 className={classes.subtitle}>Championnat de Nervy</h1>
        </div>

    }
}