var map;
var marker;
var infoWindow;
var center = {
  lat: 35.69,
  lng: 139.69
};
var test;

var url = `data.json`

// 現在地取得処理
function getPosition() {
  // Geolocation APIに対応している
  if (navigator.geolocation) {
    alert("この端末では位置情報が取得できます");
    // Geolocation APIに対応していない
  }
  else {
    alert("この端末では位置情報が取得できません");
  }

  // 現在地を取得
  navigator.geolocation.getCurrentPosition(
    // 取得成功した場合
    function(position) {
      alert("緯度:" + position.coords.latitude + ",経度" + position.coords.longitude);
      myposition.lat = position.coords.latitude;
      myposition.lng = position.coords.longitude;
    },
    // 取得失敗した場合
    function(error) {
      switch (error.code) {
        case 1: //PERMISSION_DENIED
          alert("位置情報の利用が許可されていません");
          break;
        case 2: //POSITION_UNAVAILABLE
          alert("現在位置が取得できませんでした");
          break;
        case 3: //TIMEOUT
          alert("タイムアウトになりました");
          break;
        default:
          alert("その他のエラー(エラーコード:" + error.code + ")");
          break;
      }
    }
  );
}

function initMap() {
  
  getPosition();
  
  map = new google.maps.Map(document.getElementById("map"), {
    center: center,
    zoom: 10
  });

  $.getJSON(url, (data) => {
    console.log(`lat=${data.lat}, lng=${data.lng}, content=${data.content}`);

    var latlng = new google.maps.LatLng(data.lat, data.lng);

    marker = new google.maps.Marker({
      position: latlng,
      map: map
    });

    infoWindow = new google.maps.InfoWindow({
      content: `<div class="sample"><a href="${data.url}">${data.content}</a></div>`
    });

    marker.addListener('click', function() {
      infoWindow.open(map, marker);
    });

  });

}
