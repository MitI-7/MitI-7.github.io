import datetime
import json
import sys

def main():
    args = sys.argv
    if len(args) != 3:
        print("引数の個数が無効")
        return

    file_path = "pm_state.json"
    pm = args[1]
    state = args[2]
    if state.lower() in ["1", "right", "good", "correct"]:
        state = 1
    else:
        state = 2
    today = datetime.date.today().strftime("%Y-%m-%d")

    with open(file_path) as f:
        d = json.loads(f.read())

    for i in range(len(d)):
        # stateをupdate
        if d[i]["pm"] == pm:
            d[i] = {"pm": pm, "date": today, "state": state}
            break

    # 新規追加
    else:
        d.append({"pm": pm, "date": today, "state": state})
        
    # 上書き保存
    with open(file_path, "w") as f:
        json.dump(d, f)

if __name__ == '__main__':
    main()

