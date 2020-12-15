const express = require("express");
const connection = require("./config");

const port = 3000;
const app = express();

connection.connect(function (err) {
  if (err) {
    console.error("error connecting: " + err.stack);
    return;
  }
  console.log("connected as id " + connection.threadId);
});

app.use(express.json());

// 1 - GET Main Route
app.get("/planes", (req, res) => {
  connection.query("SELECT * from movies", (err, results) => {
    if (err) {
      res.status(500).send("Error retrieving data");
    } else {
      res.status(200).json(results);
    }
  });
});

// 2 - GET Plane id

// 3 - GET planes filtered x3

// 4 - GET ordered ASC DESC

// 5 - POST plane

// 6 - PUT plane

// 7 - PUT on boolean value

// 8 - DELETE plane

// 9 - DELETE all non fighters

app.listen(port, () => {
  console.log(`Server is runing on 3000`);
});
