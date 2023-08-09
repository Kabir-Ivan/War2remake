const { render } = require('react-dom');
const GameMap = require('./lib/Map');
const Structure = require("./lib/Structure");
const {Sprite} = require("./utils/sprite");
const socket = io();
const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;
let mousePos = [0, 0];
let mp = new GameMap([
    ["G", "G", "G", "G", "G"],
    ["G", "G", "G", "G", "G"],
    ["G", "S", "S", "S", "G"],
    ["G", "S", "S", "S", "G"],
    ["G", "G", "G", "G", "G"]
], []);
let selectedIds = [];
let cursorType = "standard";
let cursors = {
    "standard": {
        img: new Sprite("./img/glove.png", [0, 0], [28, 34], 0, [0], "vertical", false, 0, "no", 1),
        offset: [12, 15],
    },
    "point": {
        img: new Sprite("./img/pointHuman.png", [0, 0], [29, 34], 0, [0], "vertical", false, 0, "no", 1),
        offset: [15, 17],
    },
    "crosshair": {
        img: new Sprite("./img/crosshair.png", [0, 0], [16, 16], 0, [0], "vertical", false, 0, "no", 1),
        offset: [0, 0],
    },
}
onmousemove = function(e){mousePos = [e.clientX, e.clientY]};
let lastActionPos = [],
    lastActionType = -1;
    mouseDownCount = 0;
document.body.onmousedown = function(evt) {
    let buttonPressed = evt.button;
    lastActionPos = mousePos;
    lastActionType = buttonPressed;
    cursorType = 'crosshair';
    //document.body.style.cursor = 'crosshair';
    // console.log(evt);
    ++mouseDownCount;
}
document.body.onmouseup = function(evt) {
    if(lastActionType == 0) {
        let x1 = Math.max(lastActionPos[0], mousePos[0]);
        let x2 = Math.min(lastActionPos[0], mousePos[0]);
        let y1 = Math.max(lastActionPos[1], mousePos[1]);
        let y2 = Math.min(lastActionPos[1], mousePos[1]);
        // alert();
        selectedIds = mp.select([x2, y2], [x1 - x2, y1 - y2]);
        // alert(selectedIds);
        console.log([[x2, y2], [x1 - x2, y1 - y2]])
        // console.log(lastActionPos, [mousePos[0] - lastActionPos[0], mousePos[1] - lastActionPos[1]]);
        for(let i = 0; i < mp.objects.length; i++) {
            if(selectedIds.indexOf(mp.objects[i].id) != -1) {
                mp.objects[i].showRect = true;
            }
            else {
                mp.objects[i].showRect = false;
            }
        }
    }
    //document.body.style.cursor = './img/Glove.png';
    cursorType = 'standard';
    lastActionType = -1;
    --mouseDownCount;
}
canvas.width = window.innerWidth * 0.9;
canvas.height = window.innerHeight * 0.9;
document.body.appendChild(canvas);
const renderLoop = () => {
    requestAnimationFrame(renderLoop);
    mp.render(ctx);
    if(lastActionType == 0 && mouseDownCount) {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.beginPath();
        ctx.lineWidth = "1";
        ctx.strokeStyle = "#00ff00";
        ctx.rect(lastActionPos[0] + 0.5, lastActionPos[1] + 0.5, mousePos[0] - lastActionPos[0], mousePos[1] - lastActionPos[1]);
        ctx.stroke();
    }
    let curCursor = cursors[cursorType];
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.translate(mousePos[0] + curCursor.offset[0], mousePos[1] + curCursor.offset[1]);
    curCursor.img.render(ctx);


}


socket.on('message', function(msg){
    mp.tiles = msg.tiles;
    mp.objects = [];
    for(let i = 0; i < msg.objects.length; i++) {
        let object = new Structure();
        object.fromJSON(msg.objects[i]);
        if(selectedIds.indexOf(object.id) != -1) {
            object.showRect = true;
        }
        mp.objects.push(object);
    }
    //mp.render(ctx);
    /*mp.render(ctx);
    if(lastActionType == 0 && mouseDownCount) {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.beginPath();
        ctx.lineWidth = "1";
        ctx.strokeStyle = "#00ff55";
        ctx.rect(lastActionPos[0], lastActionPos[1], mousePos[0] - lastActionPos[0], mousePos[1] - lastActionPos[1]);
        ctx.stroke();
    }*/
    // console.log(selectedIds);
    document.getElementById("message").innerHTML = msg;
});
renderLoop();