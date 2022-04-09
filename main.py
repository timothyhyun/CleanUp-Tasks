from flask import Flask, render_template, url_for, redirect, request, session, jsonify
import json


app = Flask(__name__)
app.secret_key = "secret_key"
key = "id"
currentMove = ""
history = []



@app.route("/startTurn")
def startTurn():
    curState = request.args.get("state")
    history.append(curState)
    currentMove = ""



@app.route("/sendTurn")
def sendTurn():
    return jsonify({"turn": currentMove})


@app.route("/")
@app.route("/home")
def home():
   return render_template('index.html') 


if __name__ == "__main__":
    app.run(debug=True)

