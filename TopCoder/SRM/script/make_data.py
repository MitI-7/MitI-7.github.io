import os
import urllib.request, urllib.error
import xml.dom.minidom
from collections import defaultdict
import lxml.html

# https://apps.topcoder.com/wiki/display/tc/Algorithm+Data+Feedsからデータを取得

DATA_DIR = "data"
ALGORITHM_ROUND_RESULTS_DIR = os.path.join(DATA_DIR, "xml")
ROUND_OVERVIEW_DIR = os.path.join(DATA_DIR, "html")


# Round Feedのfeedをダウンロード
def save_algorithm_round_list() -> None:
    url = "http://www.topcoder.com/tc?module=BasicData&c=dd_round_list"
    xml_data = urllib.request.urlopen(url)
    with open(os.path.join(DATA_DIR, "round_list.xml"), "bw") as f:
        f.write(xml_data.read())


# Round Resultsのフィードをダウンロード
def save_algorithm_round_results(round_id: str) -> bool:
    url = "http://www.topcoder.com/tc?module=BasicData&c=dd_round_results&rd={0}".format(round_id)
    if not os.path.exists(ALGORITHM_ROUND_RESULTS_DIR):
        os.mkdir(ALGORITHM_ROUND_RESULTS_DIR)

    file_path = os.path.join(ALGORITHM_ROUND_RESULTS_DIR, round_id + ".xml")
    if os.path.exists(file_path):
        return False

    xml_data = urllib.request.urlopen(url)
    with open(file_path, "bw") as f:
        f.write(xml_data.read())
    return True


# roundごとのoverviewをダウンロード
def save_round_overview_html(round_id: str) -> bool:
    url = "https://community.topcoder.com/stat?c=round_overview&rd={0}".format(round_id)
    if not os.path.exists(ROUND_OVERVIEW_DIR):
        os.mkdir(ROUND_OVERVIEW_DIR)

    file_path = os.path.join(ROUND_OVERVIEW_DIR, "overview_" + round_id) + ".html"
    if os.path.exists(file_path):
        return False

    xml_data = urllib.request.urlopen(url)
    with open(file_path, "bw") as f:
        f.write(xml_data.read())
    return True


# round_listのfeedから[round_id] = (ラウンド名，日付)を取得
def make_rd_data_dict(xml_file: str) -> dict:
    round_data = {}
    with open(xml_file) as xml_data:
        dom = xml.dom.minidom.parse(xml_data)
        for row in dom.documentElement.childNodes:
            round_id = row.getElementsByTagName("round_id")[0].firstChild.data
            round_name = row.getElementsByTagName("short_name")[0].firstChild.data
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
def make_pm_data_dict() -> dict:
    pm_data = {}
    level_conv = {"Level One": "1", "Level Two": "2", "Level Three": "3"}

    for file_name in os.listdir(ROUND_OVERVIEW_DIR):
        file_path = os.path.join(ROUND_OVERVIEW_DIR, file_name)
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
    import time

    # データの取得と保存
    save_algorithm_round_list()

    rd_data_dict = make_rd_data_dict(os.path.join(DATA_DIR, "round_list.xml"))
    for round_id in rd_data_dict.keys():
        try:
            if save_algorithm_round_results(round_id):
                time.sleep(1)
        except urllib.error.HTTPError:
            print("HTTP Error", "{0}のresultsの取得に失敗".format(round_id))

    for round_id in rd_data_dict.keys():
        try:
            if save_round_overview_html(round_id):
                time.sleep(1)
        except urllib.error.HTTPError:
            print("HTTP Error", "{0}のoverviewの取得に失敗".format(round_id))

    # データの整形と保存
    pm_data = make_pm_data_dict()
    rd_data = make_rd_data_dict(os.path.join(DATA_DIR, "round_list.xml"))
    pm_accuracy = make_pm_accuracy_dict(pm_data)

    # pm,rdのcsvとpm,division,level,問題名,正解率のcsvを作成
    with open(os.path.join(DATA_DIR, "pm_rd.csv"), "w") as f1, open(os.path.join(DATA_DIR, "pm_data.csv"), "w") as f2:
        for pm, (rd, division, level, name) in pm_data.items():
            f1.write("{0},{1}\n".format(pm, rd))
            f2.write("{0},{1},{2},{3},{4}\n".format(pm, division, level, name, pm_accuracy.get(pm, -1)))

    # rd, round名，日付のcsvを作成
    with open(os.path.join(DATA_DIR, "rd_data.csv"), "w") as f:
        for rd, (name, date) in rd_data.items():
            f.write("{0},{1},{2}\n".format(rd, name, date))

if __name__ == '__main__':
    main()
