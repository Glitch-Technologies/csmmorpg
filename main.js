tilemaps = {}
tiles = {}
async function draw() {
    const canvas = document.getElementById("canvas");
    var w = canvas.width;
    var h = canvas.height;
    if (canvas.getContext) {
    
        const ctx = canvas.getContext("2d");
        
        const skybox = new Image();
        skybox.src = "img/battlebacks/skybox.png";

        skybox.onload = () => {
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
            const mapWidth = tilemaps[tilemap]["metadata"]["width"]
            const mapHeight = tilemaps[tilemap]["metadata"]["height"]
            const mapX = (cameraX + cX)
            const mapY = (cameraY + cY)
            const mapPos = mapX + mapY*mapWidth
            const tileIndex = hexToDecimal(tilemaps[tilemap]["map"][mapPos]);
            //console.log(mapPos);
            //console.log(hexToDecimal(tileIndex))
            //console.log(tileX)
            //tile.onload = () => {ctx.drawImage(tile, tileX, tileY);ctx.fillText((tileY/16), tileX, tileY, 16, 16);};
            if( !(mapX>=mapWidth) && !(mapY>=mapHeight) ) {
                loadTile(tileIndex, bitmapPath)
                ctx.drawImage(await tiles[tileIndex], tileX, tileY);
            }
            
        } 
    }
    watermark(ctx);
    
    

}

function loadTile(tileIndex, bitmapPath) {
    const bitmap = new Image();
    bitmap.src = bitmapPath;
    
    tiles[tileIndex] = createImageBitmap(bitmap, (tileIndex%16)*48, Math.trunc(tileIndex/16)*48, 48, 48)
}

function loadMap(tilemap) {
    tilemaps[tilemap] = JSON.parse(fetchMap(tilemap));
}

function fetchMap(tilemap) {
    tilemapint = (tilemap).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})
    tilemapPath = "tilemaps/map" + tilemapint + ".json";
    altGetJSON(tilemapPath);
    console.log("GET: " + localStorage.getItem("temp"))
    return localStorage.getItem("temp");
    /*const tilemapdata = await getJSON(tilemapPath);
    console.log("GET: " + JSON.stringify(tilemapdata));
    return tilemapdata;*/
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
    //localStorage.setItem("temp", post)
}


draw();