import styles from "./Search.module.scss";
import classNames from "classnames";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentPos, setMarkerPos } from "../redux/modules/getMap";
import { Routes, Route } from "react-router-dom";
import FindReview from "./FindReview";
import WriteReview from "./WriteReview";
import Button from "./Button";
import SearchResult from "./SearchResult";
import { setFilter } from "../redux/modules/getReviews";
const Search = () => {
    const dispatch = useDispatch();
    const { loading, data: { map, places, geocoder }, currentPos, } = useSelector((state) => state.getMap);
    const [searchText, setSearchText] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [isZero, setIsZero] = useState(true);
    const [error, setError] = useState(false);
    const [pagination, setPagination] = useState({
        nextClick: () => { },
        prevClick: () => { },
        totalCount: 0,
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [selected, setSelected] = useState({ section: null, index: null });
    const listElRef = useRef(null);
    // 검색 콜백
    // 검색 결과(검색 내용, 내용 없음, 검색 실패)를 처리하고 페이지네이션 생성
    const searchCallback = useCallback((result, status, pagination) => {
        if (status === window.kakao.maps.services.Status.OK) {
            setError(false);
            setIsZero(false);
            setSearchResult(result);
        }
        else if (status === window.kakao.maps.services.Status.ZERO_RESULT) {
            setError(false);
            setIsZero(true);
            setSearchResult([]);
        }
        else {
            setSearchResult([]);
            setError(true);
            setIsZero(false);
        }
        setPagination({
            nextClick: () => {
                if (pagination.hasNextPage) {
                    setSelected({ section: null, index: null });
                    setCurrentPage((prevState) => prevState + 1);
                    pagination.nextPage();
                    listElRef.current.scrollTo({ top: 0, behavior: "smooth" });
                }
            },
            prevClick: () => {
                if (pagination.hasPrevPage) {
                    setSelected({ section: null, index: null });
                    setCurrentPage((prevState) => prevState - 1);
                    pagination.prevPage();
                    listElRef.current.scrollTo({ top: 0, behavior: "smooth" });
                }
            },
            totalCount: pagination.totalCount,
        });
    }, []);
    // 검색 실행
    const search = useCallback((keyword) => {
        places.keywordSearch(keyword, searchCallback, {
            location: currentPos,
        });
    }, [places, searchCallback, currentPos]);
    // 검색어 Submit
    const onSubmit = useCallback((e) => {
        e.preventDefault();
        setCurrentPage(1);
        setSelected({ section: null, index: null });
        if (searchText === "") {
            map.setCenter(currentPos);
            dispatch(setMarkerPos(currentPos));
        }
        else if (searchText !== "") {
            search(searchText);
        }
    }, [searchText, map, currentPos, dispatch, search]);
    // 검색어 입력
    const onKeywordChange = useCallback((e) => {
        e.preventDefault();
        setSearchText(e.target.value);
    }, []);
    // 현위치 클릭 시 처리할 로직
    const searchAndMove = useCallback((location) => {
        map.setCenter(location);
        dispatch(setMarkerPos(location));
        setCurrentPage(1);
        setSelected({ section: "place", index: 0 });
        dispatch(setFilter("HERE"));
        if (Object.keys(geocoder).length !== 0 && location !== null) {
            geocoder.coord2Address(location.getLng(), location.getLat(), (result, status) => {
                if (status === window.kakao.maps.services.Status.OK) {
                    search(result[0].address.address_name);
                    setSearchText(result[0].address.address_name);
                }
            });
        }
    }, [dispatch, geocoder, search, map]);
    // 현위치 버튼 클릭 핸들러
    // 위치 정보에 액세스 시도 및 성공 시 바로 위 함수 실행
    const onCurrentPosBtnClick = useCallback((e) => {
        e === null || e === void 0 ? void 0 : e.preventDefault();
        if (currentPos === null) {
            const ok = window.confirm("사용자의 위치 정보를 사용하게 됩니다.\n최초 실행 시 몇 초 정도 시간이 소요될 수 있습니다.\n\n(작동하지 않을 경우 브라우저 설정에서 위치 정보 액세스 차단 여부를 확인해 주세요.)");
            if (ok) {
                window.navigator.geolocation.getCurrentPosition(async (pos) => {
                    try {
                        const location = new window.kakao.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
                        dispatch(setCurrentPos(location));
                        searchAndMove(location);
                    }
                    catch (error) {
                        console.log(error);
                    }
                });
            }
            else {
                return;
            }
        }
        else {
            searchAndMove(currentPos);
        }
    }, [currentPos, dispatch, searchAndMove]);
    // 현위치 정보가 있으면 컴포넌트가 마운트될 때 현위치로 이동
    useEffect(() => {
        if (Object.keys(geocoder).length !== 0 && currentPos !== null) {
            onCurrentPosBtnClick();
        }
    }, [currentPos, geocoder, onCurrentPosBtnClick]);
    // 지도 드래그 이벤트
    // 드래그가 종료될 때 지도 중심 위치 검색
    useEffect(() => {
        const dragCallback = () => {
            const location = map.getCenter();
            geocoder.coord2Address(location.getLng(), location.getLat(), (result, status) => {
                if (status === window.kakao.maps.services.Status.OK) {
                    setSelected({ section: null, index: null });
                    setCurrentPage(1);
                    search(result[0].address.address_name);
                    setSearchText(result[0].address.address_name);
                    dispatch(setMarkerPos(location));
                }
            });
        };
        if (Object.keys(map).length !== 0) {
            window.kakao.maps.event.addListener(map, "dragend", dragCallback);
        }
    }, [dispatch, geocoder, search, map]);
    // 리뷰 위치 검색(리뷰 클릭 시 실행)
    const searchReviewPos = useCallback((location, i) => {
        geocoder.coord2Address(location.getLng(), location.getLat(), (result, status) => {
            if (status === window.kakao.maps.services.Status.OK) {
                setSelected({ section: "review", index: i });
                setCurrentPage(1);
                search(result[0].address.address_name);
                setSearchText(result[0].address.address_name);
            }
        });
    }, [geocoder, search]);
    return (React.createElement("div", { className: classNames(styles.container, loading && styles.loading) },
        React.createElement("form", { className: styles.form, onSubmit: onSubmit },
            React.createElement("input", { className: classNames(styles["input--search"]), type: "text", value: searchText, onChange: onKeywordChange, placeholder: "\uC7A5\uC18C \uAC80\uC0C9" }),
            React.createElement("div", { className: styles["btn-wrapper"] },
                React.createElement(Button, { text: "\uAC80\uC0C9", className: ["Search__search"] }),
                React.createElement(Button, { onClick: onCurrentPosBtnClick, text: "\uD604\uC704\uCE58", className: ["Search__current-pos"] }))),
        React.createElement("div", { className: styles["result"] },
            error ? (React.createElement("div", { className: styles["result__error"] }, "\uC624\uB958\uAC00 \uBC1C\uC0DD\uD588\uC2B5\uB2C8\uB2E4. \uC7A0\uC2DC \uD6C4 \uB2E4\uC2DC \uC2DC\uB3C4\uD574\uC8FC\uC138\uC694.")) : isZero ? (React.createElement("div", { className: styles["result__zero"] }, "\uAC80\uC0C9 \uACB0\uACFC\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4.")) : (React.createElement("ul", { className: styles["result__list"], ref: listElRef }, searchResult.map((el, i) => (React.createElement(SearchResult, { key: i, i: i, selected: selected, setSelected: setSelected, place: el }))))),
            React.createElement("div", { className: styles["result__pagination"] },
                React.createElement(Button, { onClick: pagination.prevClick, text: "prev", className: ["Search__prev"] }),
                React.createElement("span", { className: styles["pagination__count"] },
                    currentPage,
                    " /",
                    " ",
                    Math.ceil(pagination.totalCount / 15) === 0
                        ? 1
                        : Math.ceil(pagination.totalCount / 15)),
                React.createElement(Button, { onClick: pagination.nextClick, text: "next", className: ["Search__next"] }))),
        React.createElement(Routes, null,
            React.createElement(Route, { path: "/", element: React.createElement(FindReview, { onCurrentPosBtnClick: onCurrentPosBtnClick, selected: selected, setSelected: setSelected, searchReviewPos: searchReviewPos }) }),
            React.createElement(Route, { path: "/new", element: React.createElement(WriteReview, { searchResult: searchResult, selected: selected }) }))));
};
export default Search;
