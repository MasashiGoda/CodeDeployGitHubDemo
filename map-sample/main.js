

var map;
var marker = [];
var marker_cl;
var infoWindow = [];
var myposition;
var url = `list.json`

/*global navigator*/
/*global google*/

function updateMap() {

  $.getJSON(url, (data) => {
    console.log(`lat=${data[0].lat}, lng=${data[0].lng}, name=${data[0].name}`);

    var latlng;

    for (let step = 0; step < data.length; step++) {

      latlng = new google.maps.LatLng(data[step].lat, data[step].lng);

      marker[step] = new google.maps.Marker({
        position: latlng,
        map: map
      });

      infoWindow[step] = new google.maps.InfoWindow({
        content: `<div class="sample"><a href="${data[step].url}">${data[step].name}</a><p>${data[step].tell}</p><p>${data[step].address}</p></div>`
      });

      marker[step].addListener('click', function() {
        infoWindow[step].open(map, marker[step]);
      });
    }
  });
}

/* マップを初期化して表示する */
function initMap() {

  navigator.geolocation.getCurrentPosition(function(position) {

      alert("緯度:" + position.coords.latitude + ",経度" + position.coords.longitude);

      myposition = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

      map = new google.maps.Map(document.getElementById("map"), {
        center: myposition,
        zoom: 10
      });

      marker_cl = new google.maps.Marker({
        position: myposition,
        map: map,
        icon: 'images/pos.png'
      });

      updateMap();

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

      //現在地が取得できない場合は県庁所在地を中心とする
      myposition = new google.maps.LatLng(35.2820, 133.0302);

      map = new google.maps.Map(document.getElementById("map"), {
        center: myposition,
        zoom: 10
      });

      updateMap();

    }
  );

}

$(function() {
  $('input[name="store_type"]').change(function() {
    alert('test');
    console.log("test");
  });
});
