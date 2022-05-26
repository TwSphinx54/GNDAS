from flask import Flask, request, redirect, url_for, render_template, jsonify
from sql import connect_database, login_in, volcano_eruption_all_matched, tsunami_all_matched, earthquake_all_matched
import json

app = Flask(__name__, template_folder="./webpage", static_folder='./webpage', static_url_path="")
conn, cursor = connect_database()
usr = ''
pms = ''


# Flask中的route()装饰器用于将URL绑定到函数
@app.route('/', methods=['GET', 'POST'])
def login():
    if request.method == 'GET':  # 默认情况下，Flask路由响应GET请求
        return render_template('main.html')
    elif request.method == 'POST':
        email = request.values['email']
        password = request.form['password']
        status = request.form['status']
        global usr, pms
        usr = email.split('@')[0]
        pms = '管理员' if status[1] else '普通用户'
        if status:
            log_status = login_in(conn, cursor, email, password)
            if log_status[0]:
                return redirect(url_for('main_process'))
            else:
                return 'error'


@app.route('/result', methods=['GET', 'POST'])
def main_process():
    if request.method == 'GET':  # 默认情况下，Flask路由响应GET请求
        vol = volcano_eruption_all_matched(conn, cursor)
        eqk = earthquake_all_matched(conn, cursor)
        tnm = tsunami_all_matched(conn, cursor)
        return render_template('view.html', pms=pms, usr=usr, vol=vol, eqk=eqk, tnm=tnm)
    elif request.method == 'POST':
        status = request.form['status']
        if status == 'disaster':
            dis_type = request.form['type']
            if dis_type == 'volcano':
                vol = volcano_eruption_all_matched(conn, cursor)
                return jsonify(vol)
            elif dis_type == 'earthquake':
                eqk = earthquake_all_matched(conn, cursor)
                return jsonify(eqk)
            elif dis_type == 'tsunami':
                tnm = tsunami_all_matched(conn, cursor)
                return jsonify(tnm)


if __name__ == '__main__':
    app.run(port=8080, debug=True)
