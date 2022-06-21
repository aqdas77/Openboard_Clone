const express = require("express")
const socket = require("socket.io")

const app = express();                      //initialized and server ready
app.use(express.static("public"));          //public and app.js both are at same level

let port = 5000;
let server = app.listen(port,()=>{
 console.log("server is listening on port 5000")
})

let io= socket(server);
io.on("connection",(socket)=>{
    //Received data
    socket.on("beginPath",(data)=>{
        //Transfer data to all connected network including my network
        io.sockets.emit("beginPath",data);
    })
    socket.on("drawStroke",(data)=>{
        io.sockets.emit("drawStroke",data)
    })

    socket.on("redoUndo",(data)=>{
        io.sockets.emit("redoUndo",data);
    })
    socket.on("pencilcolor",(data)=>{
        io.sockets.emit("pencilcolor",data);
    })
    socket.on("erase",(data)=>{
        io.sockets.emit("erase",data);
    })
    socket.on("pencilwidth",(data)=>{
        io.sockets.emit("pencilwidth",data);
    })
    socket.on("eraserwidth",(data)=>{
        io.sockets.emit("eraserwidth",data);
    })
})