var map;
var marker = [];
var marker_cl;
var infoWindow = [];
var myposition;
var list_url = "./Json/list.json"
var city_url = "./Json/city.json"

/*global navigator*/
/*global google*/

/*チェックボックスを確認する関数*/
function confirmCheckBox(tmp_type) {

  for (var i = 0; i < document.form1.store_type.length; i++) {
    if (document.form1.store_type[i].checked && document.form1.store_type[i].value == tmp_type) {
      return true;
    }
    else {}
  }

  return false;

}

/*地図を更新する関数*/
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
        content: `<div class="sample"><a href="${data[step].url}" target="_blank" rel="noopener noreferrer">${data[step].name}</a><p>${data[step].tell}</p><p>${data[step].address}</p></div>`
      });

      marker[step].addListener('click', function() {
        infoWindow[step].open(map, marker[step]);
      });

    }
  });
}

/*マーカーを初期化する関数*/
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

/*地図を初期化する関数*/
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

/*地図を更新するjQuery*/
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

/*地図の中心を更新する関数*/
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

/*地図の中心を更新するjQuery*/
$(function() {
  $('select[name="town"]').change(function() {

    updateCenter();

  });
})

/*店舗を検索するjQuery*/
$(function() {
  searchWord = function() {
    var searchResult,
      searchResult_ed,
      searchText = $(this).val(), // 検索ボックスに入力された値
      targetText,
      hitNum;

    // 検索結果を格納するための配列を用意
    searchResult = [];
    
    // 検索対象を店名、住所、電話番号に指定
    targetText = [];
    
    // 検索結果エリアの表示を空にする
    $('#search-result__list').empty();
    $('.search-result__hit-num').empty();

    // 検索ボックスに値が入ってる場合
    if (searchText != '') {
      $.ajaxSetup({async: false});
      $.getJSON(list_url, (data) => {

        for (let step = 0; step < data.length; step++) {
          targetText[0] = data[step].name
          targetText[1] = data[step].address
          targetText[2] = data[step].tell
          if (targetText[0].indexOf(searchText) != -1) {
            searchResult.push(targetText.concat())
          }
        }
      });
      $.ajaxSetup({async: true});
      // 検索結果をページに出力
      for (var i = 0; i < searchResult.length; i++) {
        searchResult_ed = '<tr>';
        for (var j = 0; j < 3; j++){
          searchResult_ed = searchResult_ed + '<td>' + searchResult[i][j] + '</td>'
        }
        searchResult_ed = searchResult_ed + '</tr>';
        $(searchResult_ed).appendTo('#search-result__list');
        // $('<span>').text(searchResult[i]).appendTo('#search-result__list');
      }

      // ヒットの件数をページに出力
      hitNum = '<span>検索結果</span>：' + searchResult.length + '件見つかりました。';
      $('.search-result__hit-num').append(hitNum);
    }
  };

  // searchWordの実行
  $('#search-text').on('input', searchWord);
});
