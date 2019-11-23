const express = require("express");
const path = require("path");

const port = 3030;

const router = express.Router();
router.get("/", function(req, res) {
    res.sendFile("public/index.html", {
        root: path.join(__dirname, "../"),
    });
});

const server = express();
server.use(express.static("./public"));
server.use("*", router);
server.listen(port);
console.log(`Listening port ${port}`);
