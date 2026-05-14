import subprocess
import time
import random
from datetime import datetime, timedelta
import requests
import csv
import os
import signal
import sxtwl
import sys
import json

# -------------------------------
# 配置 Firefox 浏览器路径
# -------------------------------
FIREFOX_PATH = "/usr/bin/firefox"

# -------------------------------
# 本地网页路径
# -------------------------------
datagrid_path = "http://my-astro.cn/datagrid.html"
statistics_path = "http://my-astro.cn/statistics.html"

# -------------------------------
# 日志输出函数
# -------------------------------
def log(message, level="INFO"):
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    print(f"[{timestamp}] {level} {message}")

# -------------------------------
# 模拟后台抓取日志
# -------------------------------
def simulate_background_logs(duration=5):
    start_time = time.time()
    while time.time() - start_time < duration:
        time.sleep(random.uniform(0.2, 0.6))
        level = random.choices(["INFO", "WARN", "DEBUG"], weights=[0.7,0.2,0.1])[0]
        action = random.choice([
            "连接数据源成功",
            "读取网页数据中...",
            "数据解析完成",
            "请求超时，正在重试",
            "获取响应失败，重新尝试",
            "随机延迟处理数据",
            "抓取下一条记录"
        ])
        log(action, level=level)

# -------------------------------
# 模拟读取日出日落数据
# -------------------------------
def simulate_sun_data():
    dates = [f"2026-01-{day:02d}" for day in range(1, 11)]  # 前10天数据
    data_log = []

    log("开始逐行读取日出日落数据...")
    for idx, date in enumerate(dates, start=1):
        attempts = 0
        success = False
        while not success:
            attempts += 1
            time.sleep(random.uniform(0.1, 0.4))
            if random.random() < 0.85:  # 85% 成功率
                sunrise_hour = random.randint(6, 7)
                sunrise_minute = random.randint(0, 59)
                sunset_hour = random.randint(16, 18)
                sunset_minute = random.randint(0, 59)
                day_length_hours = sunset_hour - sunrise_hour
                day_length_minutes = (sunset_minute - sunrise_minute) % 60
                log_entry = {
                    "date": date,
                    "sunrise": f"{sunrise_hour:02d}:{sunrise_minute:02d}",
                    "sunset": f"{sunset_hour:02d}:{sunset_minute:02d}",
                    "day_length": f"{day_length_hours:02d}:{day_length_minutes:02d}",
                    "attempts": attempts
                }
                data_log.append(log_entry)
                log(f"读取成功: {date}, 日出: {log_entry['sunrise']}, 日落: {log_entry['sunset']}, "
                    f"白昼长度: {log_entry['day_length']} (尝试次数: {attempts})")
                success = True
            else:
                log(f"读取 {date} 数据失败，正在重试... (尝试次数: {attempts})", level="WARN")
    log("日出日落数据读取完成 ✅")
    return data_log

# -------------------------------
# 打开本地网页函数
# -------------------------------
def open_local_webpage(path):
    try:
        proc = subprocess.Popen([FIREFOX_PATH, path])
        log(f"已打开网页: {os.path.basename(path)}")
        return proc
    except Exception as e:
        log(f"打开网页失败: {e}", level="ERROR")
        return None

def fetch_statistics():
    # 1. 打开 datagrid.html
    proc = open_local_webpage(datagrid_path)
    if proc:
        # 2. 模拟后台日志输出，同时等待3-5秒
        simulate_background_logs(duration=random.uniform(20,30))
        # 关闭浏览器
        proc.terminate()  # 发 SIGTERM 结束 Firefox
        try:
            proc.wait(timeout=5)
        except subprocess.TimeoutExpired:
            proc.kill()  # 强制结束
        log(f"{os.path.basename(datagrid_path)} 已关闭")

    # 3. 逐行读取日出日落数据
    simulate_sun_data()

    # 4. 打开 statistics.html
    open_local_webpage(statistics_path)

def pull_sun_times(year):
    lat = 39.9   # 纬度
    lng = 116.4  # 经度
    # year = 2024

    solar_terms = ["冬至", "小寒", "大寒", "立春", "雨水", "惊蛰", "春分", "清明", "谷雨", "立夏",
        "小满", "芒种", "夏至", "小暑", "大暑", "立秋", "处暑","白露", "秋分", "寒露", "霜降", 
        "立冬", "小雪", "大雪"]
    
    with open("data.js", "w", newline='') as f:
        writer = csv.writer(f)
        js_objs = []
        # s = "export const myVar = "
        start = datetime(year,1,1)
        for i in range(365):
            d = start + timedelta(days=i)
            url = f"https://api.sunrise-sunset.org/json?lat={lat}&lng={lng}&date={d.strftime('%Y-%m-%d')}"
            res = requests.get(url).json()
            r = res["results"]

            solar_term = ""
            day_obj = sxtwl.fromSolar(d.year, d.month, d.day)
            if day_obj.hasJieQi():
                idx = day_obj.getJieQi()
                solar_term = solar_terms[idx]

            js_objs.append({  "date":d.strftime("%Y-%m-%d"),
                    "sunrise":(datetime.strptime(r["sunrise"], "%I:%M:%S %p") + timedelta(hours=8)).strftime("%H:%M"),
                    "sunset":(datetime.strptime(r["sunset"], "%I:%M:%S %p") + timedelta(hours=8)).strftime("%H:%M"),
                    "day_length":r["day_length"],
                    "solar_term":solar_term
            })
        print(json.dumps(js_objs))
        f.write("export const sunData=%s;" % json.dumps(js_objs))

# -------------------------------
# 主流程
# -------------------------------
if __name__ == "__main__":
    if len(sys.argv) == 1:
        fetch_statistics()
    else:
        if sys.argv[1] == "-pull":
            pull_sun_times(2025)