import React, { useCallback, useState } from "react";
import styles from "./FindReview.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Button from "./Button";
import Review from "./Review";
import { setFilter } from "../redux/modules/getReviews";
const FindReview = ({ selected, setSelected, searchReviewPos, }) => {
    const dispatch = useDispatch();
    const { getMap: { markerPos }, getReviews: { reviews, filter }, } = useSelector((state) => state);
    const [text, setText] = useState("");
    // 검색어 입력
    const onChange = useCallback((e) => {
        setText(e.target.value);
    }, []);
    // 리뷰 필터
    const onFilterClick = useCallback(() => {
        if (filter === "ALL") {
            dispatch(setFilter("HERE"));
        }
        else {
            dispatch(setFilter("ALL"));
        }
    }, [dispatch, filter]);
    return (React.createElement("div", { className: styles.container },
        React.createElement("div", { className: styles["btn-wrapper"] },
            React.createElement(Button, { onClick: onFilterClick, text: filter === "ALL" ? "해당 위치 리뷰만 보기" : "전체 리뷰 보기", className: ["FindReview__filter"] }),
            React.createElement(Link, { to: "/new" },
                React.createElement(Button, { text: "\uB9AC\uBDF0 \uC791\uC131", className: ["FindReview__new-review"] }))),
        React.createElement("div", { className: styles["search-wrapper"] },
            React.createElement("input", { value: text, onChange: onChange, className: styles["input--search"], placeholder: "\uB9AC\uBDF0 \uAC80\uC0C9" })),
        React.createElement("ul", { className: styles["review__list"] }, reviews === null || reviews === void 0 ? void 0 :
            reviews.map((review, i) => {
                const location = new window.kakao.maps.LatLng(review.location.Ma, review.location.La);
                if (filter === "ALL") {
                    if (text !== "") {
                        if (review.title.indexOf(text) === -1 &&
                            review.memo.indexOf(text) === -1 &&
                            review.address.address.indexOf(text) === -1 &&
                            review.address.roadAddress.indexOf(text) === -1) {
                            return null;
                        }
                    }
                }
                else if ((markerPos === null || markerPos === void 0 ? void 0 : markerPos.La) !== location.La &&
                    (markerPos === null || markerPos === void 0 ? void 0 : markerPos.Ma) !== location.Ma) {
                    return null;
                }
                return (React.createElement(Review, { location: location, review: review, key: review.id, selected: selected, setSelected: setSelected, i: i, searchReviewPos: searchReviewPos }));
            }),
            React.createElement("div", { className: styles["no-review"] },
                React.createElement("div", { style: { lineHeight: "23px" } }, "\uD574\uB2F9 \uC704\uCE58\uC5D0 \uB9AC\uBDF0\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4."),
                React.createElement("div", { style: { lineHeight: "23px" } }, "\uCCAB \uB9AC\uBDF0\uB97C \uB0A8\uACA8\uBCF4\uC138\uC694."))),
        React.createElement("footer", { className: styles.footer },
            "\u00A9 ",
            new Date().getFullYear(),
            ". RAREBEEF All Rights Reserved.")));
};
export default FindReview;
