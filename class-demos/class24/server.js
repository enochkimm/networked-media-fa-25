/*********************************************
library imports
*********************************************/
const express = require("express"); 
const multer = require("multer");   
const bodyParser = require("body-parser");
const nedb = require("@seald-io/nedb")

/*********************************************
library configurations:
- setting up express server via app
- setting up how the parser interprets data
- setting up where multer stores images
- setting up database files
*********************************************/
const app = express();
const urlEncodedParser = bodyParser.urlencoded({ extended: true }); 
const upload = multer({
  dest: "public/uploads",
});
let database = new nedb({
  filename: "database.txt",
  autoload: true 
})

/*********************************************
middleware setup
*********************************************/
app.use(express.static("public"));
app.use(urlEncodedParser);
app.set("view engine", "ejs");

/*********************************************
ROUTES: determining what locations are accessible via URL
*********************************************/
app.get("/", (request, response) => {
  let query = {} 
  database.find(query).exec( (err, data)=>{
    response.render('index.ejs', {posts: data})
  } )
});

app.post("/upload", upload.single("theimage"), (req, res)=>{

  let currentDate = new Date()

  let data = {
    text: req.body.text,
    date: currentDate.toLocaleString(),
    timestamp: currentDate.getTime(),
    likes: 0
  }

  if(req.file){
    data.image = "/uploads/" + req.file.filename
  }

  database.insert(data, (err, newData)=>{
    console.log(newData)
    res.redirect("/")
  })
})

app.post('/like', (req, res)=>{
  let retrievedId = req.body.postId

  let query = {
    _id: retrievedId
  }

  let update = {
    $inc: {likes: 1}
  }

  database.update(query, update, {}, (err, numUpdated)=>{
    res.redirect('/')
  })
})

/////////////////////////////////////////////////
//        add new routes below this line!      //
/////////////////////////////////////////////////

/*********************************************
server listener for when requests are made 
to the server
- we don't really need to modify this
- needs to go at the end
*********************************************/
app.listen(6001, () => {
  console.log("server started on port 6001");
});
