function sortDict(object) {
    var sorted = {};
    var array = [];
    for (var k in object) {
        array.push(k);
    }
    array.sort();
    array.reverse();
    for (var i = 0; i < array.length; i++) {
        sorted[array[i]] = object[array[i]];
    }

    return sorted;
}

function readJson(url) {
    var xmlhttp = new XMLHttpRequest;
    xmlhttp.open("GET", url, false);
    xmlhttp.send();
    return JSON.parse(xmlhttp.responseText);
}

function count(solved) {
    var k = {'DIV2_Easy': 0, 'DIV2_Normal': 0, 'DIV2_Hard': 0, 'DIV1_Easy': 0, 'DIV1_Normal': 0, 'DIV1_Hard': 0};
    for (var d in solved) {
        var t = d.split("_")[1] + '_' + d.split("_")[2];
        //alert(t);
        k[t] += 1;
    }
    return k;
}

$(function(){

    var problemData = readJson("./data/TopCoder/allProblem.json");
    var solved = readJson("./data/TopCoder/solved.json");
    var review = readJson("./data/TopCoder/review.json");
    problemData = sortDict(problemData);

    var html = "";

    html += '<tr><td>solved</td>';
    var cou = count(solved);
    var n = Object.keys(problemData).length;
    var l = ['DIV2_Easy', 'DIV2_Normal', 'DIV2_Hard', 'DIV1_Easy', 'DIV1_Normal', 'DIV1_Hard'];
    for (var i = 0; i < l.length; ++i) {
        html += '<td>' + cou[l[i]] + '/' + n + '</td>';
    }
    html += '</tr>';

    // srm 000
    for (var contest in problemData) {
        var contestUrl = 'http://community.topcoder.com/' + problemData[contest]['url'];

        html += '<tr>' + '<td>' + '<a href="' + contestUrl + '" target="_blank">'+  contest + '</a>' + '</td>';

        // divisionDict 000
        var divisionDict = {};
        for (var division in problemData[contest]) {
            var level = {'Easy': '<td bgcolor="#DCDCDC">-</td>', 'Normal': '<td bgcolor="#DCDCDC">-</td>', 'Hard': '<td bgcolor="#DCDCDC">-</td>'};

            var array = problemData[contest][division];
            for (var i = 0; i < array.length; ++i) {
                var problem = array[i];

                var td = '<td>';
                var date = "";
                var tag = contest + "_" + division + "_" + problem['level'];
                if (tag in solved) {
                    td = '<td bgcolor="#98FB98">';
                    date = "Solved:" + solved[tag];
                }

                else if (review.indexOf(tag) != -1) {
                    td = '<td bgcolor="#FF6347">';
                }
                var problemUrl = 'http://community.topcoder.com/' + problem['url'];
                level[problem['level']] = td + '<a href="' + problemUrl + '" target="_blank">' +  problem['problemName'] + '</a>' + '<br>' + problem['overall'] + '<br>' + date +'</td>';
            }
            divisionDict[division]= level['Easy'] + level['Normal'] + level['Hard']
        }
        html += divisionDict['DIV2'] + divisionDict['DIV1'] + '</tr>';
    }
    $('#all_table tbody').append(html);
});

// ëIëâ”èäÇÃêFÇïœÇ¶ÇÈ
$(function(){
    var tr = "#problem_table tr";
    $(tr).css("background-color", "#ffffff");
    $(tr).mouseover(function(){
        $(this).css("background-color", "#F5F5F5")
    });
    $(tr).mouseout(function(){
        $(this).css("background-color", "#ffffff")
    });
});
