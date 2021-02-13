const express = require("express");
const { MongoClient } = require("mongodb");

const app = express();
const port = 3000;

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:8080");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,content-type");
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let database, collection;
async function connectDatabase() {
  await client.connect();
  database = client.db("todolist");
  collection = database.collection("todos");
}

app.use(require("body-parser").json());

app.post("/todo", async (req, res) => {
  try {
    await collection.insertOne(req.body);
    res.sendStatus(201);
  } catch {
    res.sendStatus(400);
  }
});

app.delete("/todo", async (req, res) => {
  try {
    const deleteID = { id: Number(req.query.id) };
    console.log(deleteID);
    const result = await collection.deleteOne(deleteID);
    if (result.deletedCount === 1) {
      res.sendStatus(204);
    } else {
      res.sendStatus(404);
    }
  } catch {
    res.sendStatus(400);
  }
});

app.get("/maxId", async (req, res) => {
  try {
    const query = {};
    const options = {
      sort: { id: -1 },
      projection: { id: 1 },
    };
    const maxId = await collection.findOne(query, options);
    res.status(200).send({ maxid: maxId === null ? 0 : maxId.id });
  } catch {
    res.sendStatus(400);
  }
});

app.patch("/todoText", async (req, res) => {
  try {
    const filter = { id: req.body.id };
    const options = {};
    const updateText = {
      $set: {
        text: req.body.newText,
      },
    };
    await collection.updateOne(filter, updateText, options);
    res.sendStatus(200);
  } catch {
    res.sendStatus(400);
  }
});

app.patch("/todoChecked", async (req, res) => {
  try {
    const filter = { id: req.body.id };
    const options = {};
    const updateCheckStatus = {
      $set: {
        isChecked: req.body.isChecked,
      },
    };
    await collection.updateOne(filter, updateCheckStatus, options);
    res.sendStatus(200);
  } catch {
    res.sendStatus(400);
  }
});

app.get("/todos", async (req, res) => {
  try {
    const query = {};
    const options = {
      projection: { _id: 0 },
    };
    const cursor = collection.find(query, options);
    let todoArr = [];
    await cursor.forEach(item => {
      todoArr.push(item);
    });
    res.status(200).json(todoArr);
  } catch {
    res.sendStatus(400);
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
  connectDatabase();
});
