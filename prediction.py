#!/usr/bin/env python
# coding:UTF-8

from sql import all_list_matched, connect_database
import datetime as dt
import pandas as pd


# 海啸火山数据时间粒度太低 无预测的意义
def prediction():
    DB_PATH = './data.db'
    conn, cursor = connect_database(DB_PATH)
    eqk, tnm, vol = all_list_matched(conn, cursor)
    group1 = eqk.groupby("location")  # 按名字进行分组
    disaster_time = dt.datetime(2026, 10, 10)  # 初始化
    disaster_name = ""
    for name, group in group1:
        if len(group) >= 4:  # 本系统数据无法解决的情况舍去
            interval = []
            group['date'] = pd.to_datetime(group['date'], format="%Y-%m-%d")
            for i in (range(len(group) - 1)):  # 计算时间间隔
                interval.append((group.iloc[i, 1] - group.iloc[i + 1, 1]).days)
            pred = exp_smooth(interval, 0.4)  # 指数平滑预测
            if ((group.iloc[0, 1].to_pydatetime() + dt.timedelta(days=pred)) < dt.datetime.now() + dt.timedelta(
                    days=10)):  # 本系统数据无法解决的情况舍去
                continue
            if disaster_time > (group.iloc[0, 1].to_pydatetime() + dt.timedelta(days=pred)):  # 比较时间先后
                disaster_time = group.iloc[0, 1].to_pydatetime() + dt.timedelta(days=pred)
                disaster_name = name
    return str(disaster_time).replace('-', '/').split(' ')[0], disaster_name


def exp_smooth(ls, a):  # 指数加权平滑法
    result = 0
    for i in range(len(ls)):
        result += a * (1 - a) ** i * ls[i]
    return result
