var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");


// current widths
// item: 10
// sinks: 50
// player: 20

var player = {
    x: 10,
    y: 10,
    x_v: 0,
    y_v:0,
    carry: 0, 
    width: 20
};

var agent = {
    x: canvas.width - 30,
    y: 10,
    x_v: 0,
    y_v: 0, 
    width : 20
};

var keys = {
    right:false, 
    left:false,
    up:false,
    down:false, 
    interact: false
};


var ysinks = {
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
    x: canvas.width,
    y: canvas.height/2,
    width: 50
};




var colorDict = {"yellow": 1, "blue": 2, "green":3};
var playerTurn = true;


// Initializing Boxes
var itemCount = 15;
var items = [];
for (var c = 0; c < itemCount; c++) {
    items[c] = {x:0, y:0, status: true, color: "", width: 10};
}
var i = 0;
while (i < 15){
    var tx = Math.floor(Math.random() * 300) + canvas.width/2;
    var ty = Math.floor(Math.random() * 300) + canvas.height/2;
    if (i%3 == 0){
        var colorx = "blue";
    } else if (i%3 == 1){
        var colorx = "yellow";
    } else {
        var colorx = "green";
    }
    var valid = true;
    for (var d = 0; d < itemCount; d++){
        var temp = items[d];
        if (tx < temp.x+25 || tx+25 > temp.x ) {
            valid = false;
        } 
        if (ty < temp.y+25 || ty+25 > temp.y ) {
            valid = false;
        }
    }
    if (valid) {
        i++;
        items[i] = {x:tx, y:ty, status: true, color:colorx, width:10};
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
    } else if (e.key == "Spacebar" || e.key == ' '){
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
    } else if (e.key == "Spacebar" || e.key == ' '){
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
    ctx.rect(ysinks.x, ysinks.y, ysinks.width, ysinks.width);
    ctx.fillStyle = "yellow";
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
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    ctx.rect(agent.x, agent.y, agent.width, agent.width);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();

}


function move() {
    var dx = 0;
    var dy = 0;
    if (keys.left) {
        dx -= 3;
    }
    if (keys.right) {
        dx += 3;
    }
    if (keys.up) {
        dy += 3;
    }
    if (keys.down) {
        dy -= 3;
    }

    newX = player.x + dx;
    newY = player.y + dy;
    var validSpot = true;
    // test collisions with items
    for (var i = 0; i < itemCount; i++) {
        var temp = items[i];
        xvalid = true;
        yvalid = true;
        if (temp.status && newX > temp.x && newX < temp.x + temp.width) {
            xvalid = false;
        }
        if (temp.status && newX+ player.width > temp.x && newX + player.width  < temp.x + temp.width) {
            xvalid = false;
        }
        if (temp.status && newY > temp.y && newY < temp.y + temp.width) {
            yvalid = false;
        }
        if (temp.status && newY+playerer.width > temp.y && newY+player.width < temp.y + temp.width) {
            yvalid = false;
        }
        if (!xvalid && !yvalid) {
            validSpot = false;
        }
        
    }
    
    // test collisions with sinks and agent
    const iterArray = [ysinks, bsinks, gsinks, agent];

    for (const ites of iterArray) {
        xvalid = true;
        yvalid = true;
        if (newX > ites.x && newX < ites.x + ites.width) {
            xvalid = false;
        }
        if (newX + player.width > ites.x && newX + player.width  < ites.x + ites.width) {
            xvalid = false;
        }
        if (newY > ites.y && newY < ites.y + ites.width) {
            yvalid = false;
        }
        if (newY+playerer.width > ites.y && newY+player.width < ites.y + ites.width) {
            yvalid = false;
        }
        if (!xvalid && !yvalid) {
            validSpot = false;
        }
    }

    // collision with boundaries

    if (newX < 0 || newX + player.width > canvas.width || newY < 0 || newY + player.width > canvas.height) {
        validSpot = false;
    }

    if (validSpot) {
        player.x = newX;
        player.y = newY;
    } 



}

function interactions () {
    if (key.interact) {
        // place block on sink

        const maps = [ysinks, bsinks, gsinks];
        var i = 1;
        for (const map of maps) {
            if (map.x - player.x + player.width < 20 && player.y > map.y && player.y + player.width < map.y + map.width && player.carry == i) {
                player.carry = 0;
                sendData();
                playerTurn = false;
            }
            if (player.x - map.x < 20 && player.y > map.y && player.y + player.width < map.y + map.width && player.carry == i) {
                player.carry = 0;
                sendData();
                playerTurn = false;
            }
            if (player.y - map.y < 20 && player.x > map.x && player.x + player.width < map.x + map.width && player.carry == i) {
                player.carry = 0;
                sendData();
                playerTurn = false;
            }
            if (map.y - (player.y + player.width) < 20 && player.x > map.x && player.x + player.width < map.x + map.width && player.carry == i) {
                player.carry = 0;
                sendData();
                playerTurn = false;
            }
            i++;
        }

        // pick up block

        for (const item in items) {
            if (item.x - player.x + player.width < 20 && player.y < item.y && player.y + player.width > item.y + item.width && player.carry == 0 && item.status) {
                player.carry = colorDict[item.color];
                item.status = false;
            }
            if (player.x - item.x < 20 && player.y < item.y && player.y + player.width > item.y + item.width && player.carry == 0 && item.status) {
                player.carry = colorDict[item.color];
                item.status = false;
            }
            if (player.y - item.y < 20 && player.x < item.x && player.x + player.width > item.x + item.width && player.carry == 0 && item.status) {
                player.carry = colorDict[item.color];
                item.status = false;
            }
            if (item.y - (player.y + player.width) < 20 && player.x < item.x && player.x + player.width > item.x + item.width && player.carry == 0 && item.status) {
                player.carry = colorDict[item.color];
                item.status = false;
            }
        }



        
    }
}




function draw() {
    drawPlayers();
    drawSinks();
    drawItems();
    if (playerTurn) {
        move();
        interactions();
    }
}


// need: function to continually send data to server

function sendData() {
    if (playerTurn) {
        $.getJSON('/recieveLocations',
            {player: player},
            function(data) {

        });
    }
}

function sendTotal() {
    $.getJSON('/recieveTurn',
            {player:player, item: items, agent: agent},
            function(data) {

        });
}

// need: function to continually listen for data from server

function receiveData() {
    if (!playerTurn) {
        fetch('/sendTurn')
             .then(function (response) {
                return response.json();
            }).then(function (text) {
                

            });
    }
}



window.onload = function (){
    var update_loop = setInterval(draw, 10);
    draw();
};

window.onload = function (){
    var update_loop = setInterval(draw, 10);
    draw();
};

window.onload = function (){
    var update_loop = setInterval(draw, 10);
    draw();
};