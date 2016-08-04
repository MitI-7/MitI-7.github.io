(function(global) {
    "use strict;"

    function read_file(url) {
        var xml_http = new XMLHttpRequest;
        xml_http.open("GET", url, false);
        xml_http.send();
        return xml_http.responseText;
    }

    function open_db() {
        return openDatabase('database', '1.0', 'displayName', 65536 * 10);
    }

    function create_table() {
        var db = open_db();
        db.transaction( function(tx) {
            tx.executeSql('DROP TABLE IF EXISTS topcoder');
            tx.executeSql('CREATE TABLE IF NOT EXISTS topcoder (rd INTEGER PRIMARY KEY, rd_name TEXT, rd_date TEXT,' +
                                                               'div2_level1_pm INTEGER, div2_level2_pm INTEGER, div2_level3_pm INTEGER, div1_level1_pm INTEGER, div1_level2_pm INTEGER, div1_level3_pm INTEGER,' +
                                                               'div2_level1_pm_name TEXT, div2_level2_pm_name TEXT, div2_level3_pm_name TEXT, div1_level1_pm_name TEXT, div1_level2_pm_name TEXT, div1_level3_pm_name TEXT,' +
                                                               'div2_level1_pm_accuracy REAL, div2_level2_pm_accuracy REAL, div2_level3_pm_accuracy REAL, div1_level1_pm_accuracy REAL, div1_level2_pm_accuracy REAL, div1_level3_pm_accuracy REAL,' +
                                                               'div2_level1_pm_status INTEGER, div2_level2_pm_status INTEGER, div2_level3_pm_status INTEGER, div1_level1_pm_status INTEGER, div1_level2_pm_status INTEGER, div1_level3_pm_status INTEGER)');
        });
    }

    function insert_data() {
        var db = open_db();
        db.transaction(function(tx) {
            var csv_data = read_file('./topcoder_data.csv');
            var tmp = csv_data.split('\n');
            for (var i = 0; i < tmp.length; ++i) {
                var k = tmp[i].split(",");
                if (k.length != 27) {
                    console.log("ERROR:", k);
                    continue;
                }
                for (var j = 0; j < k.length; ++j) {
                    if (k[j] == "None") {
                        k[j] = null;
                    }
                }

                tx.executeSql('INSERT OR REPLACE INTO topcoder VALUES (?, ?, ?,' +
                                                                      '?, ?, ?, ?, ?, ?,' +
                                                                      '?, ?, ?, ?, ?, ?,' +
                                                                      '?, ?, ?, ?, ?, ?,' +
                                                                      '?, ?, ?, ?, ?, ?);', k,

         			function(tx, res) {
		        	},
        			function(tx, error) {
		        	    console.log("error:" + error.message);
                        console.log(k);
        			});
            }
        });
    }

    function make_where_query() {
        var where_list = [];

        // 表示するStatusを入れる
        var status_list = [];
        for (var i = 0; i < form_conditions.checkbox_status.length; ++i) {
            var is_checked = form_conditions.checkbox_status[i].checked;
            var num = form_conditions.checkbox_status[i].value;
            status_list.push(is_checked ? num : -1);
        }
        console.log(status_list);
        for (var i = 0; i < 6; ++i) {
            where_list = where_list.concat(status_list);
        }

        // 表示するRoundを入れる
        var round_list = [];
        // SRM, TCO, TCC, OTHERの順番でくる
        for (var i = 0; i < form_conditions.checkbox_round.length; ++i) {
            var is_checked  = form_conditions.checkbox_round[i].checked;
            round_list.push(is_checked ? 1 : 0);
        }
        where_list = where_list.concat(round_list);

        // 表示するdateを入れる
        var start_cate = form_conditions.start_date.value;
        var end_date = form_conditions.end_date.value;
        if (start_cate && end_date && start_cate <= end_date) {
            where_list.push(start_cate);
            where_list.push(end_date);
        }
        else {
            where_list.push("0000-00-00");
            where_list.push("9999-99-99");
        }

        return where_list;
    }

    function make_pm_solved_date_dict() {
        var pm_solved_date = {};
        var csv_data = read_file('./pm_status.csv');
        var tmp = csv_data.split('\n');
        for (var i = 0; i < tmp.length; ++i) {
            var k = tmp[i].split(",");
            if (k.length != 3) {
                console.log("ERROR");
                continue;
            }
            pm_solved_date[k[0]] = k[2];
        }
        return pm_solved_date;
    }

    function make_td(pm, pm_name, accuracy, status) {
        if (pm == null) {
            return '<td bgcolor="F5F5F5">' + '-' + '</td>'
        }

        var td = '<td>';
        // accept
        if (status == 1) {
            td = '<td bgcolor="#98FB98">';
        }
        // wrong
        else if (status == 2) {
            td ='<td bgcolor="#FF6347">';
        }

        var problem_url = 'http://community.topcoder.com/stat?c=problem_statement&pm=' + pm;
        td += '<a href="' + problem_url + '" target="_blank">' + pm_name + '</a>';
        try {
            td += '<br>' + accuracy.toFixed(2) + '%';
            if (status) {
                td += '<br>' + pm_solved_date[pm];
            }
        }
        catch (e) {
            td += '<br>-%';
        }


        return td + '</td>'
    }

    function make_table(order_query) {
        var db = open_db();

        $('#all_table tbody').empty();

        db.transaction( function(trans) {
            var query = make_where_query();
            console.log(query);
            console.log(order_query);
            trans.executeSql("SELECT * FROM topcoder WHERE (   div2_level1_pm_status in (?, ?, ?) " +
                                                           "OR div2_level2_pm_status in (?, ?, ?) " +
                                                           "OR div2_level3_pm_status in (?, ?, ?) " +
                                                           "OR div1_level1_pm_status in (?, ?, ?) " +
                                                           "OR div1_level2_pm_status in (?, ?, ?) " +
                                                           "OR div1_level3_pm_status in (?, ?, ?) " +
                                                           ")" +
                                                           "AND" +
                                                           "(" +
                                                           "   (rd_name GLOB '*SRM*' AND ?) " +
                                                           "OR (rd_name GLOB '*TCO*' AND ?) " +
                                                           "OR (rd_name GLOB '*TCC*' AND ?) " +
                                                           "OR (NOT(rd_name GLOB '*SRM*' OR rd_name GLOB '*TCC*' OR rd_name GLOB '*TCO*') AND ?)" +
                                                           ") " +
                                                           "AND" +
                                                           "(" +
                                                           " ? <= rd_date AND rd_date <= ?" +
                                                           ")" + order_query,
                                                           query, function(trans, r) {
                var html = "";
                for(var i = 0; i < r.rows.length; i++) {
                    var item = r.rows.item(i);

                    html += '<tr>';

                    var round_url = 'https://community.topcoder.com/stat?c=round_overview&rd=' + item.rd;
                    var td = '<a href="' + round_url + '" target="_blank">' + item.rd_name + '</a>';

                    html += '<td>' + td + '</td>';

                    html += make_td(item.div2_level1_pm, item.div2_level1_pm_name, item.div2_level1_pm_accuracy, item.div2_level1_pm_status);
                    html += make_td(item.div2_level2_pm, item.div2_level2_pm_name, item.div2_level2_pm_accuracy, item.div2_level2_pm_status);
                    html += make_td(item.div2_level3_pm, item.div2_level3_pm_name, item.div2_level3_pm_accuracy, item.div2_level3_pm_status);

                    html += make_td(item.div1_level1_pm, item.div1_level1_pm_name, item.div1_level1_pm_accuracy, item.div1_level1_pm_status);
                    html += make_td(item.div1_level2_pm, item.div1_level2_pm_name, item.div1_level2_pm_accuracy, item.div1_level2_pm_status);
                    html += make_td(item.div1_level3_pm, item.div1_level3_pm_name, item.div1_level3_pm_accuracy, item.div1_level3_pm_status);

                    html += '</tr>';
                }
                $('#all_table tbody').append(html);
            });
        });
    }

    $(function() {
        create_table();
        insert_data();
        make_table("ORDER BY rd_date DESC");
        pm_solved_date = make_pm_solved_date_dict();

        // 表示条件が変わった
        form_conditions.addEventListener('change', function () {
            console.log("checkbox_status is selected");
            make_table("ORDER BY rd_date " + DESC_ASC);
        }, false);

        // 表題がクリック
        $(".column").click(function(){
            var id = $(this).attr("id");
            console.log(id, "is clicked");
            var tag;
            switch (id) {
                case "round_column":
                    tag = "rd_date";
                    break;
                case "div2_column":
                    break;
                case "div1_column":
                    break;
                case "div2_easy_column":
                    tag = "div2_level1_pm_accuracy";
                    break;
                case "div2_normal_column":
                    tag = "div2_level2_pm_accuracy";
                    break;
                case "div2_hard_column":
                    tag = "div2_level3_pm_accuracy";
                    break;
                case "div1_easy_column":
                    tag = "div1_level1_pm_accuracy";
                    break;
                case "div1_normal_column":
                    tag = "div1_level2_pm_accuracy";
                    break;
                case "div1_hard_column":
                    tag = "div1_level3_pm_accuracy";
                    break;
            }

            var order = "";
            if (DESC_ASC == "DESC") {
                DESC_ASC = "ASC";
                order = " ORDER BY CASE WHEN " + tag + " IS NULL THEN 101 ELSE " + tag + " END ASC";
            }
            else {
                DESC_ASC = "DESC";
                order = " ORDER BY CASE WHEN " + tag + " IS NULL THEN -1 ELSE " + tag + " END DESC";
            }
            make_table(order);
        });
    });


    var DESC_ASC = "DESC";
    var pm_solved_date;

})((this || 0).self || global);


$(document).ready( function() {
    var now = new Date();
    var today = now.getFullYear() + "-" + ("0"+ (now.getMonth() + 1)).slice(-2) + "-" + ("0" + now.getDate()).slice(-2);
    console.log(today);
    $('#calendar_end_date').val(today);
});

