import classNames from "classnames";
import styles from "./Button.module.scss";
const Button = ({ text, onClick, className, }) => {
    return (React.createElement("button", { onClick: onClick, className: classNames(styles.btn, className === null || className === void 0 ? void 0 : className.map((item) => styles[item])) }, text));
};
export default Button;
