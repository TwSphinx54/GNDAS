import psycopg2


# 获得连接
def connect_database():
    try:
        conn = psycopg2.connect(dbname="postgis_1_sample", user="postgres", password="20010930", host="localhost", port="5432")
    except psycopg2.Error as e:
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
    sql = """select * from admin_up where login_usr='%s' and password='%s';""" % (usr, password)
    params = (1,)
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
    sql = """insert into admin_up (login_usr,password,administrator)
    values('%s','%s',FALSE )
    ;""" % (usr, password)
    params = (1,)
    # 执行语句
    cursor.execute(sql, params)
    # 事物提交
    conn.commit()


def full_geojson(rows):
    n_rows = [k[0] for k in rows]
    full_geojson = {
        'type': 'FeatureCollection',
        'features': n_rows

    }
    return full_geojson


def earthquake_all_matched(conn, cursor):
    sql = """SELECT json_build_object(
        'type',       'Feature',
        'geometry',   ST_AsGeoJSON(geom)::json,
        'properties', json_build_object(
            'id', gid,
            'Date', earthquake.Date,
            'Year', earthquake.Year,
            'Magnitude', earthquake.Magnitude,
            'Depth', earthquake.Depth,
            'location_a', earthquake.location_n))FROM earthquake;"""
    params = (1,)
    # 执行语句
    cursor.execute(sql, params)
    # 抓取
    rows = cursor.fetchall()
    full_geo = full_geojson(rows)
    # 事物提交
    conn.commit()
    return full_geo


def tsunami_all_matched(conn, cursor):
    sql = """SELECT json_build_object(
    'type',       'Feature',
    'geometry',   ST_AsGeoJSON(geom)::json,
    'properties', json_build_object(
        'id', gid,
		'Year', tsunami.year,
		'Location_Name', tsunami.location_n,
		'Country',tsunami.country,
		'Region',tsunami.region,
		'Cause',tsunami.cause,
		'Event_Validity',tsunami.event_vali,
		'EQ_Magnitude',tsunami.eq_magnitu,
		'EQ_Depth',tsunami.eq_depth,
		'TS_Intensity',tsunami.ts_intensi,
		'Damage_total_description',tsunami.damage_tot,
		'HOUSES_total_description ',tsunami.houses_tot,
		'DEATHS_total_description',tsunami.deaths_tot,
		'URL',tsunami.url,
        'Comments',tsunami.comments	))FROM tsunami;"""
    params = (1,)
    # 执行语句
    cursor.execute(sql, params)
    # 抓取
    rows = cursor.fetchall()
    full_geo = full_geojson(rows)
    # 事物提交
    conn.commit()
    return full_geo


def volcano_eruption_all_matched(conn, cursor):
    sql = """SELECT json_build_object(
    'type',       'Feature',
    'geometry',   ST_AsGeoJSON(geom)::json,
    'properties', json_build_object(
        'id', gid,
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
		'URL',volcano_eruption.url		))FROM volcano_eruption;"""
    params = (1,)
    # 执行语句
    cursor.execute(sql, params)
    # 抓取
    rows = cursor.fetchall()
    full_geo = full_geojson(rows)
    # 事物提交
    conn.commit()
    return full_geo


def vague_match(conn, cursor, chars):
    chars_ = '%' + chars + '%'
    sql_ts = """SELECT id FROM tsunami WHERE tsunami.location_n ILIKE '%s';""" % chars_
    # 执行语句
    cursor.execute(sql_ts)
    # 抓取
    rows_ts = cursor.fetchall()
    vague = []
    for row in rows_ts:
        vague.append([row[0], 'tsunami'])

    sql_eq = """SELECT id FROM earthquake WHERE earthquake.location_n ILIKE '%s';""" % chars_
    # 执行语句
    cursor.execute(sql_eq)
    # 抓取
    rows_eq = cursor.fetchall()
    for row in rows_eq:
        vague.append([row[0], 'earthquake'])

    sql_vo = """SELECT id FROM volcano_eruption WHERE volcano_eruption.country ILIKE '%s';""" % chars_
    # 执行语句
    cursor.execute(sql_vo)
    # 抓取
    rows_vo = cursor.fetchall()
    for row in rows_vo:
        vague.append([row[0], 'volcano_eruption'])
    # 事物提交
    conn.commit()
    return vague