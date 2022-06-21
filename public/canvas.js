let canvas = document.querySelector("canvas"); //canvas is html element  //canvas api is provided by browser
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let pencilColor = document.querySelectorAll(".pencil-color");
let pencilWidthElem = document.querySelector(".pencil-width");
let eraserWidthElem = document.querySelector(".eraser-width");
let download=document.querySelector(".download");
let redo = document.querySelector(".redo");
let undo = document.querySelector(".undo");

let penColor = "black";
let eraserColor = "white";
let penWidth = pencilWidthElem.value;
let eraserWidth = eraserWidthElem.value;

let undoRedoTracker=[];
let empty_canvas= document.createElement("canvas");
let empty_canvas_url=empty_canvas.toDataURL();
undoRedoTracker.push(empty_canvas_url);
let track = 0;

let mouseDown = false;

let tool = canvas.getContext("2d"); //Returns an object that provides methods and properties for drawing

tool.lineWidth = penWidth;
tool.strokeStyle = penColor;

// tool.beginPath();  //new graphic (path)
// tool.moveTo(10,10);  //start  point
// tool.lineTo(100,150);  //end point if this lineTo is last
// tool.lineTo(200,200);  //continue line from (100,150) to (200,200)
// tool.stroke();             //to fill graphic/color

//mousedown(push) -> start new path
//mousemove       -> path fill(graphics)

canvas.addEventListener("mousedown", (e) => {
  
  mouseDown = true;
  let data = {
    x: e.clientX,
    y: e.clientY,
  }
  //send data to server
  socket.emit("beginPath",data);
});

canvas.addEventListener("mousemove", (e) => {
  let data="";
  if (mouseDown) 
  {
      data = { x: e.clientX, 
                 y: e.clientY,
                 }
  }
  socket.emit("drawStroke",data)
});

canvas.addEventListener("mouseup", (e) => {
  mouseDown = false;
  let url=canvas.toDataURL();
  undoRedoTracker.push(url);
  track= undoRedoTracker.length-1;

});

undo.addEventListener("click",(e)=>{
  if(track>0)
  track--;
  let data = {
    trackValue : track,
    undoRedoTracker
  }
  socket.emit("redoUndo",data);
})
redo.addEventListener("click",(e)=>{
  if(track< undoRedoTracker.length-1)
  track++;
  let data={
    trackValue : track,
    undoRedoTracker
  }
  socket.emit("redoUndo",data);
})

function undoRedoCanvas(trackObj){
  track = trackObj.trackValue;
  undoRedoTracker = trackObj.undoRedoTracker;

  let url = undoRedoTracker[track];
  let img= new Image();
  canvas.getContext("2d").clearRect(0,0,canvas.width,canvas.height);
  img.src = url;
  img.onload = (e)=>{
    tool.drawImage(img,0,0,canvas.width,canvas.height);      //starting coordinate and ending coordinate
    
  }
}
function beginPath(strokeObj) {
  tool.beginPath();
  tool.moveTo(strokeObj.x, strokeObj.y); //clientX,clientY
}
function drawStroke(strokeObj) {
  tool.lineTo(strokeObj.x, strokeObj.y);
  tool.stroke();
}
pencilColor.forEach((colorElem) => {
  colorElem.addEventListener("click", (e) => {
      let data = { 
        lineWidth : pencilWidthElem.value,
        strokeStyle : colorElem.classList[0]
      }
      socket.emit("pencilcolor",data);
     
  })
})
pencilWidthElem.addEventListener("change", (e) => {
 let data = {
  lineWidth : pencilWidthElem.value
 }
 socket.emit("pencilwidth",data)
});

eraserWidthElem.addEventListener("change", (e) => {
  let data ={
    lineWidth : eraserWidthElem.value
  }
  socket.emit("eraserwidth",data)
  
});

eraser.addEventListener("click", (e) => {
  let data="";
  if (eraserFlag) {
      data = {
        strokeStyle : eraserColor,
         lineWidth : eraserWidth,
      }
  } else {
     data = {
      strokeStyle : penColor,
      lineWidth : penWidth,
     }
  }
  socket.emit("erase",data)
  
})

download.addEventListener("click",(e)=>{
  let url= canvas.toDataURL();
  let a=document.createElement("a");
  a.href = url;
  a.download ="board.jpg";
  a.click();
})

socket.on("beginPath",(data)=>{
  //data from server
  beginPath(data);
})

socket.on("drawStroke",(data)=>{
  drawStroke(data);
})

socket.on("redoUndo",(data)=>{
  undoRedoCanvas(data);
})

socket.on("pencilcolor",(data)=>{
    tool.lineWidth = data.lineWidth;
   tool.strokeStyle = data.strokeStyle;
        canvas.getContext("2d").beginPath();
})

socket.on("erase",(data)=>{
  tool.strokeStyle = data.strokeStyle;
  tool.lineWidth = data.lineWidth;
  canvas.getContext("2d").beginPath();
})

socket.on("pencilwidth",(data)=>{
  tool.lineWidth= data.lineWidth;
  canvas.getContext("2d").beginPath();
})

socket.on("eraserwidth",(data)=>{
  tool.lineWidth=data.lineWidth;
  canvas.getContext("2d").beginPath();
})