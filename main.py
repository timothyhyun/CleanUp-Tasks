from flask import Flask, render_template, url_for, redirect, request, session, jsonify
from agent import Agent

import json


app = Flask(__name__)
app.secret_key = "secret_key"
key = "id"
currentMove = ""
history = []



@app.route("/recieveLocations")
def recieveData():
    pass



@app.route("/recieveTurn")
def recieveTurn():
    pass





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
    global agent
    agent = Agent()
    return render_template('index.html') 


if __name__ == "__main__":
    app.run(debug=True)

