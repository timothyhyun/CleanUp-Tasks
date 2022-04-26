var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");


// current widths
// item: 10
// sinks: 50
// player: 20

var player = {
    x: 10,
    y: 10,
    carry: 0, 
    close: -1,
    width: 20
};

var agent = {
    x: canvas.width - 30,
    y: 10,
    carry: 0,
    width : 20
};

var keys = {
    right:false, 
    left:false,
    up:false,
    down:false, 
    interact: false
};


var rsinks = {
    x: canvas.width/2,
    y: 0,
    width: 50
};

var bsinks = {
    x: 0,
    y: canvas.height/2,
    width: 50
};

var gsinks = {
    x: canvas.width - 50,
    y: canvas.height/2,
    width: 50
};



var colorList = ["red", "blue", "green"];
var colorDict = {"red": 1, "blue": 2, "green":3};
var playerTurn = true;


var startTime; 


// Initializing Boxes
var itemCount = 15;
var items = [];
for (var c = 0; c < itemCount; c++) {
    items[c] = {x:0, y:0, status: true, color: "", width: 10};
}
var i = 0;
while (i < 15){
    var tx = Math.round((Math.floor(Math.random() * 400) + canvas.width/2 - 200)/10)*10 ;
    var ty = Math.round((Math.floor(Math.random() * 300) + canvas.height/2 - 150) / 10) * 10 ;
    if (i%3 == 0){
        var colorx = "blue";
    } else if (i%3 == 1){
        var colorx = "red";
    } else {
        var colorx = "green";
    }
    var valid = true;
    for (var d = 0; d < itemCount; d++){
        var temp = items[d];
        if (Math.abs(temp.x - tx) < 25 && Math.abs(temp.y - ty) < 25) {
            valid = false;
        }
    }
    if (valid) {
        items[i] = {x:tx, y:ty, status: true, color:colorx, width:10};
        i++;
    }

}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        keys.right = true;
    } else if(e.key == "Left" || e.key == "ArrowLeft") {
        keys.left = true;
    } else if (e.key =="Up" || e.key == "ArrowUp") {
        keys.up = true;
    } else if (e.key == "Down" || e.key == "ArrowDown") {
        keys.down = true;
    } else if (e.code == "Space" || e.key == " "){
        keys.interact = true;
    }  
}

function keyUpHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        keys.right = false;
    } else if(e.key == "Left" || e.key == "ArrowLeft") {
        keys.left = false;
    } else if (e.key =="Up" || e.key == "ArrowUp") {
        keys.up = false;
    } else if (e.key == "Down" || e.key == "ArrowDown") {
        keys.down = false;
    } else if (e.code == "Space" || e.key == ' '){
        keys.interact = false;
    } 
}


function drawItems(){
    for (var c = 0; c < itemCount; c++){
        temp = items[c];
        if (temp.status){
            ctx.beginPath();
            ctx.rect(temp.x, temp.y, temp.width, temp.width);
            ctx.fillStyle = temp.color;
            ctx.fill();
            ctx.closePath();
        }
        
    }

}

function drawSinks(){
    ctx.beginPath();
    ctx.rect(rsinks.x, rsinks.y, rsinks.width, rsinks.width);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    ctx.rect(gsinks.x, gsinks.y, gsinks.width, gsinks.width);
    ctx.fillStyle = "green";
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    ctx.rect(bsinks.x, bsinks.y, bsinks.width, bsinks.width);
    ctx.fillStyle = "blue";
    ctx.fill();
    ctx.closePath();
}


function drawPlayers(){
    ctx.beginPath();
    ctx.rect(player.x, player.y, player.width, player.width);
    ctx.fillStyle = "#0B3349";
    ctx.fill();
    ctx.closePath();
    if (player.carry != 0){
        ctx.beginPath();
        ctx.rect(player.x + player.width/2 - 5, player.y + player.width/2 - 5, 10, 10);
        ctx.fillStyle = colorList[player.carry - 1];
        ctx.fill();
        ctx.closePath();
    }

    ctx.beginPath();
    ctx.rect(agent.x, agent.y, agent.width, agent.width);
    ctx.fillStyle = "#871613";
    ctx.fill();
    ctx.closePath();
    if (agent.carry != 0){
        ctx.beginPath();
        ctx.rect(agent.x + agent.width/2 - 5, agent.y + agent.width/2 - 5, 10, 10);
        ctx.fillStyle = colorList[agent.carry - 1];
        ctx.fill();
        ctx.closePath();
    }

}


function calculateClose (newX, newY) {
    for (var i = 0; i < itemCount; i++) {
        var temp = items[i];
        xvalid = true;
        yvalid = true;
        if (temp.status && newX < temp.x && newX + player.width> temp.x ) {
            xvalid = false;
        }
        if (temp.status && newX < temp.x + temp.width && newX + player.width  > temp.x + temp.width) {
            xvalid = false;
        }
        if (temp.status && newY < temp.y && newY + player.width > temp.y ) {
            yvalid = false;
        }
        if (temp.status && newY <  temp.y + temp.width && newY+player.width > temp.y + temp.width) {
            yvalid = false;
        }
        if (!xvalid && !yvalid) {
            validSpot = false;
            return i;
        }   
    }

    // test collisions with sinks and agent
    const iterArray = [rsinks, bsinks, gsinks, agent];

    for (var j = 0; j < 4; j++) {
        var ites = iterArray[j];
        xvalid = true;
        yvalid = true;
        if (newX >= ites.x && newX < ites.x + ites.width) {
            xvalid = false;
        }
        if (newX + player.width >= ites.x && newX + player.width  < ites.x + ites.width) {
            xvalid = false;
        }
        if (newY >= ites.y && newY < ites.y + ites.width) {
            yvalid = false;
        }
        if (newY+player.width >= ites.y && newY+player.width < ites.y + ites.width) {
            yvalid = false;
        }
        if (!xvalid && !yvalid) {
                return j + 15;
        }
    }
    return -1;
}





function move() {
    var dx = 0;
    var dy = 0;
    if (keys.left) {
        dx -= 2;
    }
    if (keys.right) {
        dx += 2;
    }
    if (keys.up) {
        dy -= 2;
    }
    if (keys.down) {
        dy += 2;
    }

    newX = player.x + dx;
    newY = player.y + dy;
    var validSpot = true;

    // collisions with items, sinks and agent
    var close = calculateClose(newX, newY);
    if (close != -1){
        validSpot = false;
    } 
    if (close != 18) {
        player.close = close;
    } 
    // collision with boundaries
    if (newX < 0 || newX + player.width > canvas.width || newY < 0 || newY + player.width > canvas.height) {
        validSpot = false;
        player.close = -1;
    }

    if (validSpot) {
        player.x = newX;
        player.y = newY;
        player.close = -1;
    } 

}



function interactions () {
    if (keys.interact && player.close > -1) {
        // place block on sink


        if (player.close < 15 && player.carry == 0){
            temp = items[player.close];
            player.carry = colorDict[temp.color];
            temp.status = false;

        } else {
            var index = player.close - 15 + 1;
            if (player.carry == index){
                sendTotal();
                player.carry = 0;
                playerTurn = false;
            }
        }
        

    }
}

function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}



function updateTime(){
    current = Date.now();
    document.getElementById("timer").innerHTML = (current - startTime)/1000
}



function endCondition(){
    for (var c = 0; c < itemCount; c++){
        temp = items[c];
        if (temp.status){
            return false
        }
    }
    document.getElementById("timer").innerHTML = "Game Over!"
    return true
}



var command = -1;
var innerCommand = 0;
var commands = [];
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayers();
    drawSinks();
    drawItems();
    if (endCondition()){
        return
    }
    updateTime();

    if (playerTurn) {
        move();
        interactions();
        command = -1;
    }  else {
        
        if (commands.length == 0){
            receiveData();
        } else {
            console.log(commands)
            executeCommand();
        }
       
    }
}




function executeAction(action) {
    if (action == "L") {
        agent.x -= 2;
    } else if (action == "R") {
        agent.x += 2;
    } else if (action == "U") {
        agent.y -= 2;
    } else if (action == "D") {
        agent.y += 2;
    } else if (action[0] == "I") {
        i = action.slice(-1)
        if (i != -1 && i != 18 && i < 15) {
            item = items[i];
            agent.carry = colorDict[item.color];
            item.status = false;
        } 
    } else if (action[0] == "P") {
        agent.carry = 0
    }
}

function executeCommand() {
    if (commands == [] || commands.length == 0){
        return;
    }
    if (command == commands.length){
        playerTurn = true;
        commands = []
        innerCommand = 0
        command = -1;
        return;
    } else {
        var current = commands[command];
        var size = current[1];
        var action = current[0];
        if (innerCommand == size) {
            innerCommand = 0;
            command++;
        } else {
            executeAction(action)
            innerCommand++;
        }   
    }
    
}


// need: function to continually send data to server

function sendData() {
    if (playerTurn) {
        $.getJSON('/receiveLocations',
            {x:player.x, y:player.y, carry: player.carry},
            function(data) {

        });
    }
}




function sendTotal() { 
    $.getJSON('/receiveTurn',
            {px: player.x, py: player.y, pc: player.carry, ax:agent.x, ay: agent.y, ac: agent.carry, 
                rsx:rsinks.x, rsy:rsinks.y, bsx: bsinks.x, bsy: bsinks.y, gsx: gsinks.x, gsy: gsinks.y,
                i0x: items[0].x, i0y: items[0].y, i0c: items[0].color, i0s: items[0].status,
                i1x: items[1].x, i1y: items[1].y, i1c: items[1].color, i1s: items[1].status,
                i2x: items[2].x, i2y: items[2].y, i2c: items[2].color, i2s: items[2].status,
                i3x: items[3].x, i3y: items[3].y, i3c: items[3].color, i3s: items[3].status,
                i4x: items[4].x, i4y: items[4].y, i4c: items[4].color, i4s: items[4].status,
                i5x: items[5].x, i5y: items[5].y, i5c: items[5].color, i5s: items[5].status,
                i6x: items[6].x, i6y: items[6].y, i6c: items[6].color, i6s: items[6].status,
                i7x: items[7].x, i7y: items[7].y, i7c: items[7].color, i7s: items[7].status,
                i8x: items[8].x, i8y: items[8].y, i8c: items[8].color, i8s: items[8].status,
                i9x: items[9].x, i9y: items[9].y, i9c: items[9].color, i9s: items[9].status,
                i10x: items[10].x, i10y: items[10].y, i10c: items[10].color, i10s: items[10].status,
                i11x: items[11].x, i11y: items[11].y, i11c: items[11].color, i11s: items[11].status,
                i12x: items[12].x, i12y: items[12].y, i12c: items[12].color, i12s: items[12].status,
                i13x: items[13].x, i13y: items[13].y, i13c: items[13].color, i13s: items[13].status,
                i14x: items[14].x, i14y: items[14].y, i14c: items[14].color, i14s: items[14].status},
            function(data) {

        });
}

// need: function to continually listen for data from server

function receiveData() {
    if (!playerTurn && command == -1) {
        fetch('/sendTurn')
            .then(function (response) {
                return response.json();
            }).then(function (text) {
                console.log("Recieving")
                commands = text["turn"]
                command = 0;
                if (commands == [] || commands.length == 0) {
                    command = -1
                    console.log("Retrying")
                }
                
            });
    }
}

$(document).ready(function() {
    setTimeout(function tick() {
        draw();
        timerId = setTimeout(tick, 10); 
      }, 10);
});


$(document).ready(function() {
 
    startTime = Date.now();
    setInterval(sendData, 100);
});


/*
$(document).ready(function() {
    setTimeout(function tick() {
        receiveData();
        timerId = setTimeout(tick, 10); 
      }, 10);
});
*/




