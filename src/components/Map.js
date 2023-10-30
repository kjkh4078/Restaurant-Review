import React, { useEffect, useRef } from "react";
import { useState } from "react";
import styles from "./Map.module.scss";
import classNames from "classnames";
import { useDispatch, useSelector } from "react-redux";
import { getMapThunk } from "../redux/modules/getMap";
import Loading from "../pages/Loading";
import markerImg from "../images/marker100.png";
const Map = () => {
    const dispatch = useDispatch();
    const { loading, data: { map, geocoder }, markerPos, currentPos, error, } = useSelector((state) => state.getMap);
    const [marker, setMarker] = useState();
    const [crossActive, setCrossActive] = useState(false);
    const [currentAddress, setCurrentAddress] = useState({
        address: "",
        roadAddress: "",
    });
    const [markerAddress, setMarkerAddress] = useState({
        address: "",
        roadAddress: "",
    });
    const [infoWindow, setInfoWindow] = useState(null);
    const mapEl = useRef(null);
    useEffect(() => {
        if (error) {
            window.alert(error);
        }
    }, [error]);
    useEffect(() => {
        // 현위치 데이터 존재할 경우 주소로 변환하여 저장 (지도에 띄울 용도)
        if (Object.keys(geocoder).length !== 0) {
            if (currentPos !== null) {
                geocoder.coord2Address(currentPos.getLng(), currentPos.getLat(), (result, status) => {
                    var _a;
                    if (status === window.kakao.maps.services.Status.OK) {
                        setCurrentAddress({
                            address: result[0].address.address_name,
                            roadAddress: (_a = result[0].road_address) === null || _a === void 0 ? void 0 : _a.address_name,
                        });
                    }
                });
            }
            // 마커 위치 데이터 존재할 경우 주소로 변환하여 저장(인포윈도우 용도)
            if (markerPos !== null) {
                geocoder.coord2Address(markerPos.getLng(), markerPos.getLat(), (result, status) => {
                    var _a;
                    if (status === window.kakao.maps.services.Status.OK) {
                        setMarkerAddress({
                            address: result[0].address.address_name,
                            roadAddress: (_a = result[0].road_address) === null || _a === void 0 ? void 0 : _a.address_name,
                        });
                    }
                });
            }
        }
    }, [currentPos, geocoder, markerPos]);
    // 카카오맵 api 불러오기
    useEffect(() => {
        dispatch(getMapThunk(mapEl.current));
    }, [dispatch]);
    // 지도 드래그 이벤트 등록
    // 드래그 시작 시 인포윈도우 닫고 크로스헤어 활성화
    // 드래그 종료 시 크로스헤어 비활성화
    useEffect(() => {
        const dragStartCallback = () => {
            if (infoWindow !== null) {
                infoWindow.close();
            }
            setCrossActive(true);
        };
        const dragEndCallback = () => {
            setCrossActive(false);
        };
        if (Object.keys(map).length !== 0) {
            window.kakao.maps.event.addListener(map, "dragstart", dragStartCallback);
            window.kakao.maps.event.addListener(map, "dragend", dragEndCallback);
        }
    }, [infoWindow, map]);
    // 마커 위치 변경 시 기존 마커 제거 후 신규 마커 생성
    useEffect(() => {
        if (markerPos) {
            marker === null || marker === void 0 ? void 0 : marker.setMap(null);
            setMarker(new window.kakao.maps.Marker({
                map: map,
                position: markerPos,
            }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [map, markerPos]);
    // 마커에 인포윈도우 적용
    useEffect(() => {
        if (marker && markerAddress.address) {
            const iwContent = `<div class="infowindow">${markerAddress.address}</div>`;
            setInfoWindow(new window.kakao.maps.InfoWindow({
                content: iwContent,
            }));
            window.kakao.maps.event.addListener(marker, "mouseover", () => {
                infoWindow.open(map, marker);
            });
            window.kakao.maps.event.addListener(marker, "mouseout", () => {
                infoWindow.close();
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [map, markerPos, markerAddress]);
    // 마커 아이콘 적용
    useEffect(() => {
        const icon = new window.kakao.maps.MarkerImage(markerImg, new window.kakao.maps.Size(40, 48), {
            alt: "Place Review marker",
        });
        marker === null || marker === void 0 ? void 0 : marker.setImage(icon);
    }, [marker]);
    return (React.createElement("div", { className: classNames(styles.container) },
        currentAddress.address !== "" && (React.createElement("div", { className: styles["address"] },
            React.createElement("div", { className: styles["address__current"] },
                "\uB0B4 \uC704\uCE58 : ",
                currentAddress.address))),
        React.createElement("div", { ref: mapEl, id: "map", style: {
                width: "100vw",
                height: "calc(100vh - 60px)",
                minHeight: "640px",
                minWidth: "300px",
            } }, loading && React.createElement(Loading, null)),
        crossActive && React.createElement("div", { className: styles.cross }, "+")));
};
export default Map;
