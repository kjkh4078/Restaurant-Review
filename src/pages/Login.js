import React from 'react';
import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { setLogin } from "../redux/modules/loginProcess";
import { authService } from "../fbase";
import { createUserWithEmailAndPassword, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup, } from "firebase/auth";
import Button from "../components/Button";
import { GoogleAuthProvider } from "firebase/auth";
import styles from "./Login.module.scss";
import logo from "../images/logo.png";
const Login = () => {
    const dispatch = useDispatch();
    const [formAction, setFormAction] = useState("login");
    const [alert, setAlert] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordCheck, setPasswordCheck] = useState("");
    // 이메일 입력
    const onEmailChange = useCallback((e) => {
        setEmail(e.target.value);
    }, []);
    // 비밀번호 입력
    const onPasswordChange = useCallback((e) => {
        setPassword(e.target.value);
    }, []);
    // 비밀번호 확인 입력
    const onPasswordCheckChange = useCallback((e) => {
        setPasswordCheck(e.target.value);
    }, []);
    // 모드 변경(로그인 / 회원가입)
    const onFormChangeClick = useCallback((e) => {
        e.preventDefault();
        if (formAction === "login") {
            setFormAction("signUp");
        }
        else {
            setFormAction("login");
        }
    }, [formAction]);
    // 비밀번호 재설정 버튼 클릭
    const onFindPwBtnClick = useCallback((e) => {
        e.preventDefault();
        setFormAction("findPw");
    }, []);
    // 소셜 로그인 클릭(리다이렉트)
    const onGoogleClick = useCallback((e) => {
        e.preventDefault();
        const provider = new GoogleAuthProvider();
        signInWithPopup(authService, provider);
    }, []);
    // 전송
    const onSubmit = useCallback(async (e) => {
        e.preventDefault();
        // 로그인
        if (formAction === "login") {
            let isTest = false;
            if (email.length === 0) {
                setAlert("이메일을 입력해주세요.");
                return;
            }
            else if (password.length === 0) {
                setAlert("비밀번호를 입력해주세요.");
                return;
            }
            if (email === "test" && password === "test") {
                isTest = true;
            }
            await signInWithEmailAndPassword(authService, isTest ? "test@test.com" : email, isTest ? "test@test.com" : password)
                .then((userCredential) => {
                const user = userCredential.user;
                dispatch(setLogin(true, {
                    displayName: user.displayName ? user.displayName : "익명",
                    uid: user.uid,
                }));
            })
                .catch((error) => {
                if (error.code === "auth/invalid-email") {
                    setAlert("유효하지 않은 이메일입니다.");
                }
                else if (error.code === "auth/wrong-password") {
                    setAlert("비밀번호를 잘못 입력하셨습니다.");
                }
                else {
                    setAlert(error.message);
                }
            });
            // 회원가입
        }
        else if (formAction === "signUp") {
            if (email.length === 0) {
                setAlert("이메일을 입력해주세요.");
                return;
            }
            else if (password.length === 0) {
                setAlert("비밀번호를 입력해주세요.");
                return;
            }
            else if (passwordCheck.length === 0) {
                setAlert("비밀번호 확인을 입력해주세요.");
                return;
            }
            else if (passwordCheck !== password) {
                setAlert("비밀번호 확인이 일치하지 않습니다.");
                return;
            }
            await createUserWithEmailAndPassword(authService, email, password)
                .then((userCredential) => {
                const user = userCredential.user;
                dispatch(setLogin(true, {
                    displayName: user.displayName ? user.displayName : "익명",
                    uid: user.uid,
                }));
            })
                .catch((error) => {
                if (error.code === "auth/invalid-email") {
                    setAlert("유효하지 않은 이메일입니다.");
                }
                else if (error.code === "auth/weak-password") {
                    setAlert("비밀번호는 최소 6자 이상이어야 합니다.");
                }
                else if (error.code === "auth/email-already-in-use") {
                    setAlert("이미 사용 중인 이메일입니다.");
                }
                else {
                    setAlert(error.message);
                }
            });
            // 비밀번호 재설정
        }
        else if (formAction === "findPw") {
            await sendPasswordResetEmail(authService, email)
                .then(() => {
                setAlert("메일이 발송되었습니다.");
            })
                .catch((error) => {
                if (error.code === "auth/missing-email") {
                    setAlert("이메일을 입력해주세요.");
                }
                else if (error.code === "auth/invalid-email") {
                    setAlert("유효하지 않은 이메일입니다.");
                }
            });
        }
    }, [email, password, dispatch, formAction, passwordCheck]);
    return (React.createElement("div", { className: styles.container },
        React.createElement("div", { className: styles["logo-wrapper"] },
            React.createElement("img", { className: styles.logo, src: logo, alt: "Place review" })),
        React.createElement("form", { onSubmit: onSubmit, className: styles.form },
            React.createElement("input", { className: styles["input--email"], type: "text", onChange: onEmailChange, placeholder: "\uC774\uBA54\uC77C", autoComplete: "email" }),
            formAction !== "findPw" && (React.createElement("input", { className: styles["input--password"], type: "password", onChange: onPasswordChange, autoComplete: "current-password", placeholder: "\uBE44\uBC00\uBC88\uD638" })),
            formAction === "signUp" && (React.createElement("input", { className: styles["input--password-check"], type: "password", value: passwordCheck, onChange: onPasswordCheckChange, autoComplete: "current-password", placeholder: "\uBE44\uBC00\uBC88\uD638 \uD655\uC778" })),
            React.createElement("div", { className: styles.alert }, alert),
            React.createElement(Button, { className: ["Login__submit"], text: formAction === "login"
                    ? "로그인"
                    : formAction === "findPw"
                        ? "재설정 메일 발송"
                        : "회원가입" })),
        React.createElement("div", { className: styles["btn-wrapper"] },
            React.createElement(Button, { text: formAction === "login" ? "회원가입" : "돌아가기", onClick: onFormChangeClick, className: ["Login__form-change"] }),
            React.createElement(Button, { onClick: onFindPwBtnClick, text: "\uBE44\uBC00\uBC88\uD638 \uC7AC\uC124\uC815", className: ["Login__reset-pw"] }),
            React.createElement("div", { className: styles["social"] },
                React.createElement(Button, { text: "Continue with Google", onClick: onGoogleClick, className: ["Login__google"] }))),
        React.createElement("footer", { className: styles.footer },
            "\u00A9 ",
            new Date().getFullYear(),
            ". RAREBEEF All Rights Reserved.")));
};
export default Login;
