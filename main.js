tilemaps = {}

function draw() {
    const canvas = document.getElementById("canvas");
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
            console.log("0");
        }
        img.src = "img/titles/title.png";

    }
  }

function renderMap(tilemap) {
    if (!("tilemap" in tilemaps)) {
        loadMap(tilemap)
    }
    

}

function loadMap(tilemap) {
    tilemaps[tilemap.toString] = fetchMap(tilemap);
}

const fetchMap = async(tilemap) => {
    tilemapint = (tilemap).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})
    tilemapPath = "tilemaps/map" + tilemapint + ".json";
    tilemapdata = await getJSON(tilemapPath);
    console.log("GET: " + JSON.stringify(tilemapdata["metadata"]));
    return tilemapdata;
}

const getJSON = async(path) => {
    const response = await fetch(path);
    const json = await response.json();
    return json;
}

renderMap(0)
console.log(tilemaps);
draw();
