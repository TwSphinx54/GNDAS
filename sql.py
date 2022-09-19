# -*- coding: utf-8 -*-
import datetime
import sqlite3
import json


#
# 获得连接


def connect_database(path_db):
    try:
        conn = sqlite3.connect(path_db, check_same_thread=False)
    except sqlite3.Error as e:
        print('Unable to connect!\n{0}'.format(e))
    else:
        print('Connected!')

    # 获得游标对象
    cursor = conn.cursor()
    return conn, cursor


def free_database(conn, cursor):
    # 关闭数据库连接
    cursor.close()
    conn.close()


def login_in(conn, cursor, usr, password):
    sql = "select * from admin_up where login_usr=(?) and password=(?)"
    params = (usr, password)
    # 执行语句
    cursor.execute(sql, params)
    # 抓取
    rows = cursor.fetchall()
    admin = False
    if rows != []:
        exist = True
        if rows[0][2]:
            admin = True
    else:
        exist = False
    # 事物提交
    conn.commit()
    return [exist, admin]


def registered(conn, cursor, usr, password):
    sql = "insert into admin_up (login_usr,password,administrator) values((?),(?),FALSE )"
    params = (usr, password)
    # 执行语句
    cursor.execute(sql, params)
    # 事物提交
    conn.commit()


def full_geojson(rows):
    full_geojson = {
        'type': 'FeatureCollection',
        'features': rows
    }
    return full_geojson


def single_geojson(rows):
    # n_rows = [k[0] for k in rows]
    single_geo = []
    for k in rows:
        single_g = {
            'type': 'Feature',
            'geometry': {
                "type": "Point",
                "coordinates": [k['longitude'], k['latitude']]
            },
            'properties': k
        }
        single_geo.append(single_g)
    return single_geo


def earthquake_all_matched(conn, cursor):
    sql = "SELECT json_object('id', id,'Date', earthquake.Date,'latitude',earthquake.latitude, 'longitude',earthquake.longitude,'Year', earthquake.Year, 'Magnitude', earthquake.Magnitude, 'Depth', earthquake.Depth, 'location_a', earthquake.location_n) FROM earthquake"
    # 执行语句
    cursor.execute(sql)
    # 抓取
    rows = cursor.fetchall()
    eq_len = len(rows)
    rows1 = [json.loads(k[0]) for k in rows]
    single_geo = single_geojson(rows1)
    full_geo = full_geojson(single_geo)

    # 事物提交
    conn.commit()
    return full_geo, eq_len


def tsunami_all_matched(conn, cursor):
    sql = "SELECT json_object('id',tsunami.id,'latitude',tsunami.latitude, 'longitude',tsunami.longitude,'Year', tsunami.year,'Location_Name', tsunami.location_n,'Country',tsunami.country,'Region',tsunami.region,'Cause',tsunami.cause,'Event_Validity',tsunami.event_vali,'EQ_Magnitude',tsunami.eq_magnitu,'EQ_Depth',tsunami.eq_depth,'TS_Intensity',tsunami.ts_intensi,'Damage_total_description',tsunami.damage_tot,'HOUSES_total_description ',tsunami.houses_tot,'DEATHS_total_description',tsunami.deaths_tot,'URL',tsunami.url,'Comments',tsunami.comments)FROM tsunami"

    # 执行语句
    cursor.execute(sql)
    # 抓取
    rows = cursor.fetchall()
    ts_len = len(rows)
    rows1 = [json.loads(k[0]) for k in rows]
    single_geo = single_geojson(rows1)
    full_geo = full_geojson(single_geo)

    # 事物提交
    conn.commit()
    return full_geo, ts_len


def volcano_eruption_all_matched(conn, cursor):
    sql = """SELECT json_object(
        'id',volcano_eruption.id,
        'latitude',volcano_eruption.latitude, 
        'longitude',volcano_eruption.longitude,
		'Year', volcano_eruption.year,
		'Volcano', volcano_eruption.volcano,
		'Volcano_id',volcano_eruption.volcano_id,
		'Country',volcano_eruption.country,
		'Eruptions',volcano_eruption.eruptions,
		'Eruption_1',volcano_eruption.eruption_1,
		'Eruption_2',volcano_eruption.eruption_2,
		'Volcanoes',volcano_eruption.volcanoes,
		'Volcanotype',volcano_eruption.volcanotyp,
		'Last_known_eruption',volcano_eruption.lastknowne,
		'Summit',volcano_eruption.summit,
		'Elevation',volcano_eruption.elevation,
		'URL',volcano_eruption.url)FROM volcano_eruption"""

    # 执行语句
    cursor.execute(sql)
    # 抓取
    rows = cursor.fetchall()
    vo_len = len(rows)
    rows1 = [json.loads(k[0]) for k in rows]
    single_geo = single_geojson(rows1)
    full_geo = full_geojson(single_geo)
    # 事物提交
    conn.commit()
    return full_geo, vo_len


def vague_match(conn, cursor, chars):
    sql_ts = "SELECT id,location_n,year FROM tsunami WHERE tsunami.location_n  like '%" + chars + "%'"
    # 执行语句
    cursor.execute(sql_ts)
    # 抓取
    rows_ts = cursor.fetchall()

    vague = {}
    n = 0
    for row in rows_ts:
        vague[n] = {'gid': row[0], 'location': row[1], 'year': row[2], 'type': 1}
        n += 1

    sql_eq = "SELECT id,location_n,year FROM earthquake WHERE earthquake.location_n  like '%" + chars + "%'"
    # 执行语句。
    cursor.execute(sql_eq)
    # 抓取
    rows_eq = cursor.fetchall()
    for row in rows_eq:
        vague[n] = {'gid': row[0], 'location': row[1], 'year': row[2], 'type': 2}
        n += 1

    sql_vo = "SELECT id,volcano,year FROM volcano_eruption WHERE volcano_eruption.volcano  like '%" + chars + "%'"
    # 执行语句
    cursor.execute(sql_vo)
    # 抓取
    rows_vo = cursor.fetchall()
    for row in rows_vo:
        vague[n] = {'gid': row[0], 'location': row[1], 'year': row[2], 'type': 3}
        n += 1
    # 事物提交
    conn.commit()

    return vague


def last_id(conn, cursor, type):
    sql_last = "select id from " + type + " order by id desc limit 0,1"
    cursor.execute(sql_last)
    rows_ts = cursor.fetchall()
    # 事物提交
    conn.commit()
    return rows_ts[0][0]


def earthquake_storage(conn, cursor, date, year, magnitude, latitude, longitude, deoth, location_n):
    last_num = last_id(conn, cursor, 'earthquake')
    sql = "insert into earthquake (id,date,year,magnitude,latitude,longitude,depth,location_n) values((?),(?),(?),(?),(?),(?),(?),(?))"
    params = (last_num + 1, date, year, magnitude,
              latitude, longitude, deoth, location_n)
    # 执行语句
    cursor.execute(sql, params)
    # 事物提交
    conn.commit()


def tsunami_storage(conn, cursor, year, latitude, longitude, location_n, country, region, cause, event_vali, ts_intensi,
                    url, comments, damage_tot='UnKnown', houses_tot='UnKnown', deaths_tot='UnKnown',
                    eq_magnitu='UnKnown', eq_depth='UnKnown', month='UnKnown', day='UnKnown', hour='UnKnown',
                    minute='UnKnown'):
    last_num = last_id(conn, cursor, 'tsunami')
    sql = "insert into tsunami (id,year,month,day,hour,minute,latitude,longitude,location_n,country,region,cause,event_vali,eq_magnitu,eq_depth,ts_intensi,damage_tot,houses_tot,deaths_tot,url,comments) values((?),(?),(?),(?),(?),(?),(?),(?),(?),(?),(?),(?),(?),(?),(?),(?),(?),(?),(?),(?),(?)) "
    params = (
        last_num + 1, year, month, day, hour, minute, latitude, longitude, location_n, country, region, cause,
        event_vali, eq_magnitu,
        eq_depth, ts_intensi, damage_tot, houses_tot, deaths_tot, url, comments)
    # 21
    # 执行语句
    cursor.execute(sql, params)
    # 事物提交
    conn.commit()


def volcano_eruption_storage(conn, cursor, year, volcano, volcano_id, country, eruptions, eruption_1, eruption_2,
                             volcanoes, volcanotyp, lastknowne, latitude, longitude, summit, elevation, url,
                             field17='[null]'):
    last_num = last_id(conn, cursor, 'volcano_eruption')
    sql = "insert into volcano_eruption (id,year,volcano,volcano_id,country,eruptions,eruption_1,eruption_2,volcanoes,volcanotyp,lastknowne,latitude,longitude,summit,elevation,url) values((?),(?),(?),(?),(?),(?),(?),(?),(?),(?),(?),(?),(?),(?),(?),(?)) "
    params = (
        last_num + 1, year, volcano, volcano_id, country, eruptions, eruption_1, eruption_2, volcanoes, volcanotyp,
        lastknowne,
        latitude,
        longitude, summit, elevation, url)
    # 17
    # 执行语句
    cursor.execute(sql, params)
    # 事物提交
    conn.commit()


def record_statement(conn, cursor, usr, statement):
    geom = "SELECT id FROM usr_discuss ORDER BY id ASC "
    cursor.execute(geom)
    rows = cursor.fetchall()
    num_id = rows[-1][0] + 1
    curr_time = datetime.datetime.now()
    data = curr_time.date()
    sql = "insert into usr_discuss (id,usr,date,statement) values((?),(?),(?),(?) )"
    params = (num_id, usr, curr_time, statement)
    # 执行语句
    cursor.execute(sql, params)
    # 事物提交
    conn.commit()


def match_all_statement(conn, cursor):
    sql = "SELECT usr,date,statement FROM usr_discuss ORDER BY usr_discuss.date desc;"
    # 执行语句
    cursor.execute(sql)
    state_rows = cursor.fetchall()
    statement = {}
    n = 0
    for row in state_rows:
        statement[n] = {'usr': row[0], 'date': row[1], 'statement': row[2]}
        n = n + 1
    # 事物提交
    conn.commit()
    return statement


# 返回最新，type ,经纬度，Location
def return_newnest(conn, cursor):
    sql_eq = "select id,date,latitude,longitude,location_n from earthquake order by date DESC limit 0,1"
    sql_ve = "select id,eruptions,country,latitude,longitude from volcano_eruption order by eruptions DESC  limit 0,1"
    sql_ts = "select id,year,month,day,latitude,longitude,location_n from tsunami order by year DESC,month DESC,day DESC  limit 0,1"
    cursor.execute(sql_eq)
    rows_eq = cursor.fetchall()

    cursor.execute(sql_ve)
    rows_ve = cursor.fetchall()
    rows_tmp = rows_ve[0][1].split()
    rows_ve1 = ''
    for i in rows_tmp:
        i = i + '-'
        rows_ve1 += i
    rows_ve1 = rows_ve1[:-1]
    cursor.execute(sql_ts)
    rows_ts = cursor.fetchall()
    rows_tmp = ''
    for i in range(1, 4):
        i = str(int(float(rows_ts[0][i]))) + '-'
        rows_tmp += i
    rows_ts1 = rows_tmp[:-1]
    if rows_ts1 > rows_ve1:
        tmp_new = rows_ts1
        type_id = 1
    else:
        tmp_new = rows_ve1
        type_id = 2
        if tmp_new < rows_eq[0][1]:
            tmp_new = rows_eq[0][1]
            type_id = 3
    if type_id == 1:
        dic_ts = {
            'type': '海啸',
            'latitude': '%.3f' % rows_ts[0][4],
            'longitude': '%.3f' % rows_ts[0][5],
            'location_n': rows_ts[0][6]
        }
        conn.commit()
        return dic_ts
    elif type_id == 2:
        dic_ve = {
            'type': '火山',
            'latitude': '%.3f' % rows_ve[0][3],
            'longitude': '%.3f' % rows_ve[0][4],
            'location_n': rows_ve[0][2]
        }
        conn.commit()
        return dic_ve
    elif type_id == 3:
        dic_eq = {
            'type': '地震',
            'latitude': '%.3f' % rows_eq[0][2],
            'longitude': '%.3f' % rows_eq[0][3],
            'location_n': rows_eq[0][4]
        }
        conn.commit()
        return dic_eq
