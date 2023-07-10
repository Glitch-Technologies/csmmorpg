tilemaps = {}

function draw() {
    const canvas = document.getElementById("canvas");
    var w = canvas.width;
    var h = canvas.height;
    if (canvas.getContext) {
    
        const ctx = canvas.getContext("2d");
        
        ctx.rect(0, 0, 1280, 720);
        ctx.fillStyle = "black";
        ctx.fill();


        ctx.fillStyle = "rgb(200, 0, 0)";
        ctx.fillRect(10, 10, 50, 50);

        ctx.fillStyle = "rgba(0, 0, 200, 0.5)";
        ctx.fillRect(30, 30, 50, 50);
        
        
        const img = new Image(100,100);
        
        img.onload = () => {
            //ctx.drawImage(img, 0, 0);
            //console.log("0");
        }
        img.src = "img/titles/title.png";
        renderMap(1,w,h,ctx,"myimage.png");

    }
  }

function renderMap(tilemap, width, height, ctx, src) {
    if (!(tilemap in tilemaps)) {
        loadMap(tilemap);
    }
    ctx.fillStyle = "black";
    ctx.font = "8px serif";
    //bitmapPath = "tilesets/"+tilemaps[tilemap]["metadata"]["tileset"]+".png";
    for(var x=0; x<1280; x+=16) {
        for(var y=0; y<720; y+=16) {
            const tileX = x
            const tileY = y
            const tile = new Image(16, 16);
            
            //const tile2 = createImageBitmap(bitmapPath, tileX, tileY, 48, 48)
            tile.src = src;
            
            //console.log(tileX)
            tile.onload = () => {ctx.drawImage(tile, tileX, tileY);ctx.fillText((tileY/16), tileX, tileY, 16, 16);};
            
        } 
    }
    
    

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
console.log(tilemaps[1]["metadata"]);
