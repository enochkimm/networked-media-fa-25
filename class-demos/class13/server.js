// importing the express library
// always put imports at the top
const express = require('express')

// setting up the body parser library
const parser = require('body-parser')
const encodedParser = parser.urlencoded( {extended: true })

// setting up multer library
const multer = require('multer')
const uploadProcessor = multer( {dest: 'assets/upload/' })

// create an instance of the express app
// just like we do with let date = new Date()
const app = express()

// middleware to set up the public folder to serve basic html files
app.use(express.static('assets'))
app.use(encodedParser)
// setting the templating engine to use ejs 
app.set('view engine', 'ejs')

// a global variable array to store all of the message that come in from our client
// this variable stores data from the GET request in guestbook.html
let messages = []

// this stores data from the POST request in post.ejs
let posts = [
    {
        text: "hi",
        imgSrc: "/existing/img.png",
        time: "date"
    }
]

// routes always go before the app.listen
// request: data that comes from the user / client
// response: data that goes back to the user/client
app.get('/', (request, response)=>{
    // response.send('server is working')
    // response.sendFile('htmls/guestbook.html', {root:})

    let data = {
        message: "hello",
        paths: ["path1", "path2", "path3"]
    }

    data.visible = true
    // 2 params:
    // #1: name of the .ejs file that exists in views
    // #2: data to be sent, as an object
    response.render('index.ejs', data)
})

// this handles the GET request coming from guestbook.html
// we use app.get because the attribute method='GET' in guestbook.html
app.get('/submit', (request, response)=>{
    // query is everything that comes after the ? in the url
    // ?guest=sam&message=hi+this+is+a+cool+site%21&submitbtn=write
    console.log(request.query.guest)

    let guest = request.query.guest

    // object that holds the data that comes in from ONE form request
    let messageData = {
        username: request.query.guest,
        text: request.query.message
    }

    // adds the individual data to messages array
    messages.push(messageData)

    response.send('thank you for writing a message, ' + guest) 
})

// new route that goes after the submit route
// this displays all the data from the GET request in guestbook.html
// we are using the messages array to retrieve this information
app.get('/all-messages', (request, response)=>{
    // constructing a string that will contain HTML
    let allMessages = ''
    for(let m of messages){
        allMessages += m.username + " says " + m.text + "<br/>"
    }
    // send the data back to the client as a plain html response
    response.send(allMessages)
})

// display my ejs file
// every ejs must have an associate app.get with a render
// this displays the data from the POST request in post.ejs
app.get('/post', (req, res)=>{

    // allPosts will be accessed on the ejs side
    // posts is the array storing the POST request data from post.ejs
    let data = {
        allPosts: posts
    }
    res.render('post.ejs', data)
})

// this handles the action="/upload" in the POST request in post.ejs
// instead of app.get, we use app.post because method="POST" in post.ejs
app.post('/upload', uploadProcessor.single('theImage') , (req, res)=>{
    // instead of request.query, we use request.body to retrieve body data
    // body can hold image data, query cannot hold image data
    console.log(req.body)

    // store the text from the body in an object
    let singlePost = {
        text: req.body.status,
    }

    // add the time to the post data
    let date = new Date()
    singlePost.time = date.toLocaleString()

    // if there is a file uploaded, store its file name and location inside our object
    // our files are set to go to this location from line 11
    if(req.file){
        singlePost.imgSrc = "/upload/" + req.file.filename
    }

    // {text: stores status, time: stores time of post}
    // posts[0].text

    // add the post to the front of the array
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/unshift
    posts.unshift(singlePost)

    // we don't want to send a response, we want to send the user back to the /post page
    res.redirect('/post')
})

// sets up our server
// this should always go at the end of the file
app.listen(5001, ()=>{
    console.log('server started')
})