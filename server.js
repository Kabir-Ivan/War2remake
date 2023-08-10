
/*import "./lib/map.js"
resources.load('img/Summer Tiles.png');
const GameMap = new Map(
[
    ['G', 'G', 'G', 'G'],
    ['G', 'G', 'G', 'G'],
    ['G', 'G', 'G', 'G'],
    ['G', 'G', 'G', 'G']
],
    []);
const rect = new GameMap([["G"]], []);
alert(rect.generateTile(0, 0));
rect.render(ctx);
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext("2d");
GameMap.render(ctx);*/
const GameMap = require('./js/lib/Map.js');
const Structure = require('./js/lib/Structure.js');
const express = require('express');
const path = require('path');
const app = require('express')();
const bodyParser = require('body-parser');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const fs = require('fs');
const FPS = 1;
const frameRate = 1000 / FPS;
let lastUpdate = Date.now();
app.use('/js', express.static(path.join(__dirname, '/js')));
app.use('/img', express.static(path.join(__dirname, '/img')));
app.use('/dist', express.static(path.join(__dirname, '/dist')));
app.use('/fonts', express.static(path.join(__dirname, '/fonts')));
app.use('/public', express.static(path.join(__dirname, '/public')));
app.use(bodyParser.json());
app.get('/', function (req, res) {

    //send the index.html file for all requests
    res.sendFile(__dirname + '/test.html');

});
app.get('/sprite_editor', function (req, res) {

    //send the index.html file for all requests
    res.sendFile(__dirname + '/frontend/pages/sprite_editor/index.html');

});

app.get('/api/get_img_names', (req, res) => {
    const imgDirectory = path.join(__dirname, 'img');
    fs.readdir(imgDirectory, (err, files) => {
        if (err) {
            console.error('Error reading directory:', err);
            res.status(500).send('Internal Server Error');
        } else {
            const fileNames = files.filter(file => fs.statSync(path.join(imgDirectory, file)).isFile());
            res.json(fileNames);
        }
    });
});

app.post('/api/add_animation', function (req, res) {
    const Folder = './sprites/animations';
    const fs = require('fs');
  
    if (!fs.existsSync(Folder)) {
      try {
        fs.mkdirSync(Folder, { recursive: true });
      } catch (error) {
        console.error('Error creating directory:', error);
        return res.status(500).json({ message: 'Error creating directory.' });
      }
    }
  
    let names = [];
    fs.readdirSync(Folder).forEach(file => {
      names.push(file);
    });
  
    let data = req.body;
    console.log(data);
    if (!data.name) {
      return res.status(400).json({ message: 'Something went wrong.' });
    }
    if (data.name.includes(".") || data.name.includes("/")) {
      return res.status(400).json({ message: 'Bad request.' });
    }
    if (names.includes(data.name + ".json")) {
      return res.status(400).json({ message: 'Name is already in use.' });
    }
    const filePath = `${Folder}/${data.name}.json`;
  
    fs.writeFile(filePath, JSON.stringify(data), (error) => {
      if (error) {
        console.error('Error saving file:', error);
        return res.status(500).json({ message: 'Error saving file.' });
      } else {
        console.log('File saved successfully.');
        return res.status(200).json({ message: 'File saved successfully.' });
      }
    });
  });
  

http.listen(80, function () {

    console.log('listening on *:80');

});

let mp = new GameMap([
    ["G", "G", "G", "G", "HW1", "OW1", "G", "M", "W", "W", "M", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G"],
    ["G", "DF", "DF", "G", "HW1", "OW1", "G", "M", "W", "W", "M", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G"],
    ["G", "DF", "DF", "G", "HW1", "OW1", "G", "M", "W", "W", "M", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G"],
    ["G", "G", "G", "G", "HW1", "OW1", "G", "M", "W", "W", "M", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G"],
    ["HW1", "HW1", "HW1", "HW1", "HW1", "OW1", "G", "M", "W", "W", "M", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G"],
    ["OW1", "OW1", "OW1", "OW1", "OW1", "OW1", "G", "M", "W", "W", "M", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G"],
    ["G", "G", "G", "G", "G", "G", "G", "M", "W", "W", "M", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G"],
    ["M", "M", "M", "M", "M", "M", "M", "M", "W", "W", "M", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G"],
    ["W", "W", "M", "M", "W", "W", "W", "W", "W", "W", "M", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G"],
    ["W", "W", "M", "M", "W", "W", "W", "W", "W", "W", "M", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G"],
    ["W", "W", "M", "M", "W", "W", "W", "W", "W", "W", "M", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G"],
    ["W", "W", "M", "M", "W", "W", "W", "W", "W", "W", "M", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G"],
    ["W", "W", "M", "M", "W", "W", "W", "W", "W", "W", "M", "G", "G", "G", "S", "S", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G"],
    ["W", "W", "M", "M", "W", "W", "W", "W", "W", "W", "M", "G", "G", "G", "S", "S", "S", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G"],
    ["W", "W", "M", "M", "W", "W", "W", "W", "W", "W", "M", "G", "G", "G", "S", "S", "S", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G"],
    ["W", "W", "M", "M", "W", "W", "W", "W", "W", "W", "M", "G", "G", "G", "G", "S", "S", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G"],
    ["W", "W", "M", "M", "W", "W", "W", "W", "W", "W", "M", "G", "G", "G", "G", "S", "S", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G"],
    ["W", "W", "M", "M", "W", "W", "W", "W", "W", "W", "M", "G", "G", "G", "S", "S", "S", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G"],
    ["W", "W", "M", "M", "W", "W", "W", "W", "W", "W", "M", "G", "G", "G", "S", "S", "S", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G"],
    ["W", "W", "M", "M", "W", "W", "W", "W", "W", "W", "M", "G", "G", "G", "G", "S", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G"],
    ["W", "W", "M", "M", "W", "W", "W", "W", "W", "W", "M", "G", "G", "G", "G", "S", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G"],
    ["W", "W", "M", "M", "W", "W", "W", "W", "W", "W", "M", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G"],
    ["W", "W", "M", "M", "W", "W", "W", "W", "W", "W", "M", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G"],
    ["W", "W", "M", "M", "W", "W", "W", "W", "W", "W", "M", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G"],
    ["W", "W", "M", "M", "W", "W", "W", "W", "W", "W", "M", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G"],
    ["W", "W", "M", "M", "W", "W", "W", "W", "W", "W", "M", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G"],
    ["W", "W", "M", "M", "W", "W", "W", "W", "W", "W", "M", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G"],
    ["W", "W", "M", "M", "W", "W", "W", "W", "W", "W", "M", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G"],
    ["W", "W", "M", "M", "W", "W", "W", "W", "W", "W", "M", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G"],
    ["W", "W", "M", "M", "W", "W", "W", "W", "W", "W", "M", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G"],
    ["W", "W", "M", "M", "W", "W", "W", "W", "W", "W", "M", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G"],
    ["W", "W", "M", "M", "W", "W", "W", "W", "W", "W", "M", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G"],],
    [new Structure(
        1,
        [0, 0],
        {
            "Started": ['img/Misc.png', [580, 200], [64, 64],
                1, [0], 'no', false, 0, 'no'],
            "Building": ['img/Human Buildings Summer.png', [264, 128], [128, 128],
                1, [0], 'no', false, 0, 'no'],
            "Completed": ['img/Human Buildings Summer.png', [264, 0], [128, 128],
                1, [0], 'no', false, 0, 'no']
        },
        null,
        null,
        { "gold": 100 },
        0.00001,
        [4, 4]),
    new Structure(
        2,
        [15, 18],
        {
            "Started": ['img/Misc.png', [580, 200], [64, 64],
                1, [0], 'no', false, 0, 'no'],
            "Building": ['img/Human Buildings Summer.png', [264, 128], [128, 128],
                1, [0], 'no', false, 0, 'no'],
            "Completed": ['img/Human Buildings Summer.png', [264, 0], [128, 128],
                1, [0], 'no', false, 0, 'no']
        },
        null,
        null,
        { "gold": 100 },
        0.00001,
        [4, 4])]);
//for testing, we're just going to send data to the client every second
setInterval(function () {
    let dt = Date.now() - lastUpdate;
    lastUpdate = Date.now();
    /*
      our message we want to send to the client: in this case it's just a random
      number that we generate on the server
    */
    mp.update(dt);
    io.emit('message', mp.toJSON());
}, frameRate);