const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const path = require("path");

app.use(cors());
app.use(morgan("tiny"));

app.use(express.static("C:/Users/kolin/Desktop/chat-front/"+"/frontend"));

//app.get("/", function(req, res){
//    res.sendFile(path.join("C:/Users/kolin/Desktop/chat-front/frontend"));
//});

app.listen(5000, "192.168.0.13");