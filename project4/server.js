import express from "express";
import bodyParser from "body-parser";
import multer from "multer";
import Datastore from "@seald-io/nedb";

const app = express();

app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const upload = multer({ dest: "uploads/" });

// ejs
app.set("view engine", "ejs");

// database
const database = new Datastore({
  filename: "database.txt",
  autoload: true,
});

// form page
app.get("/add", (req, res) => {
  database
    .find({})
    .sort({ timestamp: -1 })
    .exec((err, data) => {
      res.render("form.ejs", { posts: data });
    });
});

// add new post
app.post("/post", upload.none(), (req, res) => {
  const now = new Date();

  const doc = {
    text: req.body.text,
    date: now.toLocaleString(),
    timestamp: now.getTime(),
  };

  database.insert(doc, () => {
    res.redirect("/add");
  });
});

// json for bot
app.get("/all-posts", (req, res) => {
  database.find({}).exec((err, data) => {
    res.json({ posts: data });
  });
});

app.listen(7001, "0.0.0.0", () => {
    console.log("server running on port 7001");
  });