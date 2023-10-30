import styles from "./Loading.module.scss";
const Loading = () => {
    return (React.createElement("div", { className: styles.container },
        React.createElement("div", { className: styles.loading }, "\u25CC")));
};
export default Loading;
