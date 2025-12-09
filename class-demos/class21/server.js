// how do we know this is a npm project?
// A: we can see the package.json. if we ran npm install the node_modules/ folder also exists

// what command do we run to start an npm project?
// A: npm init / npm init -y

// what does the below chunk of code do?
// A: imports the packages/libraries that we are installing
const express = require("express"); 
const multer = require("multer");   
const bodyParser = require("body-parser");
const nedb = require("@seald-io/nedb")

// what does this line do?
// A: the bits and bytes will be formatted in a particular way
// this is based off the enctype that comes in from the form
const urlEncodedParser = bodyParser.urlencoded({ extended: true }); 

// what is app?
// A: creating an instance of express
// assigning app to use the express server
const app = express();

// what is this configuring?
// A: sets the destination on the server where images are stored
// if the uploads/ folder is not created, make the folder
const upload = multer({
  dest: "public/uploads",
});

// what is this configuring?
// A: creates the database.txt file if it does not exist
// if file created & has data, load the database
let database = new nedb({
  filename: "database.txt",
  autoload: true 
})

// what do each of these statements do?
// write the answer next to the line of code
app.use(express.static("public"));    // A: tells the app to look in public/ folder for static assets (html, css, front-end js)
app.use(urlEncodedParser);            // A: tells express server (app) to use specific bits/bytes
app.set("view engine", "ejs");        // A: tells express server (app) to use template engine. specifically ejs

// what type of request is this? what does it do?
// A: GET request (app.get)
// handles what happens when client makes a request at / route
app.get("/", (request, response) => {

  // how does this database search work?
  // A: create an empty search to retrieve everything inside the db
  // once we have found everything, execute the next action
  // data parameter will be populated with the entire db
  let query = {} 
  database.find(query).exec( (err, data)=>{

    // data is an array of the entire db
    // posts is sent to ejs that will be an array we need to display in ejs
    response.render('index.ejs', {posts: data})
  } )
});

// what are the three parameters in this function?
// A: 1st: route
// 2nd: use multer to upload a single file to the public/uploads/ folder. this file comes in via the input type=file name=theimage
// this is also how we are populating the body of the request
// 3rd: anonymous function to handle the req
app.post("/upload", upload.single("theimage"), (req, res)=>{

  let currentDate = new Date()

  // what type of data structure is this?
  // A: object {}
  let data = {
    text: req.body.text,
    date: currentDate.toLocaleString(),
    timestamp: currentDate.getTime()
  }

  // why do we write this if statement?
  // A: to check if the request has a file
  // if no file, don't save file path
  if(req.file){
    data.image = "/uploads/" + req.file.filename
  }

  // what parameters go into this insert function?
  // A: 1st: which data/variable/object that we want to add to the database
  // 2nd: anonymous function, newData is the data that is added to the db INCLUDING the _id property
  database.insert(data, (err, newData)=>{
    console.log(newData)
    res.redirect("/")
  })
})

// what does the number signify?
// A: PORT
// how do we access this on the web?
// A: ip-address:PORT
// 127.0.0.1:6001
// localhost:6001
app.listen(6001, () => {
  console.log("server started on port 6001");
});
