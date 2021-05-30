var map;
var marker = [];
var marker_cl;
var infoWindow = [];
var myposition;
var list_url = "./Json/list.json"
var city_url = "./Json/city.json"

/*global navigator*/
/*global google*/

function confirmCheckBox(tmp_type) {

  for (var i = 0; i < document.form1.store_type.length; i++) {
    if (document.form1.store_type[i].checked && document.form1.store_type[i].value == tmp_type) {
      return true;
    }
    else {}
  }

  return false;

}

function updateMap() {

  $.getJSON(list_url, (data) => {

    for (let step = 0; step < data.length; step++) {

      if (data[step].etc == "error" || !confirmCheckBox(data[step].type)) {
        marker[step].setMap(null);
      }
      else {
        marker[step].setMap(map);
      }

      infoWindow[step] = new google.maps.InfoWindow({
        content: `<div class="sample"><a href="${data[step].url}">${data[step].name}</a><p>${data[step].tell}</p><p>${data[step].address}</p></div>`
      });

      marker[step].addListener('click', function() {
        infoWindow[step].open(map, marker[step]);
      });

    }
  });
}

function initMarker() {

  $.getJSON(list_url, (data) => {

    var latlng;

    for (let step = 0; step < data.length; step++) {

      latlng = new google.maps.LatLng(data[step].lat, data[step].lng);

      marker[step] = new google.maps.Marker({
        position: latlng,
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
        zoom: 16
      });

      marker_cl = new google.maps.Marker({
        position: myposition,
        map: map,
        icon: 'images/pos.png'
      });

      initMarker();

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
      myposition = new google.maps.LatLng(35.468187, 133.048594);

      map = new google.maps.Map(document.getElementById("map"), {
        center: myposition,
        zoom: 16
      });

      initMarker();

      updateMap();

    }
  );

}

$(function() {
  $('input[value="all"]').change(function() {

    var i;

    if (document.form1.store_type[0].checked) {
      for (i = 1; i < document.form1.store_type.length; i++) {
        document.form1.store_type[i].checked = true;
      }
    }
    else {
      for (i = 1; i < document.form1.store_type.length; i++) {
        document.form1.store_type[i].checked = false;
      }
    }
  });
  $('input[name="store_type"]').change(function() {
    updateMap();
  });
});

function updateCenter() {

  var num = document.form2.town.selectedIndex;
  var city_name = document.form2.town.options[num].value;

  $.getJSON(city_url, (data) => {

    for (let step = 0; step < data.length; step++) {
      var lng;
      var lat;
      var newposition;

      if (data[step].name == city_name) {
        lng = data[step].lng;
        lat = data[step].lat;
        newposition = new google.maps.LatLng(lat, lng);
        map.panTo(newposition);
      }
      else if ("" == city_name) {
        map.panTo(myposition);
      }
      else {}
    }
  });

}

$(function() {
  $('select[name="town"]').change(function() {

    updateCenter();

  });
})
