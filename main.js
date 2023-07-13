/* Todo:
- Add forced timeout for all image loading in case of network failure on user end.
*/

const tilemaps = {}
const tiles = {}
const players = {}
var flag = false;
var mapWidth = 0;
var mapHeight = 0;

const player = {
    username: "Noob", 
    x: 0,
    y: 0,
};

players[player.username] = player;

const canvas = document.getElementById("canvas");
var w = canvas.width;
var h = canvas.height;
const ctx = canvas.getContext("2d");

speed = 8;
moveDelay = 100;
moveTimeout = 0;
setInterval(function () {
    if (moveTimeout>0) {
        moveTimeout-=100;
    }
}, 100);



async function draw() {
    const skybox = new Image();
    skybox.src = "img/battlebacks/skybox.png";

    skybox.onload = () => {
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(skybox, 0, 0, w, h);
        
        
        const img = new Image(100,100);
        
        img.onload = () => {
            //ctx.drawImage(img, 0, 0);
            //console.log("0");
        }
        img.src = "img/titles/title.png";
        renderMap(0,w,h,ctx,0,0);            
    }
}

function watermark(ctx) {
    ctx.fillStyle = "rgb(200, 0, 0)";
    ctx.fillRect(10, 10, 50, 50);

    ctx.fillStyle = "rgba(0, 0, 200, 0.5)";
    ctx.fillRect(30, 30, 50, 50);
}

async function renderMap(tilemap, width, height, ctx, cameraX, cameraY) {
    if (!(tilemap in tilemaps)) {
        loadMap(tilemap);
    }
    ctx.fillStyle = "black";
    ctx.font = "16px serif";
    bitmapPath = "tilesets/"+tilemaps[tilemap]["metadata"]["tileset"]+".png";
    xOff = 16
    yOff = 24
    vRows = 26
    vCols = 14
    const hexToDecimal = hex => parseInt(hex, 16);
    for(var y=0; y<vCols; y++) {
        for(var x=0; x<vRows; x++) {
            const cX = x
            const cY = y
            const tileX = x*48+xOff;
            const tileY = y*48+yOff;
            mapWidth = tilemaps[tilemap]["metadata"]["width"]
            mapHeight = tilemaps[tilemap]["metadata"]["height"]
            const mapX = (cameraX + cX)
            const mapY = (cameraY + cY)
            const mapPos = mapX + mapY*mapWidth
            const tileIndex = hexToDecimal(tilemaps[tilemap]["map"][mapPos]);
            //console.log(mapPos);
            //console.log(hexToDecimal(tileIndex))
            //console.log(tileX)
            //tile.onload = () => {ctx.drawImage(tile, tileX, tileY);ctx.fillText((tileY/16), tileX, tileY, 16, 16);};
            if( !(mapX>=mapWidth) && !(mapY>=mapHeight) ) {
                if (!(tileIndex in tiles)) {
                    loadTile(tileIndex, bitmapPath)
                }
                ctx.drawImage(await tiles[tileIndex], tileX, tileY);
            }
        } 
    }
    
    playersList = Object.keys(players);
    for(var c=0; c<playersList.length; c++) {
        const playerSprite = new Image(16,16);
        playerSprite.src = "player.png";
        const playerKey = playersList[c];
        const playerDrawn = players[playerKey]
        //console.log(playerDrawn)
        playerSprite.onload = () => {ctx.drawImage(playerSprite, playerDrawn.x*48+xOff, playerDrawn.y*48+yOff, 48, 48)}
    }
    watermark(ctx);
}

function loadTile(tileIndex, bitmapPath) {
    const bitmap = new Image(768,768);
    bitmap.src = bitmapPath;
    const t = setInterval(function(){flag = bitmap.complete},10);
    checkFlag(tileIndex, bitmap);
    tiles[tileIndex] = createImageBitmap(bitmap, (tileIndex%16)*48, Math.trunc(tileIndex/16)*48, 48, 48);
    flag = false;
    
}

function checkFlag() {
    if(flag === false) {
       window.setTimeout(checkFlag, 100); /* this checks the flag every 100 milliseconds*/
    } else {
        return
    }
}

function loadMap(tilemap) {
    tilemaps[tilemap] = JSON.parse(fetchMap(tilemap));
}

function fetchMap(tilemap) {
    tilemapInt = (tilemap).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})
    tilemapPath = "tilemaps/map" + tilemapInt + ".json";
    altGetJSON(tilemapPath);
    console.log("GET: " + localStorage.getItem("temp"))
    return localStorage.getItem("temp");
}

const getJSON = async(path) => {
    const response = await fetch(path);
    const json = await response.json();
    return json;
}

function altGetJSON(path) {
    let iterator = fetch(path);
    iterator
    .then(response => response.json())
    .then(post => JSON.stringify(post))
    .then(text => localStorage.setItem("temp", text));;;
}

/* Use to debug new keypress ids
document.addEventListener('keypress', (event) => {
    var name = event.key;
    var code = event.code;
    // Alert the key name and key code on keydown
    alert(`Key pressed ${name} \r\n Key code value: ${code}`);
}, false);
*/

window.addEventListener("keydown", function(event) {
    if (event.defaultPrevented) {
      return;
    }
    if(moveTimeout === 0) {
        if ((event.code === "ArrowDown" || event.code === "KeyS") && player.y<mapHeight-1){
            player.y++;
            moveTimeout+=moveDelay
            draw();
        } else if ((event.code === "ArrowUp" || event.code === "KeyW") && player.y>0){
            player.y--;
            moveTimeout+=moveDelay
            draw();
        } else if ((event.code === "ArrowLeft" || event.code === "KeyA") && player.x>0){
            player.x--;
            moveTimeout+=moveDelay
            draw();
        } else if ((event.code === "ArrowRight" || event.code === "KeyD") && player.x<mapWidth-1){
            player.x++;
            moveTimeout+=moveDelay
            draw();
        }
    }
    
    event.preventDefault();
  }, true);

draw();