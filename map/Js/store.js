var list_url = "./Json/list.json"

$(function() {
    //data/sample.jsonのデータを取得し、jsonというオブジェクトに入れる
    $.getJSON(list_url, function(data) {
        var rows = "";

        //テーブルとして表示するため、htmlを構築
        for (let i = 0; i < data.length; i++) {
            rows += "<tr>";
            rows += "<td>";
            rows += data[i].name;
            rows += "</td>";
            rows += "<td>";
            rows += data[i].address;
            rows += "</td>";
            rows += "<td>";
            rows += data[i].tell;
            rows += "</td>";
            rows += "</tr>";
        }

        //テーブルに作成したhtmlを追加する
        $("#tbl").append(rows);
    });
});
