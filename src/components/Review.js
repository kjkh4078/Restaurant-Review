import React from 'react';
import classNames from "classnames";
import { deleteDoc, doc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { dbService, storageService } from "../fbase";
import { setMarkerPos } from "../redux/modules/getMap";
import Button from "./Button";
import WriteReview from "./WriteReview";
import styles from "./Review.module.scss";
const Review = ({ location, review, selected, setSelected, i, isProfile, searchReviewPos, }) => {
    const dispatch = useDispatch();
    const { getMap: { data: { map }, }, loginProcess: { userObj }, } = useSelector((state) => state);
    const [isEditMod, setIsEditMod] = useState(false);
    // 리뷰 삭제
    // 사진 있으면 스토리지에서 사진도 찾아서 삭제
    const onDeleteClick = useCallback(async (e, review) => {
        e.preventDefault();
        const ok = window.confirm("삭제하시겠습니까?");
        if (ok) {
            await deleteDoc(doc(dbService, `reviews/${review.id}`));
            if (review.attachmentUrl !== "") {
                const attachmentRef = ref(storageService, `${userObj.uid}/${review.attachmentId}`);
                await deleteObject(attachmentRef);
            }
        }
    }, [userObj.uid]);
    // 리뷰 수정
    const onEditClick = useCallback((e, review) => {
        e.preventDefault();
        setIsEditMod(true);
    }, []);
    // 선택 항목이 변경될 경우 수정모드 종료
    useEffect(() => {
        if (selected && (selected.section !== "review" || selected.index !== i)) {
            setIsEditMod(false);
        }
    }, [i, selected]);
    return (React.createElement("li", { className: classNames(styles.review, (selected === null || selected === void 0 ? void 0 : selected.section) === "review" &&
            selected.index === i &&
            styles.selected, isProfile && styles["profile-page"], isEditMod && styles["edit-mod"]), onClick: () => {
            if (!map.setCenter) {
                return;
            }
            else {
                if (setSelected) {
                    setSelected({ section: "review", index: i });
                }
                dispatch(setMarkerPos(location));
                map.setCenter(location);
                if (searchReviewPos) {
                    searchReviewPos(location, i);
                }
            }
        } }, isEditMod ? (React.createElement(WriteReview, { isEditMod: isEditMod, setIsEditMod: setIsEditMod, prevReview: review, selected: selected, i: i })) : (React.createElement(React.Fragment, null,
        React.createElement("div", { className: styles["review__header"] },
            React.createElement("span", { className: styles["header__title"] }, review.title),
            React.createElement("span", { className: styles["header__rating"] },
                React.createElement("span", { className: "fa fa-star", style: {
                        color: review.rating >= 1 ? "#eb5e28" : "lightgray",
                    } }),
                React.createElement("span", { className: "fa fa-star", style: {
                        color: review.rating >= 2 ? "#eb5e28" : "lightgray",
                    } }),
                React.createElement("span", { className: "fa fa-star", style: {
                        color: review.rating >= 3 ? "#eb5e28" : "lightgray",
                    } }),
                React.createElement("span", { className: "fa fa-star", style: {
                        color: review.rating >= 4 ? "#eb5e28" : "lightgray",
                    } }),
                React.createElement("span", { className: "fa fa-star", style: {
                        color: review.rating >= 5 ? "#eb5e28" : "lightgray",
                    } }))),
        React.createElement("div", { className: styles["review__address"] },
            React.createElement("div", { className: styles["address__address"] }, review.address.address),
            React.createElement("div", { className: styles["address__road-address"] }, review.address.roadAddress)),
        review.memo.length + review.attachmentUrl.length !== 0 && (React.createElement(React.Fragment, null,
            React.createElement("hr", { className: styles.line }),
            React.createElement("div", { className: styles["review__content"] },
                React.createElement("p", { className: styles["review__memo"] }, review.memo),
                review.attachmentUrl && (React.createElement("img", { className: styles["review__photo"], src: review.attachmentUrl, alt: review.attachmentUrl }))),
            React.createElement("hr", { className: styles.line }))),
        React.createElement("div", { className: styles["review__footer"] },
            React.createElement("span", { className: styles["footer__date"] },
                new Date(review.createdAt).getFullYear().toString().slice(-2),
                "/",
                ("0" + (new Date(review.createdAt).getMonth() + 1))
                    .toString()
                    .slice(-2),
                "/",
                ("0" + new Date(review.createdAt).getDate())
                    .toString()
                    .slice(-2),
                " ",
                ("0" + new Date(review.createdAt).getHours()).slice(-2),
                ":",
                ("0" + new Date(review.createdAt).getMinutes()).slice(-2)),
            React.createElement("span", { className: styles["footer__author"] }, review.displayName),
            (userObj.uid === review.creatorId ||
                userObj.uid === "oieGlxRf5zXW1JzXxpiY1DAskDF3") && (React.createElement("div", { className: styles["creator-btn-wrapper"] },
                React.createElement(Button, { text: "\uC218\uC815", onClick: (e) => {
                        onEditClick(e, review);
                    }, className: ["Review__edit"] }),
                React.createElement(Button, { text: "\uC0AD\uC81C", onClick: (e) => {
                        onDeleteClick(e, review);
                    }, className: ["Review__delete"] }))))))));
};
export default Review;
