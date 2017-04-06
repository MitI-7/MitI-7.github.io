import os
import urllib.request, urllib.error
import xml.dom.minidom
from collections import defaultdict
import lxml.html

# d = {round_id: {"full_name": "", "short_name": "", "data": "", "division": "", "level": "", "accuracy": ""}}

DATA_DIR = "data"
ALGORITHM_ROUND_RESULTS_DIR = os.path.join(DATA_DIR, "xml")
ROUND_OVERVIEW_DIR = os.path.join(DATA_DIR, "html")


# https://apps.topcoder.com/wiki/display/tc/Algorithm+Data+Feedsからデータを取得
DATA_DIR = "data"
ALGORITHM_ROUND_RESULTS_DIR = os.path.join(DATA_DIR, "xml")
ROUND_OVERVIEW_DIR = os.path.join(DATA_DIR, "html")


# round_listのfeedから[round_id] = (ラウンド名，日付)を取得
def make_rd_data_dict(xml_file: str) -> dict:
    round_data = {}
    with open(xml_file) as xml_data:
        dom = xml.dom.minidom.parse(xml_data)
        for row in dom.documentElement.childNodes:
            round_id = row.getElementsByTagName("round_id")[0].firstChild.data
            round_name = row.getElementsByTagName("short_name")[0].firstChild.data
            round = round_name.split()[1]
            if "SRM" in round_name and round.isdigit():
                round_name = 'SRM{0:03d}'.format(int(round))
            date = row.getElementsByTagName("date")[0].firstChild.data.split()[0]
            round_data[round_id] = (round_name, date)
    return round_data


# [rd][division][level] = Overall Accuracy(system pass / competitors)
def make_accuracy_dict(xml_file: str) -> dict:
    div_competitors = defaultdict(int)      # divisionごとの参加者
    div_data = defaultdict(lambda: defaultdict(int))
    status_key_conv = {"level_three_status": "3", "level_two_status": "2", "level_one_status": "1"}

    with open(xml_file) as xml_data:
        dom = xml.dom.minidom.parse(xml_data)
        for row in dom.documentElement.childNodes:
            rated_flag = row.getElementsByTagName("rated_flag")[0].firstChild.data
            division = row.getElementsByTagName("division")[0].firstChild.data

            if rated_flag != "1":
                continue

            for status_key in ["level_one_status", "level_two_status", "level_three_status"]:
                level = status_key_conv[status_key]
                d = row.getElementsByTagName(status_key)[0].firstChild
                if d is not None:
                    status = d.data
                    div_data[division][level] += (status == "Passed System Test")

            div_competitors[division] += 1

    # 結果の整形
    rd_division_level_accuracy = defaultdict(lambda: defaultdict(lambda: defaultdict(float)))
    rd, _ = os.path.splitext(os.path.basename(xml_file))
    for div, data in div_data.items():
        for level, num in data.items():
            rd_division_level_accuracy[rd][div][level] = num / div_competitors[div] * 100

    return rd_division_level_accuracy


def make_pm_accuracy_dict(pm_data: dict) -> dict:
    rd_division_level_accuracy = defaultdict(lambda: defaultdict(lambda: defaultdict(float)))
    for xml_file_name in os.listdir(ALGORITHM_ROUND_RESULTS_DIR):
        xml_file_path = os.path.join(ALGORITHM_ROUND_RESULTS_DIR, xml_file_name)
        d = make_accuracy_dict(xml_file_path)
        rd_division_level_accuracy.update(d)

    # pm_accuracyの辞書を作成
    pm_accuracy = {}
    for pm, (rd, division, level, name) in pm_data.items():
        accuracy = rd_division_level_accuracy[rd][division][level]
        pm_accuracy[pm] = accuracy

    return pm_accuracy


# round_overviewのhtmlから以下の辞書を作成
# pm: (rd, division, level, 問題名)
def make_pm_data_dict(directory_path) -> dict:
    pm_data = {}
    level_conv = {"Level One": "1", "Level Two": "2", "Level Three": "3"}

    for file_name in os.listdir(directory_path):
        file_path = os.path.join(directory_path, file_name)
        dom = lxml.html.parse(file_path)

        rd, _ = os.path.splitext(os.path.basename(file_name))
        rd = rd.split("_")[-1]
        division = None
        for tr in dom.xpath("//tr"):
            for td in tr:
                if "Division I Problem Stats" in tr.text_content():
                    division = "1"
                elif "Division II Problem Stats" in tr.text_content():
                    division = "2"

                if td.text and td.text.strip() in ["Level One", "Level Two", "Level Three"]:
                    level = level_conv[td.text.strip()]
                    pm = td.getnext()[0].attrib["href"].split("&")[-2].replace("pm=", "")
                    problem_name = td.getnext()[0].text
                    pm_data[pm] = (rd, division, level, problem_name)

    return pm_data


def main():
    import json

    # データの整形と保存
    rd_data = make_rd_data_dict(os.path.join(DATA_DIR, "round_list.xml"))
    # rdのjsonデータ作成
    rd_json_data = {}
    for rd, data in rd_data.items():
        round_name, date = data
        rd_json_data[rd] = {"round_name": round_name, "date": date}

    # pmのjsonデータ作成
    pm_data = make_pm_data_dict(ROUND_OVERVIEW_DIR)
    pm_accuracy = make_pm_accuracy_dict(pm_data)
    pm_json_data = []
    for pm, data in pm_data.items():
        rd, division, level, problem_name = data
        accuracy = pm_accuracy[pm]
        round_name = rd_json_data[rd]["round_name"]
        date = rd_json_data[rd]["date"]
        pm_json_data.append({"rd": rd, "pm": pm, "division": division, "level": level, "problem_name": problem_name, "accuracy": accuracy, "date": date, "round_name": round_name})

    with open("pm_data.json", "w") as f:
        json.dump(pm_json_data, f)


if __name__ == '__main__':
    main()
