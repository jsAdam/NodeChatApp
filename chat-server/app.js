const express = require("express");
const app = express();
const morgan = require("morgan");
const chatRoutes = require("./routes/chat");
const bodyParser = require("body-parser");
const cors = require("cors");

app.use(cors());
app.use(morgan("tiny"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/users", chatRoutes);

app.use((req, res, next) => {
    var err = new Error("Not Found");
    err.status = 404;
    return next(err);
});

//if(app.get("env") === "development"){
    app.use((err, req, res, next) => {
        console.log(err);
        res.status(err.status || 500);
        return res.json({
            message: err.message,
            error: err
        });
    });
//}

app.listen(3000, "192.168.0.13", () => {
    console.log("Listening on port 3000!");
});