from flask import Flask, render_template, url_for, redirect, request, jsonify, session
from pyparsing import dblSlashComment
from agent import Agent
import sqlite3 as sql
import json
import uuid


app = Flask(__name__)
app.secret_key = "secret_key"
key = "id"
id = 0
curAgent = None
dataid = ""





#Send Data to Database
@app.route("/receiveLocations")
def receiveData():
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
    time = str(request.args.get("time"))

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

    global curAgent
    curAgent.addLocation(player["x"], player["y"], player["carry"])


    # Add Data
    c = sql.connect("database.db")
    cursor = c.cursor()
    # Query data to database
    cursor.execute("INSERT INTO states VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)", (dataid+time, dataid, player["x"], player["y"], player["carry"], ag["x"], ag["y"], ag["carry"], rsink["x"], rsink["y"], bsink["x"], bsink["y"], gsink["x"], gsink["y"]))
    itemnum = 0
    for item in items:
        cursor.execute("INSERT INTO items VALUES (?, ?, ?, ?, ?, ?)", (dataid+time+str(itemnum), item["x"], item["y"], item["status"], item["color"], dataid+time))
        itemnum += 1
    # commit queries
    c.commit()
    cursor.close()


    return "none"
    


# Compute Agent's Turn
decision = []
@app.route("/receiveTurn")
def receiveTurn():
    # Gather Game State
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

    # Compute Agent's Turn
    curAgent.computeTurn(player, ag, items, rsink, bsink, gsink)
    decision = curAgent.getTurn()

    return "none"


# Send Agent's Decision to Client
@app.route("/sendTurn")
def sendTurn():
    return jsonify({"turn": decision})


@app.route("/")
@app.route("/home")
def home():
    if key not in session:
        # Create session
        global id
        session[key] = id
        id += 1
        global dataid
        # create unique id for each game
        dataid = str(uuid.uuid1())
    global curAgent
    curAgent = Agent()
    return render_template('index.html') 


if __name__ == "__main__":
    app.run(debug=True)

