import os
from flask import Flask, flash, request, redirect, url_for, render_template


app = Flask(__name__, template_folder="./GNDAS", static_folder='./GNDAS', static_url_path="")

# Flask中的route()装饰器用于将URL绑定到函数
@app.route('/', methods=['GET', 'POST'])
def login():
   if request.method == 'GET': # 默认情况下，Flask路由响应GET请求
      return render_template('main.html')
   elif request.method == 'POST':
      email = request.values['email']
      password = request.form['password'] # 获取值的两种方法
      print(email)
      print(password)
      return redirect(url_for('main_process'))

@app.route('/result', methods=['GET', 'POST'])
def main_process():
   return render_template('view.html')

if __name__ == '__main__':
   # 写完网页之前开启调式模式 debug=True
   app.run(port=8080,debug = True)
