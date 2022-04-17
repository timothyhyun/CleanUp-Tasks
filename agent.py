


class Agent:
    

    # Storing history of 

    partnerLocation = []
    currentState = ""
    decision = []

    def __init__ (self):
        self.partnerLocation = []
        self.currentState = ""

    
    def addLocation(self, x, y, c):
        self.partnerLocation.append((x,y,c))


    def computeTurn(self, player, ag, items ):
        pass

    def getTurn(self ):
        return self.decision
    

