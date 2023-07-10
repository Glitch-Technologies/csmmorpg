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
            console.log("0")
        }
        img.src = "img/titles/title.png";

    }
  }

function renderMap(tilemap) {
    
}

  draw();