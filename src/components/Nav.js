import styles from "./Nav.module.scss";
import { NavLink } from "react-router-dom";
import classNames from "classnames";
const Nav = () => {
    return (React.createElement("ul", { className: styles.container },
        React.createElement("h1", { className: classNames(styles.logo, styles.item) },
            React.createElement(NavLink, { to: "/" },
                React.createElement("span", { className: styles["logo__place"] }, "Place"),
                " ",
                React.createElement("span", { className: styles["logo__review"] }, "Review"))),
        React.createElement(NavLink, { to: "/", className: ({ isActive }) => isActive ? styles.selected : styles.deselect },
            React.createElement("li", null, "Search review")),
        React.createElement(NavLink, { to: "/new", className: ({ isActive }) => isActive ? styles.selected : styles.deselect },
            React.createElement("li", null, "New review")),
        React.createElement(NavLink, { to: "/profile", className: ({ isActive }) => isActive ? styles.selected : styles.deselect },
            React.createElement("li", null, "Profile"))));
};
export default Nav;
