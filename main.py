from flask import Flask, render_template, url_for, redirect, request, jsonify
from agent import Agent

import json


app = Flask(__name__)
app.secret_key = "secret_key"
key = "id"



curAgent = None



@app.route("/receiveLocations")
def receiveData():
    global curAgent
    playerX= int(request.args.get("x"))
    playerY = int(request.args.get("y"))
    playerC = int(request.args.get("carry"))
    curAgent.addLocation(playerX, playerY, playerC)
    return "none"
    

decision = []

@app.route("/receiveTurn")
def receiveTurn():
    global decision
    player = {}
    player["x"] = int(request.args.get("px"))
    player["y"] = int(request.args.get("py"))
    player["carry"] = int(request.args.get("pc"))
    ag = {}
    ag["x"] = int(request.args.get("ax"))
    ag["y"] = int(request.args.get("ay"))
    ag["carry"] = int(request.args.get("ac"))
    rsink = {}
    rsink["x"] = int(request.args.get("rsx"))
    rsink["y"] = int(request.args.get("rsy"))
    bsink = {}
    bsink["x"] = int(request.args.get("bsx"))
    bsink["y"] = int(request.args.get("bsy"))
    gsink = {}
    gsink["x"] = int(request.args.get("gsx"))
    gsink["y"] = int(request.args.get("gsy"))


    items = []
    for i in range(15):
        temp = {}

        tx = int(request.args.get("i"+str(i)+"x"))
        temp["x"] = tx
        ty = int(request.args.get("i"+str(i)+"y"))
        temp["y"] = ty
        ts = request.args.get("i"+str(i)+"s")
        if (ts == "true"):
            temp["status"] = True
        else:
            temp["status"] = False 
        tc = request.args.get("i"+str(i)+"c")
        temp["color"] = tc
        items.append(temp)

    curAgent.computeTurn(player, ag, items, rsink, bsink, gsink)
    decision = curAgent.getTurn()

    return "none"



@app.route("/sendTurn")
def sendTurn():
    return jsonify({"turn": decision})


@app.route("/")
@app.route("/home")
def home():
    global curAgent
    curAgent = Agent()
    return render_template('index.html') 


if __name__ == "__main__":
    app.run(debug=True)

