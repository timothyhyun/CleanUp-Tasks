import utility

class Agent:
    

    # Storing history of 

    partnerLocation = []
    decision = []

    def __init__ (self):
        self.partnerLocation = []

    
    def addLocation(self, x, y, c):
        self.partnerLocation.append((x,y,c))


    def computeSink(self, x, y, maze):

        for i in range(5):
            for j in range(5):
                maze[y//10+i][x//10+j] = 1
        return maze


    def addMoves(self, path):
        (currenty, currentx) = path[0]
        for move in path[1:]:
            (y,x) = move
            if currenty > y:
                if self.decision[-1][0] == "U":
                    self.decision[-1][1] +=5
                else :
                    self.decision.append(["U", 5])
            elif currenty < y:
                if self.decision[-1][0] == "D":
                    self.decision[-1][1] +=5
                else :
                    self.decision.append(["D", 5])
            elif currentx > x:
                if self.decision[-1][0] == "L":
                    self.decision[-1][1] +=5
                else :
                    self.decision.append(["L", 5])
            elif currentx < x:
                if self.decision[-1][0] == "R":
                    self.decision[-1][1] +=5
                else :
                    self.decision.append(["R", 5])
            currentx = x
            currenty = y





    def computeTurn(self, player, ag, items, rsink, bsink, gsink):

        # create maze for A* algorithm  (1000x600)
        # each turn in the algorithm will be the width of the block or 10px (100x60)
        maze = [[0 for i in range(100)] for j in range(60)]

        # fill up maze with player, sinks and items, 
        maze[player["y"]//10][player["x"]//10] = 1
        maze[player["y"]//10 + 1][player["x"]//10] = 1
        maze[player["y"]//10][player["x"]//10 + 1] = 1
        maze[player["y"]//10+1][player["x"]//10+1] = 1 
        

    
        for item in items:
            if item["status"]:
                maze[item["y"]//10][item["x"]//10] = 1
        
        

        maze = self.computeSink(rsink["x"], rsink["y"], maze)
        maze = self.computeSink(bsink["x"], bsink["y"], maze)
        maze = self.computeSink(gsink["x"], gsink["y"], maze)




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
            if dist < min and item["status"] == True:
                pick = item
                min = dist
                loc = i
                dx = itemX - agentX
                dy = itemY - agentY
    
        start = (ag["y"]//10, ag["x"]//10)
        end = (pick["y"]//10-1, pick["x"]//10)
    

        path = utility.astar(maze, start, end)


        # initial start
        (iy,ix) = path[0]
        dx = ix*10 - ag["x"]
        dy = iy*10 - ag["y"]

        if dx > 0:
            self.decision.append(["R", abs(dx)//2])
        else:
            self.decision.append(["L", abs(dx)//2])

        if dy > 0:
            self.decision.append(["D", abs(dy)//2])
        else:
            self.decision.append(["U", abs(dy)//2])

        # add moves        
        self.addMoves(path)

        # pick up item
        self.decision.append(["I"+str(loc),1])

        # go to corresponding sink
        color = pick["color"]    
        if (color == "red"):
            send = (rsink["y"]//10 + 5, rsink["x"]//10 + 1)
            if maze[rsink["y"]//10 + 5][rsink["x"]//10 + 1] == 1 :
                send = (rsink["y"]//10 + 5, rsink["x"]//10 + 5)
        elif (color == "green"):
            send = (gsink["y"]//10 + 5, gsink["x"]//10 + 1)
            if maze[gsink["y"]//10 + 5][gsink["x"]//10 + 1] == 1 :
                send = (gsink["y"]//10 + 5, gsink["x"]//10 + 3)
        elif (color == "blue"):
            send = (bsink["y"]//10 + 5, bsink["x"]//10 + 1)
            if maze[bsink["y"]//10 + 5][bsink["x"]//10 + 1] == 1 :
                send = (bsink["y"]//10 + 5, bsink["x"]//10 + 3)


        path = utility.astar(maze, end, send)
        self.addMoves(path)
        self.decision.append(["P", 1])


    def getTurn(self ):
        temp =  self.decision
        self.decision = []
        return temp



    