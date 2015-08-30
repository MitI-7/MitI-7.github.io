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

$(function(){

    var problemData = readJson("./data/TopCoder/allProblem.json");
    var solved = readJson("./data/TopCoder/solved.json");
    var review = readJson("./data/TopCoder/review.json");
    problemData = sortDict(problemData);

    var html = "";
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
                var tag = contest + "_" + division + "_" + problem['level'];
                if (solved.indexOf(tag) != -1) {
                    td = '<td bgcolor="#98FB98">';
                }
                else if (review.indexOf(tag) != -1) {
                    td = '<td bgcolor="#FF6347">';
                }
                var problemUrl = 'http://community.topcoder.com/' + problem['url'];
                level[problem['level']] = td + '<a href="' + problemUrl + '" target="_blank">' +  problem['problemName'] + '</a>' + '<br>' + problem['overall'] + '</td>';
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
