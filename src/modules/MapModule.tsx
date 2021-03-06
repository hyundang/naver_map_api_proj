import { LatLngProps } from "@interfaces/index";
import { makeAddress } from "@libs/index";

declare global {
  interface Window {
    naver: any;
  }
}

const { naver } = window;

const mapOptions = {
  center: new naver.maps.LatLng(37.49360097791543, 127.01342259267902),
  zoom: 15,
};

interface MapModuleProps {
  mapContainer: React.MutableRefObject<null>;
  isClickPossible: boolean;
  latLng?: LatLngProps;
  onChangeUserCoord?: (x: string, y: string, address: string) => void;
}
const MapModule = ({
  mapContainer,
  latLng,
  isClickPossible,
  onChangeUserCoord,
}: MapModuleProps) => {
  // 지도 생성
  const map = new naver.maps.Map(mapContainer.current, mapOptions);
  // 마커 생성
  const marker = new naver.maps.Marker();
  // 인포 윈도우 생성
  const infowindow = new naver.maps.InfoWindow({ zindex: 1 }); // 클릭한 위치에 대한 주소를 표시할 인포윈도우입니다

  const setMarkerAndInfowindow = (latLng: any, content?: string) => {
    marker.setPosition(latLng);
    marker.setMap(map);
    infowindow.setContent(content || "");
    infowindow.open(map, marker);
    map.setCenter(latLng);
  };

  const convertCoordsToAddr = (status: any, response: any, latLng: any) => {
    // 좌표로 상세 주소 정보를 요청합니다
    if (status === naver.maps.Service.Status.ERROR) {
      return alert("주소 가져오기 실패!");
    }

    var items = response.v2.results,
      address = "",
      htmlAddresses = [];

    for (var i = 0, ii = items.length, item, addrType; i < ii; i++) {
      item = items[i];
      address = makeAddress(item) || "";
      addrType = item.name === "roadaddr" ? "[도로명 주소]" : "[지번 주소]";

      htmlAddresses.push(i + 1 + ". " + addrType + " " + address);
    }

    const content = [
      '<div style="padding:10px;min-width:200px;line-height:150%;">',
      '<h4 style="margin-top:5px;"margin-bottom:0px;>검색 좌표</h4><br />',
      htmlAddresses.join("<br />"),
      "</div>",
    ].join("\n");

    setMarkerAndInfowindow(latLng, content);
    onChangeUserCoord && onChangeUserCoord(latLng.x, latLng.y, address);
  };

  const getAndConvertCoordsToAddr = (latLng: any) => {
    const coords = new naver.maps.LatLng(latLng.y, latLng.x);
    naver.maps.Service.reverseGeocode(
      {
        coords,
        orders: [
          naver.maps.Service.OrderType.ADDR,
          naver.maps.Service.OrderType.ROAD_ADDR,
        ].join(","),
      },
      (status: any, response: any) =>
        convertCoordsToAddr(status, response, latLng)
    );
  };

  const handleClickMap = async (mouseEvent: any) => {
    const latLng = mouseEvent.coord;
    getAndConvertCoordsToAddr(latLng);
  };

  isClickPossible && naver.maps.Event.addListener(map, "click", handleClickMap);
  latLng && getAndConvertCoordsToAddr(latLng);
};

export default MapModule;
