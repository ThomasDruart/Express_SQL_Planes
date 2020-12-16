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
app.get("/planes/order/:ordered", (req, res) => {
  const { ordered } = req.params;
  let sql = () => {
    if (ordered === "asc") {
      return "SELECT * FROM planes ORDER BY nb_built ASC";
    } else if (ordered === "desc") {
      return "SELECT * FROM planes ORDER BY nb_built DESC";
    }
  };
  connection.query(sql(), (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).send("Error retrieving data");
    } else {
      res.status(200).json(results);
    }
  });
});

// 5 - POST plane
app.post("/planes", (req, res) => {
  const { id, plane, introduction, fighter, nb_built } = req.body;
  connection.query(
    "INSERT INTO planes(id, plane, introduction, fighter, nb_built) VALUES(?, ?, ?, ?, ?)",
    [id, plane, introduction, fighter, nb_built],
    (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error saving a plane");
      } else {
        res.status(200).send("Successfully saved");
      }
    }
  );
});

// 6 - PUT plane
app.put("/planes/:id", (req, res) => {
  const idPlanes = req.params.id;
  const newPlane = req.body;

  connection.query(
    "UPDATE planes SET ? WHERE id = ?",
    [newPlane, idPlanes],
    (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error updating a plane");
      } else {
        res.status(200).send("plane updated successfully 🎉");
      }
    }
  );
});

// 7 - PUT on boolean value

// 8 - DELETE plane
app.delete("/planes/:id", (req, res) => {
  const idPlane = req.params.id;

  connection.query(
    "DELETE FROM planes WHERE id = ?",
    [idPlane],
    (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send("😱 Error deleting a plane");
      } else {
        res.status(200).send("🎉 plane deleted!");
      }
    }
  );
});

// 9 - DELETE all non fighters
app.delete("/planes/fighters", (req, res) => {
  connection.query("DELETE FROM planes WHERE fighters = 0", (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).send("😱 Error deleting a plane");
    } else {
      res.status(200).send("🎉 plane deleted!");
    }
  });
});

app.listen(port, () => {
  console.log(`Server is runing on 3000`);
});
