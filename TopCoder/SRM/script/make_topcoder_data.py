import os
import sqlite3

DATA_DIR = "data"


def make_database():
    with sqlite3.connect(os.path.join(DATA_DIR, "data.db")) as con:
        con.execute("CREATE TABLE IF NOT EXISTS pm_data (pm INTEGER, div INTEGER, level INTEGER, name TEXT, accuracy REAL)")
        with open(os.path.join(DATA_DIR, "pm_data.csv")) as f:
            for line in f:
                pm, div, level, name, accuracy = line.strip().split(",")
                con.execute("INSERT OR REPLACE INTO pm_data values (?, ?, ?, ?, ?)", (pm, div, level, name, accuracy))

        con.execute("CREATE TABLE IF NOT EXISTS pm_rd (pm INTEGER, rd INTEGER)")
        with open(os.path.join(DATA_DIR, "pm_rd.csv")) as f:
            for line in f:
                pm, rd = line.strip().split(",")
                con.execute("INSERT OR REPLACE INTO pm_rd values (?, ?)", (pm, rd))

        con.execute("CREATE TABLE IF NOT EXISTS rd_data (rd INTEGER, name TEXT, date TEXT)")
        with open(os.path.join(DATA_DIR, "rd_data.csv")) as f:
            for line in f:
                rd, name, date = line.strip().split(",")
                con.execute("INSERT OR REPLACE INTO rd_data values (?, ?, ?)", (rd, name, date))

        con.execute("CREATE TABLE IF NOT EXISTS pm_status (pm INTEGER, status INTEGER)")
        if os.path.exists(os.path.join(DATA_DIR, "pm_status.csv")):
            # TODO: pm_status.csvは手作りしてるので自動でやるようにする
            with open(os.path.join(DATA_DIR, "pm_status.csv")) as f:
                for line in f:
                    pm, status = line.strip().split(",")
                    con.execute("INSERT OR REPLACE INTO pm_status values (?, ?)", (pm, status))


def main():
    make_database()
    data_list = []
    with sqlite3.connect(os.path.join(DATA_DIR, "data.db")) as con:
        for row in con.execute('''SELECT
                                    rd,
                                    rd_name,
                                    rd_date,
                                    max(CASE WHEN div = '2' AND level = '1' THEN pm END) as div2_level1_pm,
                                    max(CASE WHEN div = '2' AND level = '2' THEN pm END) as div2_level2_pm,
                                    max(CASE WHEN div = '2' AND level = '3' THEN pm END) as div2_level3_pm,
                                    max(CASE WHEN div = '1' AND level = '1' THEN pm END) as div1_level1_pm,
                                    max(CASE WHEN div = '1' AND level = '2' THEN pm END) as div1_level2_pm,
                                    max(CASE WHEN div = '1' AND level = '3' THEN pm END) as div1_level3_pm,

                                    max(CASE WHEN div = '2' AND level = '1' THEN pm_name END) as div2_level1_pm_name,
                                    max(CASE WHEN div = '2' AND level = '2' THEN pm_name END) as div2_level2_pm_name,
                                    max(CASE WHEN div = '2' AND level = '3' THEN pm_name END) as div2_level3_pm_name,
                                    max(CASE WHEN div = '1' AND level = '1' THEN pm_name END) as div1_level1_pm_name,
                                    max(CASE WHEN div = '1' AND level = '2' THEN pm_name END) as div1_level2_pm_name,
                                    max(CASE WHEN div = '1' AND level = '3' THEN pm_name END) as div1_level3_pm_name,

                                    max(CASE WHEN div = '2' AND level = '1' THEN accuracy END) as div2_level1_pm_accuracy,
                                    max(CASE WHEN div = '2' AND level = '2' THEN accuracy END) as div2_level2_pm_accuracy,
                                    max(CASE WHEN div = '2' AND level = '3' THEN accuracy END) as div2_level3_pm_accuracy,
                                    max(CASE WHEN div = '1' AND level = '1' THEN accuracy END) as div1_level1_pm_accuracy,
                                    max(CASE WHEN div = '1' AND level = '2' THEN accuracy END) as div1_level2_pm_accuracy,
                                    max(CASE WHEN div = '1' AND level = '3' THEN accuracy END) as div1_level3_pm_accuracy,

                                    max(CASE WHEN div = '2' AND level = '1' THEN status END) as div2_level1_pm_status,
                                    max(CASE WHEN div = '2' AND level = '2' THEN status END) as div2_level2_pm_status,
                                    max(CASE WHEN div = '2' AND level = '3' THEN status END) as div2_level3_pm_status,
                                    max(CASE WHEN div = '1' AND level = '1' THEN status END) as div1_level1_pm_status,
                                    max(CASE WHEN div = '1' AND level = '2' THEN status END) as div1_level2_pm_status,
                                    max(CASE WHEN div = '1' AND level = '3' THEN status END) as div1_level3_pm_status

                                FROM
                                (
                                    SELECT
                                        pm_rd.rd as rd,
                                        rd_data.name as rd_name,
                                        rd_data.date as rd_date,
                                        pm_rd.pm as pm,
                                        pm_data.name as pm_name,
                                        pm_data.div,
                                        pm_data.level,
                                        pm_data.accuracy,
                                        IFNULL(pm_status.status, 0) as status
                                     FROM
                                         pm_rd
                                     INNER JOIN
                                         pm_data
                                     ON
                                         pm_data.pm = pm_rd.pm
                                     INNER JOIN
                                         rd_data
                                     ON
                                         rd_data.rd = pm_rd.rd
                                     LEFT JOIN
                                         pm_status
                                     ON
                                         pm_status.pm = pm_rd.pm
                                ) tmp
                                GROUP BY
                                    tmp.rd

                                '''):
            print(row)
            data_list.append(",".join(map(str, row)))

    print("data size:{0}".format(len(data_list)))
    with open(os.path.join("..", "topcoder_data.csv"), "w") as f:
        f.write("\n".join(data_list))


if __name__ == '__main__':
    main()

