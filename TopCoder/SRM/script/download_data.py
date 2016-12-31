import os
import urllib.request
import urllib.error
import xml.dom.minidom

DATA_DIR = "data"
ALGORITHM_ROUND_RESULTS_DIR = os.path.join(DATA_DIR, "xml")
ROUND_OVERVIEW_DIR = os.path.join(DATA_DIR, "html")


# Round Feedのfeedをダウンロード
def save_algorithm_round_list(file_path) -> None:
    url = "http://www.topcoder.com/tc?module=BasicData&c=dd_round_list"
    xml_data = urllib.request.urlopen(url)
    with open(file_path, "bw") as f:
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
def load_rd_list(xml_file: str) -> list:
    round_id_list = []
    with open(xml_file) as xml_data:
        dom = xml.dom.minidom.parse(xml_data)
        for row in dom.documentElement.childNodes:
            round_id = row.getElementsByTagName("round_id")[0].firstChild.data
            round_id_list.append(round_id)
    return round_id_list


def main():
    import time

    save_algorithm_round_list(os.path.join(DATA_DIR, "round_list.xml"))
    round_id_list = load_rd_list(os.path.join(DATA_DIR, "round_list.xml"))
    for round_id in round_id_list:
        print(round_id)
        try:
            if save_algorithm_round_results(round_id):
                time.sleep(1)
            if save_round_overview_html(round_id):
                time.sleep(1)
        except urllib.error.HTTPError as e:
            print("HTTP Error", "{0}のresultsの取得に失敗".format(round_id))
            print(e)

if __name__ == '__main__':
    main()
