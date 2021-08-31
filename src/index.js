const express = require("express");

const app = express();

app.listen(3000);

app.get("/", (req, res) => {
    const query = req.query;
    res.send(query);
});

app.get("/test", (req, res) => {
    res.send("test");
});

