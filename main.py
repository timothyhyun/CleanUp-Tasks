from flask import Flask, render_template, url_for, redirect, request, jsonify
from agent import Agent

import json


app = Flask(__name__)
app.secret_key = "secret_key"
key = "id"
currentMove = ""
history = []

curAgent = None



@app.route("/receiveLocations")
def receiveData():
    player = request.args.get("player")
    print("Hi")
    #curAgent.addLocation(player)
    return "none"
    



@app.route("/receiveTurn")
def receiveTurn():
    return "none"



@app.route("/sendTurn")
def sendTurn():
    return jsonify({"turn": currentMove})


@app.route("/")
@app.route("/home")
def home():
    global agent
    curAgent = Agent()
    return render_template('index.html') 


if __name__ == "__main__":
    app.run(debug=True)

