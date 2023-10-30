import React from 'react';
import { useCallback, useEffect, useState } from "react";
import { authService, dbService } from "../fbase";
import { deleteUser, onAuthStateChanged, sendPasswordResetEmail, updateProfile, } from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import Button from "../components/Button";
import { doc, setDoc } from "firebase/firestore";
import Review from "../components/Review";
import { useNavigate } from "react-router-dom";
import styles from "./Profile.module.scss";
import classNames from "classnames";
import { setLogin } from "../redux/modules/loginProcess";
const Profile = () => {
    const testerId = "zlD5h6Lw4obUlrBM4EthJbw9OXh2";
    const { loginProcess: { userObj }, getReviews: { reviews: allReviews }, } = useSelector((state) => state);
    const dispatch = useDispatch();
    const [myReviews, setMyReviews] = useState([]);
    const [displayName, setDisplayName] = useState("");
    const [emailCheck, setEmailCheck] = useState("");
    const [alert, setAlert] = useState("");
    const navigate = useNavigate();
    // 닉네임 입력
    const ondisplayNameChange = useCallback((e) => {
        setDisplayName(e.target.value);
    }, []);
    // 이메일 입력
    const onEmailCheckChange = useCallback((e) => {
        setEmailCheck(e.target.value);
    }, []);
    // 닉네임 변경 클릭
    const onDisplayNameChangeClick = useCallback((e) => {
        e.preventDefault();
        // 오류 출력 or 변경 실행
        if (authService.currentUser) {
            if (authService.currentUser.uid === testerId) {
                window.alert("테스트 계정의 정보는 변경하실 수 없습니다.");
                return;
            }
            else if (displayName === "") {
                setAlert("닉네임을 입력해주세요.");
            }
            else if (displayName === userObj.displayName) {
                setAlert("닉네임에 변경 사항이 없습니다.");
            }
            else if (displayName.length < 2 || displayName.length > 12) {
                setAlert("닉네임은 2자 이상 12자 이하만 가능합니다.");
            }
            else if (displayName !== "") {
                try {
                    updateProfile(authService.currentUser, {
                        displayName,
                    });
                    myReviews.forEach((review) => {
                        if (review.displayName !== displayName) {
                            setDoc(doc(dbService, "reviews", review.id), Object.assign(Object.assign({}, review), { displayName }));
                        }
                    });
                    setAlert("닉네임이 변경되었습니다.");
                    onAuthStateChanged(authService, (user) => {
                        if (user) {
                            dispatch(setLogin(true, {
                                displayName,
                                uid: user.uid,
                            }));
                        }
                        else {
                            dispatch(setLogin(false, {}));
                        }
                    });
                }
                catch (error) {
                    setAlert(error);
                }
            }
        }
    }, [dispatch, displayName, myReviews, userObj.displayName]);
    // 비밀번호 재설정 메일 발송
    const onResetPwClick = useCallback(async (e) => {
        e.preventDefault();
        if (authService.currentUser) {
            if (authService.currentUser.uid === testerId) {
                window.alert("테스트 계정의 정보는 변경하실 수 없습니다.");
                return;
            }
            else if (emailCheck.length === 0) {
                setAlert("이메일을 입력해주세요.");
            }
            else if (authService.currentUser.email !== emailCheck) {
                setAlert("이메일이 일치하지 않습니다.");
            }
            else {
                try {
                    sendPasswordResetEmail(authService, emailCheck).then(() => {
                        setAlert("메일이 발송되었습니다.");
                    });
                }
                catch (error) {
                    setAlert(error);
                }
            }
        }
    }, [emailCheck]);
    // 회원 탈퇴
    const onDeleteClick = useCallback(async () => {
        if (!authService.currentUser)
            return;
        if (authService.currentUser.uid === testerId) {
            window.alert("테스트 계정의 정보는 변경하실 수 없습니다.");
            return;
        }
        const ok = window.confirm("정말 탈퇴하시겠습니까?\n작성한 글은 삭제되지 않습니다.");
        if (ok && authService.currentUser) {
            await deleteUser(authService.currentUser)
                .then(() => {
                navigate("/");
            })
                .catch((error) => {
                setAlert(error);
            });
        }
    }, [navigate]);
    // 로그아웃
    const onLogOutClick = () => {
        authService.signOut();
        navigate("/");
    };
    // 내가 작성한 리뷰만 추려서 저장
    useEffect(() => {
        if (userObj.uid === undefined || allReviews.length === 0) {
            return;
        }
        setMyReviews(allReviews.filter((review) => review.creatorId === userObj.uid));
    }, [allReviews, navigate, userObj.uid]);
    return (React.createElement("div", { className: styles.container },
        React.createElement("div", { className: styles["edit-profile-wrapper"] },
            React.createElement("h2", { className: styles["edit-profile-header"] }, "\uD504\uB85C\uD544 \uC218\uC815"),
            React.createElement("div", { className: styles.alert }, alert),
            React.createElement("form", { className: styles["display-name-wrapper"] },
                React.createElement("h3", { className: styles["form-header"] }, "\uB2C9\uB124\uC784 \uBCC0\uACBD"),
                React.createElement("input", { placeholder: userObj.displayName, value: displayName, onChange: ondisplayNameChange, maxLength: 12, minLength: 2, className: classNames(styles["input--display-name"], styles.input) }),
                React.createElement(Button, { text: "\uBCC0\uACBD", onClick: onDisplayNameChangeClick, className: ["Profile__display-name"] })),
            React.createElement("form", { className: styles["password-wrapper"] },
                React.createElement("h3", { className: styles["form-header"] }, "\uBE44\uBC00\uBC88\uD638 \uC7AC\uC124\uC815"),
                React.createElement("input", { className: classNames(styles["input--email"], styles.input), placeholder: "email", value: emailCheck, onChange: onEmailCheckChange, type: "email" }),
                React.createElement(Button, { text: "\uC7AC\uC124\uC815 \uBA54\uC77C \uBC1C\uC1A1", onClick: onResetPwClick, className: ["Profile__password"] })),
            React.createElement("div", { className: styles["btn-wrapper"] },
                React.createElement(Button, { text: "\uD68C\uC6D0 \uD0C8\uD1F4", onClick: onDeleteClick, className: ["Profile__delete-account"] }),
                React.createElement(Button, { text: "\uB85C\uADF8\uC544\uC6C3", onClick: onLogOutClick, className: ["Profile__log-out"] }))),
        React.createElement("hr", { className: styles.line }),
        React.createElement("div", { className: styles["my-review-wrapper"] },
            React.createElement("h2", { className: styles["my-review-header"] }, "\uB0B4\uAC00 \uC4F4 \uB9AC\uBDF0"),
            myReviews.length === 0 && (React.createElement("div", { className: styles["zero"] }, "\uC791\uC131\uD55C \uB9AC\uBDF0\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4.")),
            React.createElement("ul", { className: styles["my-review-list"] }, myReviews.map((review) => {
                const location = new window.kakao.maps.LatLng(review.location.Ma, review.location.La);
                return (React.createElement(Review, { key: review.id, location: location, review: review, isProfile: true }));
            }))),
        React.createElement("footer", { className: styles.footer },
            "\u00A9 ",
            new Date().getFullYear(),
            ". RAREBEEF All Rights Reserved.")));
};
export default Profile;
