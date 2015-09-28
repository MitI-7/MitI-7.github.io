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
        k[t] += 1;
    }
    return k;
}

$(function(){

    var problemData = readJson("./data/allProblem.json");
    var solved = readJson("./data/solved.json");
    var review = readJson("./data/review.json");
    problemData = sortDict(problemData);

    var html = '<tr><td>solved</td>';
    var cou = count(solved);
    var n = Object.keys(problemData).length;

    ['DIV2_Easy', 'DIV2_Normal', 'DIV2_Hard', 'DIV1_Easy', 'DIV1_Normal', 'DIV1_Hard'].forEach(function(d) {
            html += '<td>' + cou[d] + '/' + n + '</td>';
        }
    );

    html += '</tr>';

    for (var date in problemData) {
        for (var round in problemData[date]) {
            html += '<tr>';
            var round_url = 'http://community.topcoder.com/stat?c=round_overview&rd=' + problemData[date][round]['rd'];
            html += '<td>' + '<a href="' + round_url + '" target="_blank">' +  round + '</a></td>';

            ['DIV2', 'DIV1'].forEach(function(division) {
                ['Easy', 'Normal', 'Hard'].forEach(function(level) {
                    if (division in problemData[date][round] && level in problemData[date][round][division]) {

                        var td = '<td>';
                        var solved_date = "";
                        var tag = round + "_" + division + "_" + level;
                        if (tag in solved) {
                            td = '<td bgcolor="#98FB98">';
                            solved_date = "Solved:" + solved[tag];
                        }

                        if (review.indexOf(tag) != -1) {
                            td = '<td bgcolor="#FF6347">';
                        }

                        var problem_url = 'http://community.topcoder.com/stat?c=problem_statement&pm=' + problemData[date][round][division][level]['pm'];
                        html += td + '<a href="' + problem_url + '" target="_blank">' + problemData[date][round][division][level]['problem'] + '</a>';
                        html += '<br>' + problemData[date][round][division][level]['accuracy'] + '%';
                        html += '<br>' + solved_date + '</td>';
                    }
                    // ñ‚ëËÇ™ë∂ç›ÇµÇ»Ç¢
                    else {
                        html += '<td bgcolor="F5F5F5">' + '-' + '</td>';
                    }
                })
            });
            html += '</tr>';
        }
    }
    $('#all_table tbody').append(html);
});


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
