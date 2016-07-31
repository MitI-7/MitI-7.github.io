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
                tx.executeSql('INSERT OR REPLACE INTO topcoder VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);', k,

         			function(tx, res) {
		        	},
        			function(tx, error) {
		        	    console.log("error:" + error.message);
                        console.log(k);
        			});
            }
        });
    }

    function make_td(pm, pm_name, accuracy, status) {
        if (pm == 'None') {
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
        }
        catch (e) {
            td += '<br>-%';
        }
        return td + '</td>'
    }

    function make_table() {

        var db = open_db();
        var status = "(-1,";
        for (var i = 0; i < form_conditions.checkbox_status.length; ++i) {
            if (form_conditions.checkbox_status[i].checked) {
                status += form_conditions.checkbox_status[i].value + ",";
            }
        }

        status = status.slice(0, status.length - 1) + ")";
        console.log(status);

        $('#all_table tbody').empty();

        db.transaction( function(trans) {
            var sql= 'SELECT * FROM topcoder';
            sql += ' WHERE div2_level1_pm_status in ' + status;
            sql += ' OR div2_level2_pm_status in ' + status;
            sql += ' OR div2_level3_pm_status in ' + status;

            sql += ' OR div1_level1_pm_status in ' + status;
            sql += ' OR div1_level2_pm_status in ' + status;
            sql += ' OR div1_level3_pm_status in ' + status;

            sql += ' ORDER BY rd_date DESC;';

            trans.executeSql(sql, [], function(trans, r) {
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
        make_table();

        form_conditions.addEventListener('change', function () {
            console.log("checkbox_status is selected");
            make_table();
        }, false);


        $(".column").click(function(){
            var id = $(this).attr("id");
            alert(id);
        });
    });
})((this || 0).self || global);



