import { Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import Profile from "../pages/Profile";
import Nav from "./Nav";
const Router = () => {
    return (React.createElement(React.Fragment, null,
        React.createElement(Nav, null),
        React.createElement(Routes, null,
            React.createElement(Route, { path: "/profile", element: React.createElement(Profile, null) }),
            React.createElement(Route, { path: "*", element: React.createElement(Home, null) }))));
};
export default Router;
