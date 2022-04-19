


class Agent:
    

    # Storing history of 

    partnerLocation = []
    decision = []

    def __init__ (self):
        self.partnerLocation = []

    
    def addLocation(self, x, y, c):
        self.partnerLocation.append((x,y,c))


    def computeTurn(self, player, ag, items, rsink, bsink, gsink):
        # find closest item
        agentX = ag["x"] + 10
        agentY = ag["y"] + 10
        pick = None
        min = 3000
        loc = -1
        for i,item in enumerate(items):
            itemX = item["x"] + 5
            itemY = item["y"] + 5
            dist = abs(agentX - itemX) + abs(agentY - itemY)
            if dist < min:
                pick = item
                min = dist
                loc = i
                dx = itemX - agentX
                dy = itemY - agentY
        
        # go to closest item
        if dx > 0:
            self.decision.append(["R", abs(dx)//2])
        else:
            self.decision.append(["L", abs(dx)//2])

        if dy > 0:
            self.decision.append(["D", abs(dy)//2 - 7])
        else:
            self.decision.append(["U", abs(dy)//2 - 7])
        
        # pick up item
        self.decision.append(["I"+str(loc),1])

        # go to corresponding sink

        color = item["color"]    
        if (color == "red"):
            pass
        elif (color == "green"):
            pass
        elif (color == "blue"):
            pass



        

    def getTurn(self ):
        temp =  self.decision
        self.decision = []
        return temp




    
    

