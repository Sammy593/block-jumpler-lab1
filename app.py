from flask import Flask, render_template, url_for

# initializations
app = Flask(__name__, template_folder='templates')

@app.route('/')
def index():
    return render_template('index.html')


 #  Iniciando la aplicaciones
if __name__ == "__main__":
    app.run(debug=True)