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
  connection.query("SELECT * from planes", (err, results) => {
    if (err) {
      res.status(500).send("Error retrieving data");
    } else {
      res.status(200).json(results);
    }
  });
});

// 2 - GET Plane id
app.get("/planes/:id", (req, res) => {
  connection.query(
    "SELECT * from planes WHERE id=?",
    [req.params.id],
    (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error retrieving data");
      } else {
        res.status(200).json(results);
      }
    }
  );
});

// 3 - GET planes filtered
// 3.1 - Contain
app.get("/search", (req, res) => {
  const { include } = req.query;
  connection.query(
    `SELECT * FROM planes WHERE plane LIKE '%${include}%'`,
    (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error retrieving data");
      } else {
        res.status(200).json(results);
      }
    }
  );
});

app.get("/starts", (req, res) => {
  const { starts } = req.query;
  connection.query(
    `SELECT * FROM planes WHERE plane LIKE '${starts}%'`,
    (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error retrieving data");
      } else {
        res.status(200).json(results);
      }
    }
  );
});

app.get("/greater", (req, res) => {
  connection.query(
    `SELECT * FROM planes WHERE introduction >= ?`,
    [req.query.date],
    (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error retrieving data");
      } else {
        res.status(200).json(results);
      }
    }
  );
});

// 4 - GET ordered ASC DESC

// 5 - POST plane

// 6 - PUT plane

// 7 - PUT on boolean value

// 8 - DELETE plane

// 9 - DELETE all non fighters

app.listen(port, () => {
  console.log(`Server is runing on 3000`);
});
