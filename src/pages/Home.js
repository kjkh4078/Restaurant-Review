import React from 'react';
import Map from "../components/Map";
import styles from "./Home.module.scss";
import Search from "../components/Search";
const Home = () => {
    return (React.createElement("div", { className: styles.container },
        React.createElement("div", { className: styles.wrapper },
            React.createElement(Search, null),
            React.createElement(Map, null))));
};
export default Home;
