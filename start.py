from flask import Flask, request, redirect, url_for, render_template, jsonify
from sql import connect_database, login_in, volcano_eruption_all_matched, tsunami_all_matched, earthquake_all_matched,registered
import json

app = Flask(__name__, template_folder="./webpage", static_folder='./webpage', static_url_path="")
conn, cursor = connect_database()
usr = ''
pms = ''


# Flask中的route()装饰器用于将URL绑定到函数 即将网页html文件发布到对应路由上
@app.route('/', methods=['GET', 'POST'])
def login():
    if request.method == 'GET':  # 默认情况下，Flask访问路由响应GET请求
        return render_template('main.html')
    elif request.method == 'POST':
        email = request.values['email']
        password = request.form['password']
        status = request.form['status'] # 代表本次请求是登录(true)or注册(false)
        global usr, pms
        usr = email.split('@')[0]
        pms = '管理员' if status[1] else '普通用户'
        if status: # 此时正在进行登录操作
            log_status = login_in(conn, cursor, email, password)
            if log_status[0]: # 系统中有该用户
                return redirect(url_for('main_process')) # redirect以get方法访问
            else:
                return 'error' # redirect以get方法访问
        else: # 此时正在进行注册操作
            registered(conn, cursor, email, password) #注册用户
            return redirect(url_for('main_process'))


@app.route('/result', methods=['GET', 'POST'])
def main_process():
    if request.method == 'GET':  # 默认情况下，Flask访问路由响应GET请求
        vol = volcano_eruption_all_matched(conn, cursor)
        eqk = earthquake_all_matched(conn, cursor)
        tnm = tsunami_all_matched(conn, cursor)
        return render_template('view.html', pms=pms, usr=usr, vol=vol, eqk=eqk, tnm=tnm)
    elif request.method == 'POST':
        return 1

@app.route('/risk', methods=['GET', 'POST'])
def risk():
    if request.method == 'GET':  # 默认情况下，Flask访问路由响应GET请求
        return render_template('risk.html') # 相当于将risk.html和/risk路由相互绑定

@app.route('/discussion', methods=['GET', 'POST'])
def discussion():
    if request.method == 'GET':  # 默认情况下，Flask访问路由响应GET请求
        return render_template('discussion.html')

@app.route('/data', methods=['GET', 'POST'])
def data():
    if request.method == 'GET':  # 默认情况下，Flask路由响应GET请求
        return render_template('data.html')

if __name__ == '__main__':
    app.run(port=8080, debug=True) # DEBUG模式下刷新网页即可更新

