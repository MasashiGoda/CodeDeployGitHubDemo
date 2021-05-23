var map;
var marker;
var marker_2;
var infoWindow;

var url = `data.json`

/*global navigator*/
/*global google*/

function initMap() {

  navigator.geolocation.getCurrentPosition(function(position) {
  
    alert("緯度:" + position.coords.latitude + ",経度" + position.coords.longitude);

    var myposition = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

    map = new google.maps.Map(document.getElementById("map"), {
      center: myposition,
      zoom: 10
    });

    $.getJSON(url, (data) => {
      console.log(`lat=${data.lat}, lng=${data.lng}, content=${data.content}`);

      var latlng = new google.maps.LatLng(data.lat, data.lng);

      marker = new google.maps.Marker({
        position: latlng,
        map: map
      });

      marker_2 = new google.maps.Marker({
        position: myposition,
        map: map,
        icon:'images/pos.png'
      });

      infoWindow = new google.maps.InfoWindow({
        content: `<div class="sample"><a href="${data.url}">${data.content}</a></div>`
      });

      marker.addListener('click', function() {
        infoWindow.open(map, marker);
      });
    });
  },
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
