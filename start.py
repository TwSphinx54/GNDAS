from flask import Flask, request, redirect, url_for, render_template, jsonify
from sql import connect_database, login_in, volcano_eruption_all_matched, tsunami_all_matched, earthquake_all_matched, \
    registered, volcano_eruption_storage, earthquake_storage, tsunami_storage, vague_match, record_statement, \
    match_all_statement
import json

DB_PATH = './data.db'
app = Flask(__name__, template_folder="./webpage", static_folder='./webpage', static_url_path="")
conn, cursor = connect_database(DB_PATH)
vol, vo_len = volcano_eruption_all_matched(conn, cursor)
eqk, eq_len = earthquake_all_matched(conn, cursor)
tnm, tn_len = tsunami_all_matched(conn, cursor)
vol_c = [k['properties'] for k in vol['features']]

eqk_c = [k['properties'] for k in eqk['features']]
tnm_c = [k['properties'] for k in tnm['features']]
usr_d = '游客'
pms_d = '无权限'


# Flask中的route()装饰器用于将URL绑定到函数 即将网页html文件发布到对应路由上
@app.route('/', methods=['GET', 'POST'])
def login():
    if request.method == 'GET':  # 默认情况下，Flask访问路由响应GET请求
        return render_template('main.html')
    elif request.method == 'POST':
        email = request.values['email']
        password = request.form['password']
        status = request.form['status']  # 代表本次请求是登录(1)or注册(2)
        usr = email.split('@')[0]
        if status == "1":  # 此时正在进行登录操作
            log_status = login_in(conn, cursor, email, password)
            pms = '管理员' if log_status[1] else '普通用户'
            if log_status[0]:  # 系统中有该用户
                return {'pms': pms, 'usr': usr}
            else:
                return 'error'  # redirect以get方法访问
        if status == "2":  # 此时正在进行注册操作
            registered(conn, cursor, email, password)  # 注册用户
            pms = '普通用户'
            return {'pms': pms, 'usr': usr}


@app.route('/result', methods=['GET', 'POST'])
def main_process():
    if request.method == 'GET':
        pms = request.args.get('pms')
        usr = request.args.get('usr')
        if (pms == '管理员') | (pms == '普通用户'):
            return render_template('view.html', pms=pms, usr=usr, vol=vol, eqk=eqk, tnm=tnm)
        else:
            return render_template('view.html', pms=pms_d, usr=usr_d, vol=vol, eqk=eqk, tnm=tnm)
    elif request.method == 'POST':
        value = request.form['value']
        result = vague_match(conn, cursor, value)
        return result


@app.route('/risk', methods=['GET', 'POST'])
def risk():
    if request.method == 'GET':  # 默认情况下，Flask访问路由响应GET请求
        pms = request.args.get('pms')
        usr = request.args.get('usr')
        if (pms == '管理员') | (pms == '普通用户'):
            return render_template('risk.html', pms=pms, usr=usr, vol_c=vol_c, eqk_c=eqk_c, tnm_c=tnm_c, vol=vol,
                                   eqk=eqk, tnm=tnm)  # 相当于将risk.html和/risk路由相互绑定
        else:
            return render_template('risk.html', pms=pms_d, usr=usr_d, vol_c=vol_c, eqk_c=eqk_c, tnm_c=tnm_c, vol=vol,
                                   eqk=eqk, tnm=tnm)  # 相当于将risk.html和/risk路由相互绑定


@app.route('/discussion', methods=['GET', 'POST'])
def discussion():
    if request.method == 'GET':  # 默认情况下，Flask访问路由响应GET请求
        pms = request.args.get('pms')
        usr = request.args.get('usr')
        if (pms == '管理员') | (pms == '普通用户'):
            return render_template('discussion.html', pms=pms, usr=usr)
        else:
            return render_template('discussion.html', pms=pms_d, usr=usr_d)
    elif request.method == 'POST':
        if request.form['status'] == 'send':
            usr_name = request.form['usr_name']
            statement = request.form['statement']
            record_statement(conn, cursor, usr_name, statement)
            return 'DONE!'
        elif request.form['status'] == 'get':
            return match_all_statement(conn, cursor)


@app.route('/data', methods=['GET', 'POST'])
def data():
    if request.method == 'GET':  # 默认情况下，Flask路由响应GET请求
        pms = request.args.get('pms')  # get请求获取数据方法
        usr = request.args.get('usr')
        if pms == '管理员':
            return render_template('data.html', pms=pms, usr=usr)
        else:
            return 'error'
    elif request.method == 'POST':
        status = request.form['status']
        if status == 'send_data':
            dis_type = request.form['type']
            data_c = request.form.getlist('data')
            if dis_type == '0':
                vol_data = data_c[0].split(',')[:15]
                volcano_eruption_storage(conn, cursor, vol_data[12], vol_data[0], vol_data[1], vol_data[6], vol_data[3],
                                         vol_data[4], vol_data[5], vol_data[7], vol_data[2], vol_data[13], vol_data[9],
                                         vol_data[8], vol_data[10], vol_data[11], vol_data[14])
            elif dis_type == '1':
                eqk_data = data_c[0].split(',')[15:22]
                earthquake_storage(conn, cursor, eqk_data[0], eqk_data[6], eqk_data[2], eqk_data[5], eqk_data[4],
                                   eqk_data[3], eqk_data[1])
            elif dis_type == '2':
                tnm_data = data_c[0].split(',')[22:]
                tsunami_storage(conn, cursor, tnm_data[7], tnm_data[6], tnm_data[5], tnm_data[0], tnm_data[1],
                                tnm_data[2], tnm_data[3], tnm_data[8], tnm_data[4], tnm_data[10], tnm_data[9])
            return 'done!'


if __name__ == '__main__':
    app.run(port=8080, debug=True)  # DEBUG模式下刷新网页即可更新
