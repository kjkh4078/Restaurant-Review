import classNames from "classnames";
import { useDispatch, useSelector } from "react-redux";
import { setMarkerPos } from "../redux/modules/getMap";
import styles from "./SearchResult.module.scss";
const SearchResult = ({ selected, setSelected, place, i, }) => {
    const dispatch = useDispatch();
    const { data: { map }, } = useSelector((state) => state.getMap);
    return (React.createElement("li", { className: classNames(styles["item"], selected.section === "place" && selected.index === i && styles.selected), onClick: () => {
            map.setCenter(new window.kakao.maps.LatLng(place.y, place.x));
            map.setLevel(3);
            dispatch(setMarkerPos(new window.kakao.maps.LatLng(place.y, place.x)));
            setSelected({ section: "place", index: i });
        } },
        React.createElement("div", { className: styles["item__header"] },
            React.createElement("span", { className: styles["header__place-name"] }, place.place_name),
            React.createElement("span", { className: styles["header__category"] }, place.category_group_name)),
        React.createElement("div", { className: styles["item__address"] }, place.place_name ? `- ${place.address_name}` : `${place.address_name}`),
        place.road_address_name && (React.createElement("div", { className: styles["item__road-address"] }, place.place_name
            ? `(${place.road_address_name})`
            : `(${place.road_address_name})`))));
};
export default SearchResult;
